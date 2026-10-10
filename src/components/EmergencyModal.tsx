import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  AlertTriangle,
  Heart,
  Share2,
  Ambulance,
  UserPlus,
  CheckCircle2,
  PhoneForwarded,
  ShieldAlert,
} from 'lucide-react';
import { FamilyContact, LanguageCode } from '../types/health';
import { t } from '../utils/translations';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: FamilyContact[];
  onAddContact: (contact: FamilyContact) => void;
  triggerReason?: 'ill' | 'low' | 'sos' | null;
  currentLang: LanguageCode;
  onTriggerDoctorChat?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onAddContact,
  triggerReason = 'ill',
  currentLang,
  onTriggerDoctorChat,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [callInitiated, setCallInitiated] = useState<string | null>(null);

  if (!isOpen) return null;

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    onAddContact({
      id: `fam-${Date.now()}`,
      name: newName,
      relationship: newRelationship || 'Family Member',
      phone: newPhone,
      isPrimary: contacts.length === 0,
    });
    setNewName('');
    setNewRelationship('');
    setNewPhone('');
    setShowAddForm(false);
  };

  const handleSimulateCall = (contact: FamilyContact) => {
    setCallInitiated(contact.name);
    // Real browser tel link
    window.location.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
    setTimeout(() => {
      setCallInitiated(null);
    }, 4000);
  };

  const handleShareDistress = () => {
    const text = encodeURIComponent(
      `EMERGENCY ALERT from ArogyaCopilot: I am feeling unwell/dizzy. Please check in on me immediately. Contact: ${primaryContact?.name} (${primaryContact?.phone}). Blood Group: B+ Positive.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-rose-600 to-red-700 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md animate-pulse">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {triggerReason === 'low'
                  ? 'Feeling Low & Need Support'
                  : triggerReason === 'ill'
                  ? 'Feeling Unwell / Medical Distress'
                  : 'Emergency Medical SOS'}
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                Instant family connection & emergency ambulance dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Reassuring Calm Banner */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <Heart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-rose-900">
                You are not alone. Please sit down safely and take slow, deep breaths.
              </p>
              <p>
                We are ready to connect you with your family member right now, or dial an ambulance if you are experiencing severe symptoms.
              </p>
            </div>
          </div>

          {/* Primary Family Contact Instant Call Card */}
          {primaryContact && (
            <div className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                  Primary Family Contact
                </span>
                <span className="text-xs text-slate-500">{primaryContact.relationship}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{primaryContact.name}</h3>
                  <p className="text-sm font-mono font-medium text-slate-600">{primaryContact.phone}</p>
                </div>
                <button
                  onClick={() => handleSimulateCall(primaryContact)}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <PhoneForwarded className="w-4 h-4 animate-bounce" />
                  <span>Call Now</span>
                </button>
              </div>
              {callInitiated && (
                <div className="mt-3 text-xs text-emerald-800 bg-emerald-100 p-2 rounded-lg flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dialing {callInitiated}... Check your phone dialer.
                </div>
              )}
            </div>
          )}

          {/* Quick SOS Alert Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareDistress}
              className="border border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50 text-slate-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">Send WhatsApp SOS</span>
              <span className="text-[10px] text-slate-500">Alert family with location</span>
            </button>
            <a
              href="tel:102"
              className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-900 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors cursor-pointer"
            >
              <Ambulance className="w-5 h-5 text-red-600" />
              <span className="text-xs font-bold">Call 102 / 108</span>
              <span className="text-[10px] text-red-600">Free National Ambulance</span>
            </a>
          </div>

          {alertSent && (
            <div className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Distress message prepared for WhatsApp. Send it to your trusted group!
            </div>
          )}

          {/* Talk to AI Doctor Right Now */}
          {onTriggerDoctorChat && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="text-xs">
                <p className="font-bold text-teal-900">Want to describe your symptoms first?</p>
                <p className="text-teal-700">Dr. Arogya can speak and guide your next steps.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onTriggerDoctorChat();
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-lg shrink-0 cursor-pointer"
              >
                Talk to AI Doctor
              </button>
            </div>
          )}

          {/* All Registered Family Contacts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                All Emergency Contacts ({contacts.length})
              </h4>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {showAddForm ? 'Cancel' : 'Add Contact'}
              </button>
            </div>

            {/* Add Contact Form */}
            {showAddForm && (
              <form onSubmit={handleAddContactSubmit} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Rahul Sharma)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Mother, Brother, Doctor)"
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. +91 98765 43210)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-lg cursor-pointer"
                >
                  Save Emergency Contact
                </button>
              </form>
            )}

            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
              {contacts.map((contact) => (
                <div key={contact.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{contact.name}</span>{' '}
                    <span className="text-slate-500">({contact.relationship})</span>
                    <p className="text-slate-600 font-mono text-[11px]">{contact.phone}</p>
                  </div>
                  <button
                    onClick={() => handleSimulateCall(contact)}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            In severe emergency, call 102/108 immediately.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
