import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Navigation,
  Share2,
  Bell,
  X,
  Building,
  User,
  ExternalLink,
  CalendarPlus,
  FileText,
  UtensilsCrossed,
} from 'lucide-react';
import { HospitalVisitReminder, LanguageCode } from '../types/health';
import { INITIAL_HOSPITAL_REMINDERS } from '../data/mockData';

interface HospitalVisitRemindersProps {
  reminders?: HospitalVisitReminder[];
  onUpdateReminders?: (reminders: HospitalVisitReminder[]) => void;
  currentLang: LanguageCode;
}

export const HospitalVisitReminders: React.FC<HospitalVisitRemindersProps> = ({
  reminders: propReminders,
  onUpdateReminders,
  currentLang,
}) => {
  const [reminders, setReminders] = useState<HospitalVisitReminder[]>(
    propReminders || INITIAL_HOSPITAL_REMINDERS
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState('');
  const [newHospital, setNewHospital] = useState('');
  const [newDept, setNewDept] = useState('General Medicine');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newPurpose, setNewPurpose] = useState('');
  const [newFasting, setNewFasting] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const updateRemindersState = (updated: HospitalVisitReminder[]) => {
    setReminders(updated);
    if (onUpdateReminders) onUpdateReminders(updated);
  };

  const handleToggleChecklist = (reminderId: string, checkId: string) => {
    const updated = reminders.map((r) => {
      if (r.id === reminderId) {
        return {
          ...r,
          checklist: r.checklist.map((c) =>
            c.id === checkId ? { ...c, checked: !c.checked } : c
          ),
        };
      }
      return r;
    });
    updateRemindersState(updated);
  };

  const handleMarkStatus = (reminderId: string, status: 'Scheduled' | 'Completed' | 'Cancelled') => {
    const updated = reminders.map((r) => (r.id === reminderId ? { ...r, status } : r));
    updateRemindersState(updated);
    setActionSuccess(`Hospital visit marked as ${status}!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor || !newHospital || !newDate) return;

    const newReminder: HospitalVisitReminder = {
      id: `hrem-${Date.now()}`,
      doctorName: newDoctor,
      hospitalName: newHospital,
      department: newDept,
      visitDate: newDate,
      visitTime: newTime,
      purpose: newPurpose || 'Follow-up Consultation',
      isFastingRequired: newFasting,
      checklist: [
        { id: `c-1-${Date.now()}`, label: 'Carry ABHA Digital Health Card & ID proof', checked: false },
        { id: `c-2-${Date.now()}`, label: 'Carry all previous prescriptions & lab reports', checked: false },
        ...(newFasting
          ? [{ id: `c-fast-${Date.now()}`, label: 'Overnight fasting (10-12 hours water only)', checked: false }]
          : []),
      ],
      reminderAlerts: ['1 Day Prior', 'Morning of visit'],
      status: 'Scheduled',
      hospitalPhone: newPhone || '+91 11 2658 8500',
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newHospital)}`,
    };

    const updated = [newReminder, ...reminders];
    updateRemindersState(updated);
    setNewDoctor('');
    setNewHospital('');
    setNewPurpose('');
    setNewDate('');
    setShowAddModal(false);
    setActionSuccess('🎉 Hospital visit reminder scheduled successfully!');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const generateGoogleCalendarUrl = (reminder: HospitalVisitReminder) => {
    const title = encodeURIComponent(`Hospital Visit: ${reminder.doctorName} (${reminder.department})`);
    const details = encodeURIComponent(
      `Purpose: ${reminder.purpose}\nHospital: ${reminder.hospitalName}\nFasting Required: ${
        reminder.isFastingRequired ? 'YES (10-12 hours)' : 'No'
      }\nChecklist:\n${reminder.checklist.map((c) => `- ${c.label}`).join('\n')}`
    );
    const location = encodeURIComponent(reminder.hospitalName);
    // YYYYMMDD
    const cleanDate = reminder.visitDate.replace(/-/g, '');
    const dates = `${cleanDate}T043000Z/${cleanDate}T063000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // Calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visit = new Date(dateStr);
    visit.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((visit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} Days`;
    return 'Past date';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Hospital & Doctor Visit Reminders
            </h2>
            <p className="text-xs text-slate-500">
              Scheduled clinical consultations, fasting reminders, and pre-visit checklists
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-teal-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit Reminder</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionSuccess}
          </span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reminders Cards List */}
      <div className="space-y-4">
        {reminders.map((reminder) => {
          const isCompleted = reminder.status === 'Completed';
          const isCancelled = reminder.status === 'Cancelled';
          const countdown = getDaysRemaining(reminder.visitDate);

          return (
            <div
              key={reminder.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                isCompleted
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : isCancelled
                  ? 'bg-rose-50/40 border-rose-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-teal-400 shadow-xs'
              }`}
            >
              {/* Top Row: Doctor, Hospital, Countdown */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                      {reminder.department}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-slate-200 text-slate-700'
                          : isCancelled
                          ? 'bg-rose-200 text-rose-800'
                          : 'bg-amber-100 text-amber-900 animate-pulse'
                      }`}
                    >
                      {isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : countdown}
                    </span>
                    {reminder.isFastingRequired && !isCompleted && (
                      <span className="text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-rose-600" />
                        Fasting Required
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 pt-1">
                    {reminder.doctorName}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{reminder.hospitalName}</span>
                  </p>
                </div>

                {/* Date & Time Badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
                  <div className="flex items-center gap-1 text-slate-800 text-xs font-bold justify-end">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {reminder.visitDate}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] font-semibold justify-end mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {reminder.visitTime}
                  </div>
                </div>
              </div>

              {/* Purpose & Notes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Consultation Objective:</span>
                <p className="text-slate-600 leading-relaxed">{reminder.purpose}</p>
                {reminder.notes && (
                  <p className="text-[11px] text-slate-400 italic mt-1">Note: {reminder.notes}</p>
                )}
              </div>

              {/* Pre-Visit Preparation Checklist */}
              {!isCompleted && !isCancelled && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Pre-Visit Preparation Checklist ({reminder.checklist.filter((c) => c.checked).length} /{' '}
                    {reminder.checklist.length} Ready):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {reminder.checklist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleToggleChecklist(reminder.id, item.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          item.checked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            item.checked ? 'text-emerald-600' : 'text-slate-300'
                          }`}
                        />
                        <span className={item.checked ? 'line-through opacity-80' : ''}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Add to Calendar, Google Maps Route, Call Reception, Complete */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Google Calendar Link */}
                  <a
                    href={generateGoogleCalendarUrl(reminder)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-teal-600" />
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* Directions on Google Maps */}
                  {reminder.googleMapsUrl && (
                    <a
                      href={reminder.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Directions</span>
                    </a>
                  )}

                  {/* Call Hospital */}
                  {reminder.hospitalPhone && (
                    <a
                      href={`tel:${reminder.hospitalPhone.replace(/\s+/g, '')}`}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reception</span>
                    </a>
                  )}
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  {!isCompleted && !isCancelled && (
                    <button
                      onClick={() => handleMarkStatus(reminder.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  )}
                  {isCompleted && (
                    <button
                      onClick={() => handleMarkStatus(reminder.id, 'Scheduled')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                    >
                      Re-open
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Hospital Visit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-teal-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Schedule Hospital Visit Reminder
                </h3>
                <p className="text-xs text-slate-500">
                  Set appointment alerts and pre-visit fasting instructions
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name & Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. A. K. Banerjee (Cardiologist)"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. AIIMS New Delhi"
                    value={newHospital}
                    onChange={(e) => setNewHospital(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Geriatrics & Senior Care">Geriatrics & Senior Care</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pathology / Diagnostics">Pathology / Diagnostics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Appointment Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Consultation Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Blood pressure follow-up, HbA1c review"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Fasting Required Checkbox */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block">Requires Fasting (10-12 hrs)?</span>
                  <span className="text-[11px] text-amber-800">
                    Will trigger a special fasting alert the evening before.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newFasting}
                  onChange={(e) => setNewFasting(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital Contact Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 11 2658 8500"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Visit Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
