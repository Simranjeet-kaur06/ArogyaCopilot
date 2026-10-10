import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  AlertTriangle,
  Pill,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ChevronRight,
  Filter,
  Search,
  Download,
  ShieldAlert,
  Hospital,
} from 'lucide-react';
import { MedicalRecord, LanguageCode } from '../types/health';

interface HealthTimelineProps {
  records: MedicalRecord[];
  currentLang: LanguageCode;
  onSelectRecord?: (record: MedicalRecord) => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  records,
  currentLang,
  onSelectRecord,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Mock Longitudinal Trends for Lab Markers
  const hba1cHistory = [
    { date: 'Oct 2025', value: 8.4, status: 'High' },
    { date: 'Jan 2026', value: 7.9, status: 'High' },
    { date: 'May 2026', value: 7.5, status: 'High' },
    { date: 'Sep 2026', value: 7.2, status: 'Borderline' },
  ];

  const bpHistoric = [
    { date: 'Oct 2025', sys: 148, dia: 94 },
    { date: 'Jan 2026', sys: 140, dia: 88 },
    { date: 'May 2026', sys: 134, dia: 84 },
    { date: 'Sep 2026', sys: 126, dia: 80 },
  ];

  const ldlHistoric = [
    { date: 'Oct 2025', val: 172 },
    { date: 'Jan 2026', val: 165 },
    { date: 'May 2026', val: 154 },
    { date: 'Sep 2026', val: 138 },
  ];

  const filteredRecords = records.filter((rec) => {
    const matchesType = filterType === 'all' || rec.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.diagnoses.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
            <Activity className="w-3.5 h-3.5" />
            Unified Health Profile • Longitudinal Biomarker Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Health Timeline & Lab Trends
          </h1>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            Consolidating disparate hospital visits, lab diagnostics, and doctor prescriptions into a single unified timeline. Track your chronic metrics (HbA1c, BP, LDL) with predictive trajectory insights.
          </p>
        </div>
      </div>

      {/* Interactive Trend Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* HbA1c Trend Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                HbA1c (Glycated Hb)
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> -1.2% Trend
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">7.2%</span>
              <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                Target: &lt;6.5%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Down from 8.4% last year. Metformin and dietary changes working effectively!
            </p>
          </div>

          {/* SVG Bar / Sparkline Chart */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-end justify-between gap-2 h-20 px-1">
              {hba1cHistory.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(20, ((item.value - 5) / 4) * 100));
                const isLatest = idx === hba1cHistory.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] font-bold text-slate-600 group-hover:text-teal-600">
                      {item.value}%
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-md h-14 flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isLatest ? 'bg-teal-500' : 'bg-slate-300 group-hover:bg-teal-300'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{item.date.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Blood Pressure Trend Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Blood Pressure (mmHg)
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> Controlled
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">126/80</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Stage: Normal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Maintained within target range on Telmisartan 40mg.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-end justify-between gap-2 h-20 px-1">
              {bpHistoric.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(20, ((item.sys - 100) / 60) * 100));
                const isLatest = idx === bpHistoric.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] font-bold text-slate-600">
                      {item.sys}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-md h-14 flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isLatest ? 'bg-cyan-500' : 'bg-slate-300 group-hover:bg-cyan-300'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{item.date.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LDL Cholesterol Trend Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                LDL Cholesterol (mg/dL)
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> Improving
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">138</span>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                Target: &lt;100
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Reduced by 34 mg/dL since starting Atorvastatin 10mg.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-end justify-between gap-2 h-20 px-1">
              {ldlHistoric.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(20, ((item.val - 80) / 100) * 100));
                const isLatest = idx === ldlHistoric.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] font-bold text-slate-600">
                      {item.val}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-md h-14 flex items-end">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isLatest ? 'bg-amber-500' : 'bg-slate-300 group-hover:bg-amber-300'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{item.date.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search records, diagnoses, doctors, or hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 bg-transparent focus:outline-hidden"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-1">
            {['all', 'Prescription', 'Lab Report', 'Discharge'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All Records' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-200 space-y-8">
        {filteredRecords.map((record) => {
          const isSelected = selectedRecordId === record.id;
          const isCritical = record.isCritical;
          return (
            <div key={record.id} className="relative group">
              {/* Timeline Node Badge */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white ${
                  isCritical
                    ? 'bg-rose-600 animate-pulse'
                    : record.type === 'Prescription'
                    ? 'bg-teal-600'
                    : record.type === 'Lab Report'
                    ? 'bg-cyan-600'
                    : 'bg-indigo-600'
                }`}
              >
                {isCritical ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : record.type === 'Prescription' ? (
                  <Pill className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>

              {/* Event Card */}
              <div
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs ${
                  isCritical
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                        record.type === 'Prescription'
                          ? 'bg-teal-100 text-teal-800'
                          : record.type === 'Lab Report'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {record.type}
                    </span>
                    {isCritical && (
                      <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        Critical Biomarker Event
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {record.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{record.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Facility: <span className="font-semibold text-slate-700">{record.facilityName}</span> • Doctor: <span className="font-semibold text-slate-700">{record.doctorName}</span>
                </p>

                {/* Plain language summary */}
                <p className="text-xs sm:text-sm text-slate-700 mt-3 p-3 bg-slate-50 rounded-xl leading-relaxed border border-slate-100">
                  {record.plainLanguageSummary}
                </p>

                {/* Medicines / Lab Chips */}
                {record.medicines.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Rx:</span>
                    {record.medicines.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {m.name} ({m.dosage})
                      </span>
                    ))}
                  </div>
                )}

                {record.labTests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Tests:</span>
                    {record.labTests.map((t) => (
                      <span
                        key={t.id}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          t.status === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : t.status === 'High'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {t.testName}: {t.value} {t.unit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expand / Details Toggle */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setSelectedRecordId(isSelected ? null : record.id)}
                    className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isSelected ? 'Hide Full Clinical Details' : 'View Full Details & FHIR'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">ID: {record.id}</span>
                </div>

                {isSelected && (
                  <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto space-y-2">
                    <p className="text-teal-400 font-bold">// FHIR-Ready Clinical Resource Metadata</p>
                    <pre>{JSON.stringify(record.fhirResource || record, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
