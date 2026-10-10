import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. OCR & Medical Document Intelligence Extraction
app.post('/api/health/ocr-extract', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'en', note = '' } = req.body;

    if (!ai) {
      // High-fidelity fallback if no API key is yet configured
      res.json({
        success: true,
        source: 'smart-fallback',
        extracted: {
          documentType: 'Lab Report',
          facilityName: 'Dr. Lal PathLabs & Diagnostics',
          doctorName: 'Dr. S. K. Gupta, MD (Pathology)',
          date: new Date().toISOString().split('T')[0],
          confidence: 95,
          diagnoses: ['Dyslipidemia (Elevated LDL)', 'Borderline Prediabetes', 'Vitamin D Deficiency'],
          medicines: [
            {
              name: 'Metformin Hydrochloride',
              dosage: '500 mg',
              frequency: '1-0-1',
              route: 'Oral',
              timing: 'After Food',
              duration: '90 Days',
              purpose: 'Blood glucose regulation',
            },
            {
              name: 'Atorvastatin',
              dosage: '10 mg',
              frequency: '0-0-1',
              route: 'Oral',
              timing: 'After Food',
              duration: '60 Days',
              purpose: 'Cholesterol & LDL reduction',
            },
          ],
          labTests: [
            {
              testName: 'HbA1c (Glycated Hemoglobin)',
              value: '7.1',
              numericValue: 7.1,
              unit: '%',
              referenceRange: '4.0 - 5.6%',
              status: 'High',
              explanation: 'Indicates average blood sugar over the last 3 months is above normal target.',
              category: 'Diabetes',
            },
            {
              testName: 'Fasting Blood Sugar',
              value: '132',
              numericValue: 132,
              unit: 'mg/dL',
              referenceRange: '70 - 99 mg/dL',
              status: 'High',
              explanation: 'Elevated morning glucose requiring dietary carbohydrate regulation.',
              category: 'Diabetes',
            },
            {
              testName: 'LDL Cholesterol',
              value: '148',
              numericValue: 148,
              unit: 'mg/dL',
              referenceRange: '< 100 mg/dL',
              status: 'High',
              explanation: 'Sub-optimal LDL level; statin compliance and brisk walks recommended.',
              category: 'Lipid',
            },
          ],
          plainLanguageSummary:
            language === 'hi'
              ? 'Aapki report mein HbA1c 7.1% aur Fasting Blood Sugar 132 mg/dL hai jo Type-2 diabetes ki sthiti dikhata hai. LDL cholesterol bhi 148 mg/dL hai. Doctor ki salah ke anusar dawai niyamit lein, meetha aur oily khana kam karein aur rozana 30 minute tezi se chalein.'
              : 'Your report shows HbA1c at 7.1% and Fasting Blood Sugar at 132 mg/dL indicating elevated glycemic levels. LDL cholesterol is also elevated at 148 mg/dL. Take your prescribed medications on time, reduce simple sugars and fried food, and walk 30 minutes daily.',
          abnormalValuesExplained:
            'HbA1c is above 7.0% which reflects past 90 days average blood sugar. LDL at 148 mg/dL indicates lipid elevation which can lead to plaque buildup over time.',
          foodDrugInteractions: [
            'Avoid grapefruit juice when taking Atorvastatin.',
            'Take Metformin with meals to avoid mild stomach upset.',
          ],
          lifestyleAdvice: [
            'Brisk walking for 30 minutes 5 days a week.',
            'Replace white refined flour and rice with whole grains & ragi.',
            'Drink at least 2.5L water throughout the day.',
          ],
          questionsForDoctor: [
            'Is the current dosage of Metformin 500mg sufficient or needs titration?',
            'When should the repeat lipid profile and HbA1c test be scheduled?',
          ],
          fhirResource: {
            resourceType: 'DiagnosticReport',
            status: 'final',
            code: { text: 'Automated OCR Health Extraction' },
            effectiveDateTime: new Date().toISOString(),
          },
        },
      });
      return;
    }

    const systemPrompt = `You are an expert clinical medical intelligence engine and OCR document extractor specialized in Indian and global medical documents.
You can read hospital discharge summaries, clinical lab reports, printed and handwritten doctor prescriptions (including bilingual text in English, Hindi, or other regional scripts).

Analyze the attached document carefully and return a valid JSON object matching this schema:
{
  "documentType": "Prescription" | "Lab Report" | "Discharge Summary" | "Diagnostic Imaging",
  "facilityName": string (hospital, lab, or clinic name),
  "doctorName": string (treating doctor or pathologist),
  "date": string (YYYY-MM-DD or as found),
  "confidence": number (between 70 and 99),
  "diagnoses": string[] (extracted diagnoses, clinical impressions, or symptoms),
  "medicines": [
    {
      "name": string (brand and generic name),
      "dosage": string (e.g., "500 mg", "40 mg"),
      "frequency": string (e.g., "1-0-1", "Once daily", "BD"),
      "route": string (e.g., "Oral", "Topical"),
      "timing": "Before Food" | "After Food" | "With Food" | "Anytime",
      "duration": string (e.g., "5 Days", "Ongoing"),
      "purpose": string (indication, e.g. "Control Blood Pressure"),
      "isHighRisk": boolean
    }
  ],
  "labTests": [
    {
      "testName": string (e.g., "HbA1c", "Serum Creatinine", "Platelet Count"),
      "value": string,
      "numericValue": number or null,
      "unit": string,
      "referenceRange": string,
      "status": "Normal" | "High" | "Low" | "Critical",
      "explanation": string (what this means in plain language),
      "category": "Diabetes" | "Lipid" | "Liver" | "Kidney" | "CBC" | "Thyroid" | "General"
    }
  ],
  "plainLanguageSummary": string (Comprehensive, compassionate explanation in requested language: ${language}. Explaining the overall health situation, what medicines to take, and next steps in simple terms without medical jargon),
  "abnormalValuesExplained": string (Detailed breakdown of each out-of-range value and what risks or meaning it has for the patient),
  "foodDrugInteractions": string[] (Clear warnings on what foods, drinks, or supplements to avoid with these medicines),
  "lifestyleAdvice": string[] (Practical diet, hydration, exercise, and sleep tips tailored to this patient's findings),
  "questionsForDoctor": string[] (3-4 high-value questions the patient should ask their doctor at their next visit),
  "fhirResource": {
    "resourceType": "DiagnosticReport" or "MedicationRequest",
    "status": "final" or "active",
    "code": { "text": string }
  }
}

Respond ONLY with raw JSON. Do not include markdown code blocks or backticks.`;

    let contents: any;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      contents = {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Extract all medical data, prescriptions, test results, doctor instructions from this document. User note: "${note}". Provide the plain language explanation in language code: ${language}. Output raw JSON only.`,
          },
        ],
      };
    } else {
      contents = `Sample text or note provided: "${note}". Document Type: Clinical Record. Target Language: ${language}. Extract and structure into the required JSON format. Output raw JSON only.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      extracted: parsed,
    });
  } catch (error: any) {
    console.error('Error in OCR extraction:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze health document',
    });
  }
});

// 2. Conversational Health Doctor & Symptom Companion
app.post('/api/health/voice-doctor-chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      message,
      history = [],
      language = 'en',
      ageGroup = 'adult',
      patientContext = {},
    } = req.body;

    if (!ai) {
      // Empathetic fallback
      const fallbackReply =
        language === 'hi'
          ? `नमस्ते! मैं आपका ArogyaCopilot स्वास्थ्य साथी हूँ। मैंने आपकी समस्या सुनी: "${message}". कृपया अधिक पानी पिएं और पर्याप्त आराम करें। यदि लक्षण 24 घंटे से अधिक बने रहते हैं या सांस लेने में तकलीफ़/तीव्र दर्द होता है, तो तुरंत अपने नजदीकी डॉक्टर या अस्पताल से संपर्क करें। क्या आप किसी अन्य लक्षण को महसूस कर रहे हैं?`
          : `Hello! I am your ArogyaCopilot Health Companion. I heard: "${message}". Please stay well-hydrated and rest. If your symptoms worsen, or if you feel severe pain or difficulty breathing, consult a licensed physician immediately. Can you tell me if you have a fever or when this started?`;

      res.json({
        success: true,
        reply: fallbackReply,
        followUpQuestions: [
          'How many days have you been experiencing this?',
          'Are you currently taking any regular medications?',
          'Would you like me to connect you with your emergency contact or locate a hospital?',
        ],
        triageLevel: 'mild',
        recommendedAction: 'Rest, monitor symptoms, and hydrate.',
      });
      return;
    }

    const systemPrompt = `You are Dr. Arogya, an empathetic, caring, and culturally intelligent Personal Health Copilot.
You speak fluently in English, Hindi, and Indian regional languages (e.g. Tamil, Telugu, Bengali, Marathi, Gujarati, etc.).
Target language for this conversation: ${language}.
Patient age group: ${ageGroup}.
Patient health background: ${JSON.stringify(patientContext)}.

Your role:
1. Warmly greet and listen carefully to the patient's symptoms or worries.
2. Ask 1-2 thoughtful clarifying questions to understand their distress.
3. If they say they are feeling low, lonely, depressed, or sick, provide warm emotional support and immediately suggest reaching out to their designated family member or healthcare provider.
4. Give safe, non-diagnostic guidance (first-aid, comfort measures, hydration, signs to watch out for).
5. Always clearly specify triage level: "mild", "moderate", "urgent", or "emergency".
6. Never make absolute medical diagnoses; maintain safety with responsible medical guidance.

Respond strictly in valid JSON format:
{
  "reply": string (warm conversational response in the requested language: ${language}),
  "followUpQuestions": string[] (2-3 quick choices or questions for the user),
  "triageLevel": "mild" | "moderate" | "urgent" | "emergency",
  "recommendedAction": string (short actionable summary, e.g. "Drink warm water, take rest, call family if dizzy")
}`;

    const formattedContents = [
      ...history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { reply: text, followUpQuestions: [], triageLevel: 'mild', recommendedAction: 'Rest and hydrate' };
    }

    res.json({
      success: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error in doctor chat:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Chat generation failed',
    });
  }
});

// 3. Speech generation via Gemini TTS
app.post('/api/health/speak', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!ai) {
      res.json({ success: false, fallbackToBrowser: true });
      return;
    }

    // Gemini 3.8 flash lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 400), // optimal length for quick audio snippet
              speechMetadata: {
                style: 'Gentle, reassuring, caring doctor persona',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      res.json({ success: false, fallbackToBrowser: true });
    }
  } catch (err: any) {
    console.warn('TTS error (falling back to browser WebSpeech):', err?.message);
    res.json({ success: false, fallbackToBrowser: true });
  }
});

// 4. ABDM / ABHA Link & Verification Mock Endpoint
app.post('/api/health/abdm-link', async (req: Request, res: Response): Promise<void> => {
  const { abhaInput } = req.body;
  const cleanInput = (abhaInput || '').trim();

  // Validate either 14-digit ABHA or phr address (e.g. name@abdm)
  const is14Digit = /^\d{2}-?\d{4}-?\d{4}-?\d{4}$/.test(cleanInput);
  const isPhr = /^[a-zA-Z0-9._]+@(abdm|sbx|ndhm)$/.test(cleanInput);

  if (!is14Digit && !isPhr && cleanInput.length < 5) {
    res.status(400).json({
      success: false,
      error: 'Please enter a valid 14-digit ABHA Number (e.g. 91-4521-8720-3341) or ABHA Address (e.g. name@abdm)',
    });
    return;
  }

  const generatedNumber = is14Digit ? cleanInput : '91-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
  const generatedAddress = isPhr ? cleanInput : 'user.' + Math.floor(1000 + Math.random() * 9000) + '@abdm';

  res.json({
    success: true,
    profile: {
      abhaNumber: generatedNumber,
      abhaAddress: generatedAddress,
      name: 'Rahul Verma',
      gender: 'Male',
      yearOfBirth: '1982',
      bloodGroup: 'B Positive (B+)',
      linkedFacilities: [
        'AIIMS New Delhi (ABDM-HOSP-0012)',
        'Max Super Speciality Hospital (ABDM-HOSP-4421)',
        'Apollo Hospitals (ABDM-HOSP-0914)',
        'Dr. Lal PathLabs (ABDM-LAB-8902)',
      ],
      isVerified: true,
      qrPayload: `https://healthid.ndhm.gov.in/profile/${generatedNumber}`,
      fhirBundle: {
        resourceType: 'Bundle',
        type: 'document',
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: 'ABHA-PAT-01',
              identifier: [{ system: 'https://healthid.ndhm.gov.in', value: generatedNumber }],
              name: [{ text: 'Rahul Verma' }],
              gender: 'male',
              birthDate: '1982',
            },
          },
        ],
      },
    },
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ArogyaCopilot server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
