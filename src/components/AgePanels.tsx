import React, { useState, useEffect } from 'react';
import {
  Baby,
  Smile,
  User,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Trophy,
  Plus,
  ShieldCheck,
  Brain,
  Activity,
  Heart,
  Droplet,
  Eye,
  Coffee,
  Moon,
  Apple,
  X,
  Type,
  PhoneCall,
  Volume2,
  Play,
  RotateCcw,
  Award,
  Calendar,
  AlertCircle,
  Clock,
  Sparkle,
  Zap,
} from 'lucide-react';
import { AgeGroup, AgeTask, AgeTip, LanguageCode } from '../types/health';
import { AGE_PANEL_DATA } from '../data/mockData';
import { t } from '../utils/translations';

interface AgePanelsProps {
  currentLang: LanguageCode;
  onOpenEmergencyModal?: (reason?: 'ill' | 'low' | 'sos') => void;
}

export const AgePanels: React.FC<AgePanelsProps> = ({ currentLang, onOpenEmergencyModal }) => {
  const [activeGroup, setActiveGroup] = useState<AgeGroup>('senior');
  const [tasks, setTasks] = useState<AgeTask[]>(AGE_PANEL_DATA.tasks);
  const [tips, setTips] = useState<AgeTip[]>(AGE_PANEL_DATA.tips);
  const [largeTextMode, setLargeTextMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Custom Task Modal
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Physical' | 'Mental' | 'Nutritional' | 'Habit'>('Habit');
  const [newTaskPoints, setNewTaskPoints] = useState(25);

  // --- Toddler Interactive Widget: Immunization Checklist & Color Tap ---
  const [immunizations, setImmunizations] = useState([
    { id: 'v1', name: 'BCG (Tuberculosis) & Oral Polio (OPV 0)', age: 'At Birth', done: true },
    { id: 'v2', name: 'Hepatitis B (Birth Dose)', age: 'Within 24 Hours', done: true },
    { id: 'v3', name: 'Pentavalent 1 & Rotavirus 1', age: '6 Weeks', done: true },
    { id: 'v4', name: 'Pentavalent 2 & Rotavirus 2', age: '10 Weeks', done: true },
    { id: 'v5', name: 'Pentavalent 3 & PCV 2', age: '14 Weeks', done: true },
    { id: 'v6', name: 'MR 1 (Measles-Rubella) & Vit A 1', age: '9 - 12 Months', done: false },
    { id: 'v7', name: 'DPT Booster 1 & MR 2', age: '16 - 24 Months', done: false },
  ]);

  const [toddlerColorScore, setToddlerColorScore] = useState(0);
  const [toddlerColorTarget, setToddlerColorTarget] = useState({ name: 'Apple Red', color: 'bg-rose-500' });

  const toddlerColors = [
    { name: 'Apple Red', color: 'bg-rose-500' },
    { name: 'Sunny Yellow', color: 'bg-amber-400' },
    { name: 'Grass Green', color: 'bg-emerald-500' },
    { name: 'Sky Blue', color: 'bg-sky-500' },
  ];

  const handleToddlerTapColor = (colorName: string) => {
    if (colorName === toddlerColorTarget.name) {
      setToddlerColorScore((prev) => prev + 10);
      setCelebrationMsg(`🎉 Super Toddler! You found ${colorName}!`);
      setTimeout(() => setCelebrationMsg(null), 2500);
      const nextTarget = toddlerColors[Math.floor(Math.random() * toddlerColors.length)];
      setToddlerColorTarget(nextTarget);
    }
  };

  // --- Teenager Interactive Widget: Box Breathing Anxiety Calmer ---
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          setBreathingPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold';
            if (currentPhase === 'Hold') return 'Exhale';
            if (currentPhase === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // --- Senior Interactive Widget: Memory Recall Brain Puzzle ---
  const [memoryCards, setMemoryCards] = useState([
    { id: 1, text: 'Tulsi Tea', matched: false, revealed: false },
    { id: 2, text: 'Sunlight', matched: false, revealed: false },
    { id: 3, text: 'Tulsi Tea', matched: false, revealed: false },
    { id: 4, text: 'Walking', matched: false, revealed: false },
    { id: 5, text: 'Walking', matched: false, revealed: false },
    { id: 6, text: 'Sunlight', matched: false, revealed: false },
  ]);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState(0);

  const handleFlipCard = (id: number) => {
    if (revealedIds.length === 2 || revealedIds.includes(id)) return;
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.matched) return;

    const newRevealed = [...revealedIds, id];
    setRevealedIds(newRevealed);

    if (newRevealed.length === 2) {
      const card1 = memoryCards.find((c) => c.id === newRevealed[0]);
      const card2 = memoryCards.find((c) => c.id === newRevealed[1]);
      if (card1 && card2 && card1.text === card2.text) {
        setMemoryCards((prev) =>
          prev.map((c) => (c.text === card1.text ? { ...c, matched: true } : c))
        );
        setMemoryScore((prev) => prev + 25);
        setCelebrationMsg(`🧠 Splendid Memory Match: "${card1.text}"!`);
        setTimeout(() => setCelebrationMsg(null), 3000);
        setRevealedIds([]);
      } else {
        setTimeout(() => setRevealedIds([]), 1200);
      }
    }
  };

  const resetMemoryGame = () => {
    setMemoryCards((prev) => prev.map((c) => ({ ...c, matched: false })));
    setRevealedIds([]);
    setMemoryScore(0);
  };

  const groupMeta = {
    toddler: {
      label: t('toddlers', currentLang),
      age: 'Ages 0 - 5',
      subtitle: 'Early Milestones, Immunization & Gentle Sensory Development',
      icon: Baby,
      color: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      activeBorder: 'border-amber-400 ring-amber-400/20',
      desc: 'Nurture infant milestones, monitor national immunization schedules, encourage sensory-motor tactile play, and introduce wholesome Indian weaning foods.',
    },
    teenager: {
      label: t('teenagers', currentLang),
      age: 'Ages 13 - 19',
      subtitle: 'Exam Focus, Posture Ergonomics & Hormonal Resilience',
      icon: Smile,
      color: 'from-sky-500 to-indigo-600',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      activeBorder: 'border-sky-400 ring-sky-400/20',
      desc: 'Master academic exam pressure with 4-7-8 box breathing, correct tech-neck desk posture, maintain clear skin with hydration, and build lean bone density.',
    },
    adult: {
      label: t('adults', currentLang),
      age: 'Ages 20 - 59',
      subtitle: 'Cardio-Metabolic Longevity, Workplace Ergonomics & Longevity',
      icon: User,
      color: 'from-teal-600 to-emerald-600',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      activeBorder: 'border-teal-400 ring-teal-400/20',
      desc: 'Proactive surveillance for diabetes and hypertension, daily micro-breaks at work, high-fiber millets nutrition, and restorative circadian sleep.',
    },
    senior: {
      label: t('seniors', currentLang),
      age: 'Ages 60+',
      subtitle: 'Joint Mobility, Cognitive Vitality & Loving Family Connection',
      icon: HeartHandshake,
      color: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      activeBorder: 'border-rose-400 ring-rose-400/20',
      desc: 'Preserve joint cartilage with gentle chair stretches, fall-proof living spaces, stimulate cognitive neural pathways with memory puzzles, and maintain joyful family calls.',
    },
  };

  const currentMeta = groupMeta[activeGroup];

  const groupTasks = tasks
    .filter((t) => t.targetGroup === activeGroup)
    .filter((t) => selectedCategory === 'all' || t.category === selectedCategory);

  const groupTips = tips.filter((t) => t.targetGroup === activeGroup);

  const completedCount = tasks.filter((t) => t.targetGroup === activeGroup && t.completed).length;
  const totalPoints = tasks
    .filter((t) => t.targetGroup === activeGroup && t.completed)
    .reduce((acc, curr) => acc + curr.points, 0);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((item) => {
        if (item.id === taskId) {
          const newCompleted = !item.completed;
          if (newCompleted) {
            setCelebrationMsg(`🌟 Excellent! Completed "${item.title}" (+${item.points} pts)`);
            setTimeout(() => setCelebrationMsg(null), 3500);
          }
          return { ...item, completed: newCompleted };
        }
        return item;
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const newTask: AgeTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc || 'Engaging wellness micro-task',
      category: newTaskCategory,
      completed: false,
      points: newTaskPoints,
      targetGroup: activeGroup,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  const renderTipIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Apple': return <Apple className="w-5 h-5 text-emerald-600" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-600" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-cyan-600" />;
      case 'Eye': return <Eye className="w-5 h-5 text-sky-600" />;
      case 'Brain': return <Brain className="w-5 h-5 text-purple-600" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-700" />;
      default: return <Heart className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className={`space-y-8 animate-fade-in ${largeTextMode ? 'text-lg leading-relaxed' : ''}`}>
      {/* Celebration Notification Toast */}
      {celebrationMsg && (
        <div className="p-4 bg-linear-to-r from-emerald-600 to-teal-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl animate-bounce">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            {celebrationMsg}
          </span>
          <button onClick={() => setCelebrationMsg(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-teal-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Four Tailored Life-Stage Health Portals
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Life-Stage Health & Engagement Panels
            </h1>
            <p className="text-sm text-cyan-100 mt-2 leading-relaxed">
              Targeted medical guidance, preventive clinical tips, and engaging interactive daily habits curated for Toddlers, Teenagers, Adults, and Seniors.
            </p>
          </div>

          {/* Accessibility: Senior High-Contrast / Large Text Mode */}
          <button
            onClick={() => setLargeTextMode(!largeTextMode)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-sm transition-all cursor-pointer ${
              largeTextMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300/50'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Senior Accessibility: Toggle Large Readable Text"
          >
            <Type className="w-4 h-4" />
            <span>{largeTextMode ? 'Standard Text Size' : 'Senior Large Text Mode (60+)'}</span>
          </button>
        </div>
      </div>

      {/* 4 Age Group Tab Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {(Object.keys(groupMeta) as AgeGroup[]).map((groupKey) => {
          const meta = groupMeta[groupKey];
          const Icon = meta.icon;
          const isActive = activeGroup === groupKey;
          return (
            <button
              key={groupKey}
              onClick={() => setActiveGroup(groupKey)}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${
                isActive
                  ? `bg-white shadow-xl border-2 ${meta.activeBorder} ring-4 ring-teal-500/10 scale-[1.02]`
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-linear-to-br ${meta.color} shadow-md`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-900 block">{meta.label}</span>
                <span className="text-[11px] font-semibold text-slate-400">{meta.age}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Panel Banner & Gamified Score */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${currentMeta.badgeBg}`}>
              {currentMeta.label}
            </span>
            <span className="text-xs text-slate-500 font-bold">{currentMeta.age}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {currentMeta.subtitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
            {currentMeta.desc}
          </p>
        </div>

        {/* Gamification Level & Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs">
            <Trophy className="w-7 h-7 text-amber-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Health Points</span>
              <span className="text-xl font-black text-amber-950">{totalPoints} Pts</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700">
              {completedCount} Tasks Done
            </span>
            <span className="text-[10px] text-slate-400 block">
              Level: {totalPoints > 50 ? 'Gold Master' : totalPoints > 20 ? 'Silver Active' : 'Bronze Cadet'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          AGE-SPECIFIC INTERACTIVE FEATURE WIDGETS
          ======================================================== */}

      {/* 1. TODDLER SPECIAL FEATURE: Immunization Checklist & Sensory Game */}
      {activeGroup === 'toddler' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Pediatric Immunization Schedule */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  National Pediatric Immunization Tracker (MCP Card)
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Universal Immunization (UIP)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Essential vaccines to protect your infant from critical illnesses in the first 24 months.
            </p>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto space-y-1">
              {immunizations.map((vax) => (
                <div key={vax.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{vax.name}</span>
                    <span className="text-[11px] text-slate-400 block font-medium">Due: {vax.age}</span>
                  </div>
                  <button
                    onClick={() =>
                      setImmunizations((prev) =>
                        prev.map((i) => (i.id === vax.id ? { ...i, done: !i.done } : i))
                      )
                    }
                    className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      vax.done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {vax.done ? 'Administered' : 'Pending'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Toddler Sensory Color Tap Game */}
          <div className="md:col-span-5 bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Sensory Color Tapping Game
                </h3>
                <span className="text-xs font-black text-amber-800">
                  Score: {toddlerColorScore}
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Help your toddler tap the target color! Builds early visual recognition.
              </p>
              <div className="mt-4 p-3 bg-white rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">Tap This Color</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">
                  {toddlerColorTarget.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {toddlerColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleToddlerTapColor(c.name)}
                  className={`p-4 rounded-2xl ${c.color} text-white font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TEENAGER SPECIAL FEATURE: 4-7-8 Box Breathing Exam Stress Visualizer */}
      {activeGroup === 'teenager' && (
        <div className="bg-linear-to-br from-sky-950 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
              Exam Stress & Anxiety Calmer
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              4-Phase Box Breathing Visualizer
            </h3>
            <p className="text-xs sm:text-sm text-sky-200 leading-relaxed">
              Lowers cortisol, regulates autonomic heart-rate variability, and calms pre-exam jitters in 2 minutes. Follow the pulse circle!
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isBreathingActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-sky-400 hover:bg-sky-500 text-slate-950'
                }`}
              >
                {isBreathingActive ? 'Pause Session' : 'Start 2-Minute Breathing'}
              </button>
            </div>
          </div>

          {/* Animated Expanding Breathing Circle */}
          <div className="flex flex-col items-center justify-center p-6">
            <div
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-1000 shadow-2xl ${
                breathingPhase === 'Inhale'
                  ? 'scale-110 bg-sky-500/30 border-sky-400 text-sky-200'
                  : breathingPhase === 'Hold'
                  ? 'scale-110 bg-indigo-500/30 border-indigo-400 text-indigo-200'
                  : breathingPhase === 'Exhale'
                  ? 'scale-90 bg-emerald-500/30 border-emerald-400 text-emerald-200'
                  : 'scale-95 bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-widest block opacity-80">
                {breathingPhase}
              </span>
              <span className="text-4xl font-black mt-1 font-mono">
                {breathingTimer}s
              </span>
            </div>
            <span className="text-[11px] text-sky-300 mt-3 font-semibold">
              {breathingPhase === 'Inhale'
                ? 'Deep breath through nose'
                : breathingPhase === 'Hold'
                ? 'Gently retain breath'
                : breathingPhase === 'Exhale'
                ? 'Slow release through mouth'
                : 'Rest and pause'}
            </span>
          </div>
        </div>
      )}

      {/* 3. ADULT SPECIAL FEATURE: 5-Minute Ergonomic Desk Stretches */}
      {activeGroup === 'adult' && (
        <div className="bg-white rounded-3xl p-6 border border-teal-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                5-Minute Desk Ergonomic Stretches (Micro-Break Guide)
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
              Combat Sedentary Strain
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-teal-900 block">1. Neck Lateral Tilt</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Tilt ear towards shoulder, hold 15s each side. Relieves upper trapezius stiffness.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-teal-900 block">2. Seated Spinal Twist</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Place hand on chair armrest and twist gently. Decompresses lumbar thoracic spine.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-teal-900 block">3. Shoulder Blade Retraction</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Pinch shoulder blades together like squeezing a pencil for 10s. Fixes rounded shoulders.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-teal-900 block">4. Hamstring Chair Extension</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Extend leg straight, flex toes towards nose for 20s. Stimulates lower leg venous return.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SENIOR SPECIAL FEATURE: Instant Family Call & Memory Recall Game */}
      {activeGroup === 'senior' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Quick Family Check-in Call & Fall Safety */}
          <div className="md:col-span-6 bg-linear-to-br from-rose-50 to-pink-50 rounded-3xl p-6 border-2 border-rose-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-800 bg-rose-200/80 px-2.5 py-0.5 rounded-full">
                Heart-to-Heart & Emotional Wellness
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                Stay Connected With Your Family
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                A cheerful 5-minute conversation with your children, grandchildren, or close friend elevates serotonin and banishes loneliness.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-rose-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Feeling Low or Need Help?</span>
                <span className="text-[11px] text-slate-500">Instant speed dial to your primary contact</span>
              </div>
              <button
                onClick={() => onOpenEmergencyModal && onOpenEmergencyModal('low')}
                className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Call Family</span>
              </button>
            </div>
          </div>

          {/* Interactive Memory Puzzle Game for Seniors */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Daily Cognitive Memory Puzzle
                </h3>
              </div>
              <button
                onClick={resetMemoryGame}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Flip the cards and find the matching health pairs to sharpen your recall.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {memoryCards.map((card) => {
                const isRevealed = revealedIds.includes(card.id) || card.matched;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleFlipCard(card.id)}
                    className={`h-16 rounded-xl font-bold text-xs p-2 transition-all flex items-center justify-center text-center cursor-pointer border ${
                      card.matched
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : isRevealed
                        ? 'bg-purple-100 border-purple-300 text-purple-900'
                        : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isRevealed ? card.text : '❓ Flip'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills for Tasks */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Physical', 'Mental', 'Nutritional', 'Habit'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Tasks' : cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddTaskModal(true)}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-xl border border-teal-200 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Custom Task for {currentMeta.label}
        </button>
      </div>

      {/* Main Dual Grid: Preventive Tips + Daily Engagement Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preventive Health Tips */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            {t('wellnessTips', currentLang)} ({groupTips.length})
          </h3>

          <div className="space-y-3">
            {groupTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      {renderTipIcon(tip.iconName)}
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{tip.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {tip.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Small, Engaging Interactive Tasks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              {t('dailyTasks', currentLang)} ({groupTasks.length})
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Tap to complete & earn points
            </span>
          </div>

          <div className="space-y-3">
            {groupTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  task.completed
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-extrabold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      +{task.points} pts
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleTask(task.id)}
                  className={`shrink-0 px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{task.completed ? t('completed', currentLang) : t('markDone', currentLang)}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Custom Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-teal-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Create Daily Task for {currentMeta.label}
              </h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. 15 minutes rhythmic breathing / evening stroll"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Engagement Goal</label>
                <textarea
                  rows={2}
                  placeholder="What is the engaging activity or habit?"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-medium"
                  >
                    <option value="Physical">Physical</option>
                    <option value="Mental">Mental</option>
                    <option value="Nutritional">Nutritional</option>
                    <option value="Habit">Habit</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reward Points</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(parseInt(e.target.value) || 20)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-bold"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
