import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Database,
  ArrowRight,
  Sparkles,
  FileText,
  Workflow,
  CheckCircle2,
  Lock,
  Share2,
  Download,
  Presentation,
  ChevronRight,
  ChevronLeft,
  FileCode,
} from 'lucide-react';
import { LanguageCode } from '../types/health';

interface ArchitectureABDMProps {
  currentLang: LanguageCode;
}

export const ArchitectureABDM: React.FC<ArchitectureABDMProps> = ({ currentLang }) => {
  const [activeView, setActiveView] = useState<'architecture' | 'fhir-schema' | 'slide-deck'>('architecture');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'ArogyaCopilot: AI Personal Health Copilot',
      subtitle: 'Problem Statement & Vision',
      points: [
        'Healthcare data in India is fragmented across handwritten doctor slips, unstandardized diagnostic PDF lab reports, and physical discharge papers.',
        'Patients struggle to interpret critical markers (HbA1c, LDL, Vitamin D) and often lack guidance on drug-food interactions.',
        'ArogyaCopilot delivers an intelligent, bilingual multimodal OCR pipeline and unified health timeline aligned to ABDM / ABHA national standards.',
      ],
      badge: 'Round 1 Challenge Brief',
    },
    {
      title: 'Multimodal AI & OCR Pipeline',
      subtitle: 'Technical Architecture & Clinical Reasoning',
      points: [
        'Ingestion Layer: High-resolution image/PDF capture with preprocessing for doctor handwriting and bilingual doctor notes.',
        'Gemini 3.8 Flash Vision Engine: Extracts structured entities (Medicines, Dosages, Test Units, Reference Ranges, Doctor details).',
        'Clinical Synthesis Engine: Generates plain-language medical translations across 12 Indian languages with abnormal biomarker explanations.',
        'Drug-Food Interaction Guardian: Proactively flags statin-grapefruit, metformin timing, and high-risk interactions.',
      ],
      badge: 'AI Utilization (35 Points)',
    },
    {
      title: 'ABDM / ABHA & FHIR R4 Interoperability',
      subtitle: 'Ayushman Bharat Digital Mission Standards',
      points: [
        'ABHA ID Validation & Linking: Supports 14-digit ABHA numbers and PHR addresses (user@abdm) with verified digital card and QR token.',
        'FHIR R4 Resource Mapping: Every parsed prescription is transformed into standard FHIR MedicationRequest, and lab tests into DiagnosticReport resources.',
        'Exportable Health Passport: Patients can export encrypted FHIR JSON bundles for seamless portability across hospitals and travel insurance.',
      ],
      badge: 'Technical Architecture & Bonus (30 Points)',
    },
    {
      title: 'Patient-Centric Features & Healthcare Impact',
      subtitle: 'Four Age Panels, Emergency Distress & Calculators',
      points: [
        'Family SOS Beacon: One-tap instant emergency phone call, WhatsApp distress broadcast with GPS, and 102/108 ambulance speed dial.',
        'Speaking & Listening Doctor: Conversational voice assistant that talks to patients, asks their symptoms, and triages emergencies safely.',
        'Four Age-Care Panels: Specialized tips and interactive engagement tasks for Toddlers (0-5), Teenagers (13-19), Adults (20-59), and Seniors (60+).',
        'Metabolic Hub: Asian-Indian calibrated BMI calculator and Mifflin-St Jeor daily calorie expenditure breakdown.',
      ],
      badge: 'User Experience & Impact (35 Points)',
    },
  ];

  const sampleFhirResource = {
    resourceType: 'DiagnosticReport',
    id: 'ABDM-REPORT-2026-9921',
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
            code: 'CH',
            display: 'Chemistry',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '4548-4',
          display: 'Hemoglobin A1c / Hemoglobin.total in Blood',
        },
      ],
      text: 'HbA1c Glycemic Panel',
    },
    subject: {
      reference: 'Patient/ABHA-91-4521-8720-3341',
      display: 'Rahul Verma',
    },
    effectiveDateTime: '2026-09-24T08:30:00+05:30',
    performer: [
      {
        display: 'Dr. Lal PathLabs & Diagnostics, Connaught Place',
      },
    ],
    result: [
      {
        display: 'HbA1c: 7.2 % (Reference: 4.0 - 5.6 %)',
      },
      {
        display: 'Fasting Blood Sugar: 138 mg/dL (Reference: 70 - 99 mg/dL)',
      },
      {
        display: 'LDL Cholesterol: 154 mg/dL (Reference: < 100 mg/dL)',
      },
    ],
    conclusion: 'Dyslipidemia, sub-optimally controlled glycemic markers, and hypovitaminosis D.',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-linear-to-r from-slate-900 via-teal-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Deliverables 3.2, 3.3 & Evaluation Criteria (100 Points)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Architecture, ABDM & Slide Deck
          </h1>
          <p className="text-sm text-cyan-100 mt-2 leading-relaxed">
            Comprehensive architectural blueprint covering the multimodal OCR ingestion pipeline, Gemini clinical reasoning core, ABDM / FHIR R4 schema, and evaluation criteria mapping.
          </p>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-lg mx-auto border border-slate-200">
        <button
          onClick={() => setActiveView('architecture')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'architecture'
              ? 'bg-white text-teal-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Workflow className="w-4 h-4 text-teal-600" />
          <span>Data Pipeline</span>
        </button>
        <button
          onClick={() => setActiveView('fhir-schema')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'fhir-schema'
              ? 'bg-white text-teal-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4 text-cyan-600" />
          <span>FHIR R4 Schema</span>
        </button>
        <button
          onClick={() => setActiveView('slide-deck')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeView === 'slide-deck'
              ? 'bg-white text-teal-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Presentation className="w-4 h-4 text-indigo-600" />
          <span>Pitch Slides</span>
        </button>
      </div>

      {/* 1. Technical Architecture View */}
      {activeView === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                End-to-End Clinical Data Pipeline
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                ArogyaCopilot Multi-Stage Architecture
              </h2>
              <p className="text-xs text-slate-500">
                From raw prescription image capture to FHIR R4 harmonization, plain-language translation, and emergency family alert dispatch.
              </p>
            </div>

            {/* Architecture Pipeline Flow Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1: Ingestion */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative group hover:border-teal-400 transition-all">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xs mb-3">
                    01
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Ingestion & OCR
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Multimodal ingest of handwritten prescriptions, bilingual Hindi/English OPD slips, and lab reports. Base64 payload sanitization.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-200/60">
                  POST /api/health/ocr-extract
                </div>
              </div>

              {/* Step 2: Clinical AI Core */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative group hover:border-cyan-400 transition-all">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-xs mb-3">
                    02
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Gemini Clinical Engine
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Entity extraction (medicines, dosages, lab tests), abnormal value clinical interpretation, and plain language generation in 12 Indian languages.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-cyan-700 bg-cyan-50 p-2 rounded-lg border border-cyan-200/60">
                  gemini-3.8-flash (JSON Schema)
                </div>
              </div>

              {/* Step 3: ABDM & FHIR Harmonization */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative group hover:border-indigo-400 transition-all">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs mb-3">
                    03
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    ABDM & FHIR Gateway
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Maps clinical findings into HL7 FHIR R4 resources: DiagnosticReport, MedicationRequest, and Patient tied to verified ABHA ID (M1/M2 sync).
                  </p>
                </div>
                <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-200/60">
                  HL7 FHIR R4 Bundle + QR
                </div>
              </div>

              {/* Step 4: Patient Interface & Emergency SOS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative group hover:border-rose-400 transition-all">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs mb-3">
                    04
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Copilot Engagement & SOS
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Smart timeline, pill/water reminders, speaking AI doctor, 4 age panels, BMI/calorie tools, Google Maps hospital radar & family emergency calling.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200/60">
                  Interactive React 19 UI
                </div>
              </div>
            </div>

            {/* Evaluation Criteria Mapping Matrix */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 text-center">
                Evaluation Criteria Alignment (100 Points Total)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="font-extrabold text-teal-900 block">AI Utilization (35%)</span>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Bilingual OCR, handwritten Rx extraction, plain-language summaries, abnormal value explanations, Gemini speech doctor.
                  </p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
                  <span className="font-extrabold text-cyan-900 block">Technical Arch (25%)</span>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Express backend with Vite, structured schemas, ABDM FHIR R4 data model, stateful longitudinal trend tracking.
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="font-extrabold text-indigo-900 block">User Exp (20%)</span>
                  <p className="text-slate-600 text-[11px] mt-1">
                    1-click test samples, 12 Indian languages, high-contrast senior mode, intuitive pill/water trackers, Google Maps integration.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-extrabold text-emerald-900 block">Health Impact (10%)</span>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Drug-food warnings, Asian-Indian BMI threshold, safe triage disclaimers, urgent family emergency calling.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-extrabold text-amber-900 block">Bonus (10%)</span>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Full ABDM / ABHA readiness, exportable FHIR Health Passport, all 12 Indian languages, voice interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FHIR Schema Inspector */}
      {activeView === 'fhir-schema' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                HL7 FHIR R4 DiagnosticReport & MedicationRequest Schema
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized interoperability schema implemented across ArogyaCopilot extraction records.
              </p>
            </div>
            <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200">
              ABDM Sandbox Verified
            </span>
          </div>

          <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
            <pre>{JSON.stringify(sampleFhirResource, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* 3. Pitch Slide Deck View */}
      {activeView === 'slide-deck' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          {/* Slide Container */}
          <div className="bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl min-h-[380px] flex flex-col justify-between border border-teal-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
                  {slides[currentSlide].badge}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Slide {currentSlide + 1} of {slides.length}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm font-semibold text-cyan-200 mt-1">
                {slides[currentSlide].subtitle}
              </p>

              <div className="mt-6 space-y-3">
                {slides[currentSlide].points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Navigation Buttons */}
            <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      currentSlide === i ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlide === slides.length - 1}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-30 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
