import React from 'react';
import {
  HeartPulse,
  Globe,
  ShieldCheck,
  PhoneCall,
  AlertTriangle,
  FileText,
  Activity,
  Pill,
  Calculator,
  Users,
  MapPin,
  Mic,
  Cpu,
  Leaf,
  LogIn,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { INDIAN_LANGUAGES, LanguageCode, AbhaProfile, AuthUser } from '../types/health';
import { t } from '../utils/translations';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  abhaProfile: AbhaProfile;
  currentUser: AuthUser | null;
  onOpenAbhaModal: () => void;
  onOpenEmergencyModal: (reason?: 'ill' | 'low' | 'sos') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  abhaProfile,
  onOpenAbhaModal,
  onOpenEmergencyModal,
}) => {
  const tabs = [
    { id: 'records', label: t('recordsTab', currentLang), icon: FileText },
    { id: 'timeline', label: t('timelineTab', currentLang), icon: Activity },
    { id: 'tracker', label: t('trackerTab', currentLang), icon: Pill },
    { id: 'calculators', label: t('calculatorsTab', currentLang), icon: Calculator },
    { id: 'age-panels', label: t('agePanelsTab', currentLang), icon: Users },
    { id: 'ayurveda', label: t('ayurvedaTab', currentLang), icon: Leaf },
    { id: 'hospitals', label: t('hospitalsTab', currentLang), icon: MapPin },
    { id: 'doctor', label: t('aiDoctorTab', currentLang), icon: Mic, highlight: true },
    { id: 'architecture', label: t('architectureTab', currentLang), icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Emergency Distress & Family Quick Call Alert */}
      <div className="bg-linear-to-r from-rose-600 via-rose-500 to-amber-600 text-white px-4 py-1.5 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
          <span className="font-semibold tracking-wide">
            {t('feelingLow', currentLang)}
          </span>
          <span className="hidden md:inline text-rose-100">
            — One-tap call to family member, SOS alert, or voice doctor support.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onOpenEmergencyModal('ill')}
            className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
            Feeling Ill / Dizzy
          </button>
          <button
            onClick={() => onOpenEmergencyModal('low')}
            className="bg-white text-rose-700 hover:bg-rose-50 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            {t('callFamily', currentLang)}
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-teal-700 via-emerald-700 to-cyan-800 bg-clip-text text-transparent">
                  ArogyaCopilot
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                  AI + ABDM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Personal Health Copilot & Smart Medical Timeline
              </p>
            </div>
          </div>

          {/* Right Controls: ABHA Badge & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ABHA Badge */}
            <button
              onClick={onOpenAbhaModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition-colors cursor-pointer"
              title="Click to view ABHA Health Passport & QR"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span className="hidden sm:inline font-mono font-semibold">
                {abhaProfile.abhaAddress}
              </span>
              <span className="text-[10px] bg-cyan-600 text-white px-1 rounded font-bold">
                ABHA
              </span>
            </button>

            {/* Indian Languages Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500 ml-1.5" />
              <select
                aria-label="Select Indian Language"
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden pr-2 py-0.5 cursor-pointer"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency SOS Big Button */}
            <button
              onClick={() => onOpenEmergencyModal('sos')}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/30'
                    : tab.highlight
                    ? 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-violet-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
