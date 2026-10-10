import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  QrCode,
  Download,
  Building2,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';
import { AbhaProfile, MedicalRecord } from '../types/health';

interface AbhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AbhaProfile;
  records: MedicalRecord[];
  onLinkAbha: (input: string) => Promise<void>;
}

export const AbhaModal: React.FC<AbhaModalProps> = ({
  isOpen,
  onClose,
  profile,
  records,
  onLinkAbha,
}) => {
  const [inputAbha, setInputAbha] = useState('');
  const [linking, setLinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFhirJson, setShowFhirJson] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAbha.trim()) return;
    setLinking(true);
    try {
      await onLinkAbha(inputAbha);
      setInputAbha('');
    } finally {
      setLinking(false);
    }
  };

  const fhirBundle = {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    identifier: { system: 'https://abdm.gov.in/bundle', value: `ABDM-DOC-${profile.abhaNumber}` },
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'ABHA-PAT-01',
          identifier: [{ system: 'https://healthid.ndhm.gov.in', value: profile.abhaNumber }],
          name: [{ text: profile.name }],
          gender: profile.gender.toLowerCase(),
          birthDate: profile.yearOfBirth,
        },
      },
      ...records.map((r) => ({
        resource: r.fhirResource || {
          resourceType: r.type === 'Prescription' ? 'MedicationRequest' : 'DiagnosticReport',
          status: 'final',
          code: { text: r.title },
          effectiveDateTime: r.date,
          conclusion: r.plainLanguageSummary,
        },
      })),
    ],
  };

  const downloadFhirPassport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fhirBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ABDM_HealthPassport_${profile.abhaNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-cyan-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Banner */}
        <div className="bg-linear-to-r from-teal-700 via-cyan-800 to-sky-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">ABDM Digital Health Card</h2>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Ayushman Bharat
                </span>
              </div>
              <p className="text-xs text-cyan-200 mt-0.5">
                FHIR R4 Compliant Unified Health Interface (UHI)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Indian Government Style ABHA Health Card Simulation */}
          <div className="relative rounded-2xl p-5 bg-linear-to-br from-slate-900 via-cyan-950 to-teal-950 text-white shadow-xl border border-cyan-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                  National Health Authority (NHA)
                </p>
                <h3 className="text-base font-extrabold tracking-wide text-white">
                  ABHA • Ayushman Bharat Health Account
                </h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center pt-2">
              <div className="col-span-2 space-y-2">
                <div>
                  <p className="text-[10px] text-cyan-300 uppercase">Patient Name</p>
                  <p className="text-sm font-bold text-white">{profile.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-cyan-300 uppercase">Gender / YOB</p>
                    <p className="font-semibold text-slate-200">{profile.gender} / {profile.yearOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-cyan-300 uppercase">Blood Group</p>
                    <p className="font-bold text-rose-300">{profile.bloodGroup}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-cyan-300 uppercase">ABHA Address (PHR)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs font-semibold text-cyan-200">{profile.abhaAddress}</p>
                    <button
                      onClick={() => handleCopy(profile.abhaAddress)}
                      className="text-cyan-400 hover:text-white cursor-pointer"
                      title="Copy PHR Address"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-cyan-300 uppercase">14-Digit ABHA Number</p>
                  <p className="font-mono text-sm font-bold tracking-widest text-amber-300">
                    {profile.abhaNumber}
                  </p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-md text-slate-900 text-center">
                <QrCode className="w-20 h-20 text-slate-900" />
                <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">Scan for Records</span>
              </div>
            </div>
          </div>

          {/* Linked Healthcare Providers / Facilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-600" />
              Connected Healthcare Facilities (ABDM M1/M2 Sync)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {profile.linkedFacilities.map((fac, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate font-medium">{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Different ABHA ID Form */}
          <div className="bg-cyan-50/60 border border-cyan-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyan-900">Link or Import Another ABHA ID</h4>
              <span className="text-[10px] text-cyan-700">Sandbox / Live M1 Ready</span>
            </div>
            <form onSubmit={handleLinkSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 91-4521-8720-3341 or priya@abdm"
                value={inputAbha}
                onChange={(e) => setInputAbha(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-cyan-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={linking}
                className="bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {linking ? 'Syncing...' : 'Link'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* FHIR Export and JSON Inspector */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <button
              onClick={() => setShowFhirJson(!showFhirJson)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-cyan-600" />
              {showFhirJson ? 'Hide FHIR R4 Schema' : 'Inspect FHIR R4 Schema'}
            </button>
            <button
              onClick={downloadFhirPassport}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Health Passport (FHIR JSON)
            </button>
          </div>

          {showFhirJson && (
            <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-[11px] overflow-x-auto max-h-56">
              <pre>{JSON.stringify(fhirBundle, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
