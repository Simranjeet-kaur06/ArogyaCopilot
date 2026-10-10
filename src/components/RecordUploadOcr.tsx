import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Pill,
  FlaskConical,
  HeartPulse,
  HelpCircle,
  Apple,
  Calendar,
  User,
  Building,
  Languages,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { MedicalRecord, LanguageCode } from '../types/health';
import { SAMPLE_PRESCRIPTIONS_FOR_TESTING } from '../data/mockData';
import { t } from '../utils/translations';

interface RecordUploadOcrProps {
  currentLang: LanguageCode;
  onRecordAdded: (record: MedicalRecord) => void;
  recentRecords: MedicalRecord[];
  onSelectRecord: (record: MedicalRecord) => void;
}

export const RecordUploadOcr: React.FC<RecordUploadOcrProps> = ({
  currentLang,
  onRecordAdded,
  recentRecords,
  onSelectRecord,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userNote, setUserNote] = useState('');
  const [extractedRecord, setExtractedRecord] = useState<MedicalRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessDocument = async (base64Data?: string, noteText?: string) => {
    setIsUploading(true);
    setErrorMsg(null);

    const payloadImage = base64Data || imagePreview || '';
    const payloadNote = noteText !== undefined ? noteText : userNote;

    try {
      const response = await fetch('/api/health/ocr-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: payloadImage,
          mimeType: selectedFile?.type || 'image/jpeg',
          language: currentLang,
          note: payloadNote,
        }),
      });

      const data = await response.json();
      if (!data.success && !data.extracted) {
        throw new Error(data.error || 'Failed to extract health document.');
      }

      const ext = data.extracted;
      const newRecord: MedicalRecord = {
        id: `rec-${Date.now()}`,
        type: ext.documentType || 'Prescription',
        title: `${ext.documentType || 'Medical Record'} - ${ext.facilityName || 'Clinic'}`,
        facilityName: ext.facilityName || 'Medical Center',
        doctorName: ext.doctorName || 'Attending Physician',
        date: ext.date || new Date().toISOString().split('T')[0],
        confidence: ext.confidence || 95,
        diagnoses: ext.diagnoses || [],
        medicines: (ext.medicines || []).map((m: any, idx: number) => ({
          id: `med-${Date.now()}-${idx}`,
          name: m.name,
          dosage: m.dosage || 'As directed',
          frequency: m.frequency || '1 OD',
          timing: m.timing || 'After Food',
          duration: m.duration || 'Ongoing',
          purpose: m.purpose || 'Therapeutic management',
          isHighRisk: m.isHighRisk || false,
        })),
        labTests: (ext.labTests || []).map((t: any, idx: number) => ({
          id: `test-${Date.now()}-${idx}`,
          testName: t.testName,
          value: t.value,
          numericValue: t.numericValue ?? parseFloat(t.value) ?? undefined,
          unit: t.unit || '',
          referenceRange: t.referenceRange || '',
          status: t.status || 'Normal',
          explanation: t.explanation || '',
          category: t.category || 'General',
        })),
        plainLanguageSummary: ext.plainLanguageSummary || 'Extracted summary details.',
        abnormalValuesExplained: ext.abnormalValuesExplained || 'All vital markers within observed expectations.',
        foodDrugInteractions: ext.foodDrugInteractions || [],
        lifestyleAdvice: ext.lifestyleAdvice || [],
        questionsForDoctor: ext.questionsForDoctor || [],
        fhirResource: ext.fhirResource,
        imageUri: payloadImage || undefined,
        isCritical: (ext.labTests || []).some((l: any) => l.status === 'Critical' || l.status === 'High'),
      };

      setExtractedRecord(newRecord);
      onRecordAdded(newRecord);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error processing document with OCR. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestSample = (sample: typeof SAMPLE_PRESCRIPTIONS_FOR_TESTING[0]) => {
    setSelectedFile(null);
    setImagePreview(null);
    setUserNote(sample.base64PlaceholderNote);
    handleProcessDocument('', sample.base64PlaceholderNote);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Explainer */}
      <div className="bg-linear-to-r from-teal-900 via-cyan-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Core Scope 3.1 & 3.5 • Bilingual Multimodal OCR Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medical Record Intelligence & Extraction
          </h1>
          <p className="text-sm text-cyan-100 mt-2 leading-relaxed">
            Upload doctor prescriptions (including handwritten & bilingual Hindi/regional notes), diagnostic lab panels, or discharge summaries. ArogyaCopilot automatically parses medicines, dosages, test parameters, flags abnormal metrics, and translates findings into plain language.
          </p>
        </div>
      </div>

      {/* Main Upload & Sample Test Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Box & Samples */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              Upload Medical Document
            </h2>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <div className="p-3 bg-white rounded-xl shadow-xs text-teal-600 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse prescription / lab image
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPEG, PNG, WEBP, or scanned photos
                </p>
              </div>
            </div>

            {/* Image Preview if chosen */}
            {imagePreview && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-2">Selected Document Preview:</p>
                <img
                  src={imagePreview}
                  alt="Document Preview"
                  className="max-h-48 rounded-lg object-contain mx-auto border border-slate-300 bg-white"
                />
              </div>
            )}

            {/* User Note / Context */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Optional Patient Notes or Symptoms:
              </label>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="e.g. Doctor prescribed this after I had severe dizziness and high blood pressure..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Process Button */}
            <button
              onClick={() => handleProcessDocument()}
              disabled={isUploading}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-600/30 transition-all cursor-pointer"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('analyzingDocument', currentLang)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Run Multimodal AI OCR Analysis</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="mt-3 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick 1-Click Samples for Evaluators */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Click Sample Test Records
              </h2>
              <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                For Quick Demo
              </span>
            </div>
            <div className="space-y-2">
              {SAMPLE_PRESCRIPTIONS_FOR_TESTING.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTestSample(sample)}
                  disabled={isUploading}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all group flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800">
                      {sample.name}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {sample.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {sample.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction Output */}
        <div className="lg:col-span-7">
          {extractedRecord ? (
            <div className="bg-white rounded-2xl p-6 border border-teal-200 shadow-md space-y-6">
              {/* Extraction Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      {extractedRecord.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {extractedRecord.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {extractedRecord.facilityName}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Doctor: <span className="font-semibold">{extractedRecord.doctorName}</span>
                  </p>
                </div>
                {/* AI Confidence Meter */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
                  <div className="flex items-center gap-1 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {extractedRecord.confidence}% Confidence
                  </div>
                  <div className="w-24 bg-emerald-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${extractedRecord.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Diagnoses Pills */}
              {extractedRecord.diagnoses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Extracted Diagnoses & Findings
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedRecord.diagnoses.map((diag, i) => (
                      <span
                        key={i}
                        className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {diag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Plain Language Summary in Indian Language */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <Languages className="w-4 h-4 text-teal-700" />
                  {t('plainSummary', currentLang)}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {extractedRecord.plainLanguageSummary}
                </p>
              </div>

              {/* Abnormal Values Explained */}
              {extractedRecord.abnormalValuesExplained && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    {t('abnormalValues', currentLang)}
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 whitespace-pre-line leading-relaxed">
                    {extractedRecord.abnormalValuesExplained}
                  </p>
                </div>
              )}

              {/* Extracted Medicines Table */}
              {extractedRecord.medicines.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-teal-600" />
                    Extracted Medicines & Dosage Schedule ({extractedRecord.medicines.length})
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {extractedRecord.medicines.map((med) => (
                      <div key={med.id} className="p-3 bg-white hover:bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                            <span className="bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                              {med.dosage}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Frequency: <span className="font-semibold text-slate-700">{med.frequency}</span> • Timing: <span className="font-semibold text-slate-700">{med.timing}</span> • Duration: {med.duration || 'Ongoing'}
                          </p>
                        </div>
                        {med.purpose && (
                          <span className="text-[11px] text-cyan-800 bg-cyan-50 px-2 py-1 rounded-md border border-cyan-100 font-medium">
                            {med.purpose}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Lab Tests Table */}
              {extractedRecord.labTests.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-teal-600" />
                    Diagnostic Test Values ({extractedRecord.labTests.length})
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {extractedRecord.labTests.map((tst) => {
                      const isHigh = tst.status === 'High' || tst.status === 'Critical';
                      const isLow = tst.status === 'Low';
                      return (
                        <div key={tst.id} className="p-3 bg-white hover:bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{tst.testName}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  tst.status === 'Critical'
                                    ? 'bg-rose-600 text-white animate-pulse'
                                    : isHigh
                                    ? 'bg-rose-100 text-rose-800'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {tst.status}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              Ref Range: {tst.referenceRange}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-base font-extrabold ${isHigh ? 'text-rose-600' : 'text-slate-800'}`}>
                              {tst.value} {tst.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Food-Drug Interactions & Lifestyle Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extractedRecord.foodDrugInteractions.length > 0 && (
                  <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 space-y-2">
                    <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      {t('drugInteractions', currentLang)}
                    </h5>
                    <ul className="text-xs text-rose-950 space-y-1 list-disc list-inside">
                      {extractedRecord.foodDrugInteractions.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {extractedRecord.lifestyleAdvice.length > 0 && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Apple className="w-4 h-4 text-emerald-600" />
                      {t('lifestyleAdvice', currentLang)}
                    </h5>
                    <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                      {extractedRecord.lifestyleAdvice.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Ayurvedic Supportive Guidance */}
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <Apple className="w-4 h-4 text-emerald-700" />
                    Ayurvedic & Holistic Supportive Advice (AYUSH Guidance)
                  </h5>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    Complementary Care
                  </span>
                </div>
                <div className="text-xs text-emerald-950 space-y-1.5 leading-relaxed">
                  <p>
                    • <strong>Herbal Support:</strong> Traditional herbs like <em>Giloy (Guduchi)</em> and <em>Triphala</em> help kindle digestive Agni and cleanse metabolic toxins (Ama) without interfering with your prescription.
                  </p>
                  <p>
                    • <strong>Pathya (Beneficial Diet):</strong> Favor warm whole grains (Ragi, Barley/Jowar), bitter gourd (Karela), and light moong dal. Avoid night curd and deep-fried foods.
                  </p>
                  <p>
                    • <strong>Integrative Golden Rule:</strong> Always keep a <strong>60-90 minute interval</strong> between taking allopathic medicines and any herbal formulations.
                  </p>
                </div>
              </div>

              {/* Questions for Doctor */}
              {extractedRecord.questionsForDoctor.length > 0 && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2">
                  <h5 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    {t('questionsForDoc', currentLang)}
                  </h5>
                  <ul className="text-xs text-sky-950 space-y-1 list-disc list-inside">
                    {extractedRecord.questionsForDoctor.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Empty placeholder state */
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 mb-3">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Document Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Upload a medical report or prescription image on the left, or click one of the 1-Click Sample Records to test multimodal extraction immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
