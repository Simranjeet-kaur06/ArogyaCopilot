import React, { useState } from 'react';
import { Header } from './components/Header';
import { RecordUploadOcr } from './components/RecordUploadOcr';
import { HealthTimeline } from './components/HealthTimeline';
import { MedicineWaterTracker } from './components/MedicineWaterTracker';
import { CalculatorsHub } from './components/CalculatorsHub';
import { AgePanels } from './components/AgePanels';
import { HospitalsLocator } from './components/HospitalsLocator';
import { VoiceDoctorAssistant } from './components/VoiceDoctorAssistant';
import { ArchitectureABDM } from './components/ArchitectureABDM';
import { AyurvedicAdviceHub } from './components/AyurvedicAdviceHub';
import { EmergencyModal } from './components/EmergencyModal';
import { AbhaModal } from './components/AbhaModal';

import {
  MedicalRecord,
  MedicineItem,
  FamilyContact,
  LanguageCode,
  AbhaProfile,
  HospitalVisitReminder,
} from './types/health';

import {
  INITIAL_RECORDS,
  INITIAL_MEDICINES,
  INITIAL_FAMILY_CONTACTS,
  INITIAL_ABHA_PROFILE,
  INITIAL_HOSPITAL_REMINDERS,
} from './data/mockData';

import { t } from './utils/translations';
import { ShieldAlert, HeartPulse, Heart, PhoneCall } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('records');

  // Application Data States
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>(INITIAL_FAMILY_CONTACTS);
  const [abhaProfile, setAbhaProfile] = useState<AbhaProfile>(INITIAL_ABHA_PROFILE);
  const [hospitalReminders, setHospitalReminders] = useState<HospitalVisitReminder[]>(INITIAL_HOSPITAL_REMINDERS);

  // Modal States
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState<'ill' | 'low' | 'sos'>('ill');
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);

  const handleOpenEmergencyModal = (reason: 'ill' | 'low' | 'sos' = 'ill') => {
    setEmergencyReason(reason);
    setIsEmergencyModalOpen(true);
  };

  const handleAddRecord = (newRecord: MedicalRecord) => {
    setRecords((prev) => [newRecord, ...prev]);

    // If medicines were parsed in this record, automatically sync to medicine tracker
    if (newRecord.medicines && newRecord.medicines.length > 0) {
      setMedicines((prev) => [...newRecord.medicines, ...prev]);
    }
  };

  const handleAddFamilyContact = (contact: FamilyContact) => {
    setFamilyContacts((prev) => [contact, ...prev]);
  };

  const handleLinkAbha = async (input: string) => {
    try {
      const res = await fetch('/api/health/abdm-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abhaInput: input }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setAbhaProfile(data.profile);
      }
    } catch (err) {
      console.warn('ABDM sync local update:', err);
      // Fallback optimistic update
      setAbhaProfile((prev) => ({
        ...prev,
        abhaNumber: input.includes('@') ? prev.abhaNumber : input,
        abhaAddress: input.includes('@') ? input : prev.abhaAddress,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Universal Header with Navigation, Emergency Distress & Multi-language Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        abhaProfile={abhaProfile}
        onOpenAbhaModal={() => setIsAbhaModalOpen(true)}
        onOpenEmergencyModal={handleOpenEmergencyModal}
      />

      {/* Main Tab Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'records' && (
          <RecordUploadOcr
            currentLang={currentLang}
            onRecordAdded={handleAddRecord}
            recentRecords={records}
            onSelectRecord={(rec) => {
              setActiveTab('timeline');
            }}
          />
        )}

        {activeTab === 'timeline' && (
          <HealthTimeline
            records={records}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'tracker' && (
          <MedicineWaterTracker
            medicines={medicines}
            onUpdateMedicine={setMedicines}
            hospitalReminders={hospitalReminders}
            onUpdateHospitalReminders={setHospitalReminders}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'calculators' && (
          <CalculatorsHub currentLang={currentLang} />
        )}

        {activeTab === 'age-panels' && (
          <AgePanels
            currentLang={currentLang}
            onOpenEmergencyModal={handleOpenEmergencyModal}
          />
        )}

        {activeTab === 'ayurveda' && (
          <AyurvedicAdviceHub currentLang={currentLang} />
        )}

        {activeTab === 'hospitals' && (
          <HospitalsLocator
            currentLang={currentLang}
            onOpenVisitReminders={() => setActiveTab('tracker')}
          />
        )}

        {activeTab === 'doctor' && (
          <VoiceDoctorAssistant
            currentLang={currentLang}
            onOpenEmergencyModal={handleOpenEmergencyModal}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureABDM currentLang={currentLang} />
        )}
      </main>

      {/* Floating Quick Action Button: Emergency Family Calling */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        <button
          onClick={() => handleOpenEmergencyModal('ill')}
          className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-xl shadow-rose-600/40 flex items-center gap-2 border-2 border-white transition-all cursor-pointer group"
          title="Feeling Low / Ill? Call Family Member or Send Alert"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{t('feelingLow', currentLang)}</span>
        </button>
      </div>

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        contacts={familyContacts}
        onAddContact={handleAddFamilyContact}
        triggerReason={emergencyReason}
        currentLang={currentLang}
        onTriggerDoctorChat={() => setActiveTab('doctor')}
      />

      <AbhaModal
        isOpen={isAbhaModalOpen}
        onClose={() => setIsAbhaModalOpen(false)}
        profile={abhaProfile}
        records={records}
        onLinkAbha={handleLinkAbha}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-800">ArogyaCopilot</span>
            <span>• Personal Health Copilot & ABDM FHIR Architecture</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Ayushman Bharat Digital Mission Ready</span>
            <span>HL7 FHIR R4 Compliant</span>
            <span>12 Indian Languages</span>
          </div>
          <p className="w-full text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            {t('disclaimer', currentLang)}
          </p>
        </div>
      </footer>
    </div>
  );
}
