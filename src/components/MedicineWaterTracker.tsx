import React, { useState } from 'react';
import {
  Droplet,
  Pill,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  Sparkles,
  ShieldAlert,
  Flame,
  Coffee,
  X,
  Package,
  Building,
} from 'lucide-react';
import { MedicineItem, WaterLog, LanguageCode, HospitalVisitReminder } from '../types/health';
import { HospitalVisitReminders } from './HospitalVisitReminders';
import { t } from '../utils/translations';

interface MedicineWaterTrackerProps {
  medicines: MedicineItem[];
  onUpdateMedicine: (medicines: MedicineItem[]) => void;
  hospitalReminders?: HospitalVisitReminder[];
  onUpdateHospitalReminders?: (reminders: HospitalVisitReminder[]) => void;
  currentLang: LanguageCode;
}

export const MedicineWaterTracker: React.FC<MedicineWaterTrackerProps> = ({
  medicines,
  onUpdateMedicine,
  hospitalReminders,
  onUpdateHospitalReminders,
  currentLang,
}) => {
  const [activeSection, setActiveSection] = useState<'pills-water' | 'hospital-visits'>('pills-water');

  // Water Tracker State
  const [dailyWaterGoalMl, setDailyWaterGoalMl] = useState(2500);
  const [consumedWaterMl, setConsumedWaterMl] = useState(1450);
  const [waterStreakDays, setWaterStreakDays] = useState(5);
  const [waterReminderActive, setWaterReminderActive] = useState(true);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([
    { id: 'w-1', amountMl: 250, timestamp: '08:15 AM' },
    { id: 'w-2', amountMl: 500, timestamp: '10:30 AM' },
    { id: 'w-3', amountMl: 250, timestamp: '01:00 PM' },
    { id: 'w-4', amountMl: 450, timestamp: '03:45 PM' },
  ]);

  // Medicine Form Modal
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('1-0-1');
  const [newMedTiming, setNewMedTiming] = useState<'Before Food' | 'After Food' | 'With Food' | 'Anytime'>('After Food');
  const [newMedPills, setNewMedPills] = useState(30);
  const [reminderNotif, setReminderNotif] = useState<string | null>(null);

  const waterPercent = Math.min(100, Math.round((consumedWaterMl / dailyWaterGoalMl) * 100));

  const handleAddWater = (amount: number) => {
    const newConsumed = consumedWaterMl + amount;
    setConsumedWaterMl(newConsumed);
    const newLog: WaterLog = {
      id: `w-${Date.now()}`,
      amountMl: amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setWaterLogs([newLog, ...waterLogs]);
    if (newConsumed >= dailyWaterGoalMl) {
      setReminderNotif('🎉 Daily hydration goal achieved! Great job keeping your kidneys healthy.');
      setTimeout(() => setReminderNotif(null), 4000);
    }
  };

  const handleToggleDose = (medId: string, slot: 'morning' | 'afternoon' | 'night') => {
    const updated = medicines.map((m) => {
      if (m.id === medId) {
        const currentTaken = m.takenToday?.[slot] || false;
        const newTaken = !currentTaken;
        const remaining = newTaken && m.remainingPills ? Math.max(0, m.remainingPills - 1) : m.remainingPills;
        return {
          ...m,
          takenToday: {
            ...m.takenToday,
            [slot]: newTaken,
          },
          remainingPills: remaining,
        };
      }
      return m;
    });
    onUpdateMedicine(updated);
  };

  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      name: newMedName,
      dosage: newMedDosage || 'As needed',
      frequency: newMedFreq,
      timing: newMedTiming,
      duration: 'Ongoing',
      purpose: 'Prescribed medication',
      isHighRisk: false,
      takenToday: { morning: false, afternoon: false, night: false },
      remainingPills: newMedPills,
    };

    onUpdateMedicine([newMed, ...medicines]);
    setNewMedName('');
    setNewMedDosage('');
    setShowAddMedModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-linear-to-r from-cyan-900 via-teal-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30 mb-3">
            <Droplet className="w-3.5 h-3.5" />
            Daily Adherence • Pill Reminders & Smart Hydration Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medicine & Hydration Tracker
          </h1>
          <p className="text-sm text-cyan-100 mt-2 leading-relaxed">
            Stay on track with precise dosage slots, remaining pill stock warnings, and regular water hydration reminders to protect renal function while taking medications.
          </p>
        </div>
      </div>

      {reminderNotif && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
          <span>{reminderNotif}</span>
          <button onClick={() => setReminderNotif(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub-Navigation: Daily Pills & Hydration vs Hospital Visit Reminders */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-lg mx-auto border border-slate-200">
        <button
          onClick={() => setActiveSection('pills-water')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'pills-water'
              ? 'bg-white text-teal-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4 text-teal-600" />
          <span>Pills & Hydration ({medicines.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('hospital-visits')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'hospital-visits'
              ? 'bg-white text-rose-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4 text-rose-600" />
          <span>Hospital Visit Reminders</span>
        </button>
      </div>

      {activeSection === 'hospital-visits' ? (
        <HospitalVisitReminders
          reminders={hospitalReminders}
          onUpdateReminders={onUpdateHospitalReminders}
          currentLang={currentLang}
        />
      ) : (
        /* Grid: Hydration & Pill Reminders */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Water Reminder & Hydration Tracker */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-cyan-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-cyan-100 rounded-xl text-cyan-700">
                  <Droplet className="w-5 h-5 fill-cyan-600" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {t('waterReminder', currentLang)}
                  </h2>
                  <p className="text-xs text-slate-500">Daily Goal: {dailyWaterGoalMl} ml</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{waterStreakDays} Day Streak</span>
              </div>
            </div>

            {/* Visual Hydration Level Cylinder */}
            <div className="bg-linear-to-b from-cyan-50 to-sky-100 rounded-2xl p-6 border border-cyan-100 text-center relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-4xl font-black text-cyan-950 tracking-tight">
                  {consumedWaterMl}{' '}
                  <span className="text-lg font-bold text-cyan-700">ml</span>
                </span>
                <p className="text-xs font-semibold text-cyan-800 mt-1">
                  {waterPercent}% of target ({dailyWaterGoalMl - consumedWaterMl > 0 ? `${dailyWaterGoalMl - consumedWaterMl} ml left` : 'Goal Exceeded!'})
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-white/70 h-3 rounded-full mt-4 overflow-hidden border border-cyan-200 shadow-inner">
                <div
                  className="bg-linear-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>

              {/* Water Reminder Schedule Switch */}
              <div className="mt-4 pt-3 border-t border-cyan-200/50 flex items-center justify-between text-xs text-cyan-900">
                <span className="flex items-center gap-1 font-semibold">
                  <Bell className="w-3.5 h-3.5 text-cyan-600" /> Hourly Hydration Nudge
                </span>
                <button
                  onClick={() => setWaterReminderActive(!waterReminderActive)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                    waterReminderActive ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {waterReminderActive ? 'Active' : 'Muted'}
                </button>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Log Water
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddWater(150)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all flex flex-col items-center justify-center gap-1 text-slate-800 group cursor-pointer"
                >
                  <Coffee className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">+150 ml</span>
                  <span className="text-[10px] text-slate-500">Small Cup</span>
                </button>
                <button
                  onClick={() => handleAddWater(250)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all flex flex-col items-center justify-center gap-1 text-slate-800 group cursor-pointer"
                >
                  <Droplet className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">+250 ml</span>
                  <span className="text-[10px] text-slate-500">Water Glass</span>
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all flex flex-col items-center justify-center gap-1 text-slate-800 group cursor-pointer"
                >
                  <Droplet className="w-5 h-5 text-teal-600 fill-teal-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">+500 ml</span>
                  <span className="text-[10px] text-slate-500">Full Bottle</span>
                </button>
              </div>
            </div>

            {/* Recent Hydration Logs */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Today's Water Activity
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {waterLogs.map((log) => (
                  <div key={log.id} className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-cyan-500" /> +{log.amountMl} ml
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medicine Reminders, Schedule & Inventory */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {t('medicineReminder', currentLang)} & Adherence
                  </h2>
                  <p className="text-xs text-slate-500">
                    Scheduled doses for today • Tap to log intake
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMedModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </button>
            </div>

            {/* Medicines List */}
            <div className="space-y-3">
              {medicines.map((med) => {
                const isLowStock = med.remainingPills !== undefined && med.remainingPills < 15;
                return (
                  <div
                    key={med.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{med.name}</h3>
                          <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Timing: <span className="font-semibold text-slate-700">{med.timing}</span> • Frequency: {med.frequency} • {med.purpose}
                        </p>
                      </div>

                      {/* Pill Inventory */}
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isLowStock
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Package className="w-3.5 h-3.5" />
                          {med.remainingPills ?? 30} Pills left
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                            Reorder soon!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dosage Slot Checkboxes */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Today's Doses:
                      </span>
                      {/* Morning */}
                      <button
                        onClick={() => handleToggleDose(med.id, 'morning')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          med.takenToday?.morning
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Morning (Breakfast)
                      </button>

                      {/* Afternoon */}
                      <button
                        onClick={() => handleToggleDose(med.id, 'afternoon')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          med.takenToday?.afternoon
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Afternoon (Lunch)
                      </button>

                      {/* Night */}
                      <button
                        onClick={() => handleToggleDose(med.id, 'night')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          med.takenToday?.night
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Night (Dinner)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Food Drug Warning Card */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-1">
                <p className="font-bold text-amber-900">
                  Critical Drug–Food Interaction Advisories:
                </p>
                <p>
                  • <strong>Atorvastatin:</strong> Avoid consuming grapefruit or sour citrus juice within 4 hours.
                </p>
                <p>
                  • <strong>Metformin:</strong> Take immediately after food to minimize gastrointestinal discomfort.
                </p>
                <p>
                  • <strong>Blood Pressure meds (Telmisartan):</strong> Avoid salt substitutes with potassium chloride without clinical consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-teal-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Add New Prescription Medicine</h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewMedicine} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Medicine Name & Generic</label>
                <input
                  type="text"
                  placeholder="e.g. Amlodipine 5mg"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 mg"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-0-0 (Once daily)"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Timing with Food</label>
                  <select
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  >
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                    <option value="With Food">With Food</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Pills in Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={newMedPills}
                    onChange={(e) => setNewMedPills(parseInt(e.target.value) || 30)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
