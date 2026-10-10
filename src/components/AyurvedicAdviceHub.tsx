import React, { useState } from 'react';
import {
  Sparkles,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Heart,
  Droplet,
  Coffee,
  CheckCircle2,
  HelpCircle,
  Sun,
  Flame,
  Wind,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { AyurvedicHerb, LanguageCode } from '../types/health';
import { AYURVEDIC_HERBS, INCOMPATIBLE_FOODS_VIRUDDHA, DINACHARYA_STEPS } from '../data/ayurvedaData';
import { t } from '../utils/translations';

interface AyurvedicAdviceHubProps {
  currentLang: LanguageCode;
}

export const AyurvedicAdviceHub: React.FC<AyurvedicAdviceHubProps> = ({ currentLang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'herbs' | 'dosha-quiz' | 'viruddha' | 'dinacharya'>('herbs');
  const [selectedHerb, setSelectedHerb] = useState<AyurvedicHerb | null>(AYURVEDIC_HERBS[0]);

  // Interactive Prakriti Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ q1?: string; q2?: string; q3?: string }>({});
  const [calculatedDosha, setCalculatedDosha] = useState<string | null>(null);

  const handleSelectQuiz = (q: 'q1' | 'q2' | 'q3', val: string) => {
    const updated = { ...quizAnswers, [q]: val };
    setQuizAnswers(updated);

    if (updated.q1 && updated.q2 && updated.q3) {
      // Calculate dominant dosha
      const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };
      Object.values(updated).forEach((ans) => {
        if (ans) counts[ans] = (counts[ans] || 0) + 1;
      });
      const topDosha = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      setCalculatedDosha(topDosha);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
            <Leaf className="w-3.5 h-3.5" />
            AYUSH & Classical Ayurvedic Clinical Guidance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ayurvedic Medicine & Holistic Health Advice
          </h1>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            Evidence-backed Ayurvedic therapeutics, classical Rasayana herbs, Prakriti dosha balancing, incompatible food rules (Viruddha Ahara), and safe synergy with allopathic prescriptions.
          </p>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-2xl mx-auto border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('herbs')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'herbs'
              ? 'bg-white text-emerald-950 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Classical Herbs</span>
        </button>
        <button
          onClick={() => setActiveSubTab('dosha-quiz')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'dosha-quiz'
              ? 'bg-white text-emerald-950 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Prakriti (Dosha) Quiz</span>
        </button>
        <button
          onClick={() => setActiveSubTab('viruddha')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'viruddha'
              ? 'bg-white text-emerald-950 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Viruddha Ahara (Food Rules)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('dinacharya')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'dinacharya'
              ? 'bg-white text-emerald-950 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Daily Dinacharya</span>
        </button>
      </div>

      {/* Safety Notice: Ayurvedic + Allopathic Synergy */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-950 space-y-1">
          <p className="font-bold text-teal-900">
            Gold Standard Integrative Safety Rule (Charaka & AYUSH Guidance):
          </p>
          <p>
            Always maintain a <strong>60 to 90-minute gap</strong> between your modern allopathic prescriptions (e.g. Metformin, Telmisartan, Atorvastatin) and Ayurvedic herbs. Inform your treating physician or registered Ayurvedic Vaidya before introducing potent botanical formulations.
          </p>
        </div>
      </div>

      {/* 1. Classical Herbs Directory */}
      {activeSubTab === 'herbs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Herb List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Classical Rasayana Herb
            </h2>
            <div className="space-y-2">
              {AYURVEDIC_HERBS.map((herb) => {
                const isSelected = selectedHerb?.id === herb.id;
                return (
                  <button
                    key={herb.id}
                    onClick={() => setSelectedHerb(herb)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900">
                        {herb.name}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {herb.doshaImpact.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-serif italic">
                      {herb.sanskritName}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {herb.therapeuticUse}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Herb Detailed Profile */}
          <div className="lg:col-span-7">
            {selectedHerb ? (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-md space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {selectedHerb.doshaImpact}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Classical Rasayana</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {selectedHerb.name}
                  </h3>
                  <p className="text-xs font-serif italic text-emerald-800 mt-0.5">
                    {selectedHerb.sanskritName}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Clinical Actions & Therapeutic Merits
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedHerb.keyBenefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Ayurvedic Formulation */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
                  <span className="font-extrabold text-amber-950 uppercase tracking-wide block">
                    Recommended Method of Administration:
                  </span>
                  <p className="text-amber-900 leading-relaxed font-medium">
                    {selectedHerb.recommendedForm}
                  </p>
                </div>

                {/* Allopathic Drug Interaction Alert */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
                  <span className="font-extrabold text-rose-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Allopathic Medication Interaction Note:
                  </span>
                  <p className="text-rose-900 leading-relaxed">
                    {selectedHerb.allopathicInteractionNote}
                  </p>
                </div>

                {/* Contraindications */}
                <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-700">Precautions: </span>
                  <span>{selectedHerb.contraindications}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 2. Prakriti (Dosha) Quiz */}
      {activeSubTab === 'dosha-quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Self-Assessment Tool
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Discover Your Dominant Prakriti (Dosha)
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Ayurveda categorizes biological constitution into three fundamental bio-energies: Vata (Air/Space), Pitta (Fire/Water), and Kapha (Earth/Water).
            </p>
          </div>

          {/* Quiz Questions */}
          <div className="space-y-4">
            {/* Question 1: Energy & Digestion */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-extrabold text-slate-800 block">
                1. How would you describe your digestion and appetite?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectQuiz('q1', 'Vata')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q1 === 'Vata'
                      ? 'bg-sky-100 border-sky-400 font-bold text-sky-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Irregular appetite, prone to gas, bloating, or dry stools (Vata)
                </button>
                <button
                  onClick={() => handleSelectQuiz('q1', 'Pitta')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q1 === 'Pitta'
                      ? 'bg-rose-100 border-rose-400 font-bold text-rose-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Fierce hunger, feels irritable if meals delayed, prone to acid reflux (Pitta)
                </button>
                <button
                  onClick={() => handleSelectQuiz('q1', 'Kapha')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q1 === 'Kapha'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Slow but steady appetite, can skip meals easily, heavy after eating (Kapha)
                </button>
              </div>
            </div>

            {/* Question 2: Temperature Tolerance */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-extrabold text-slate-800 block">
                2. How do you react to weather and temperatures?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectQuiz('q2', 'Vata')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q2 === 'Vata'
                      ? 'bg-sky-100 border-sky-400 font-bold text-sky-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Dislike cold and windy weather, love warm blankets and hot tea (Vata)
                </button>
                <button
                  onClick={() => handleSelectQuiz('q2', 'Pitta')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q2 === 'Pitta'
                      ? 'bg-rose-100 border-rose-400 font-bold text-rose-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Sweat easily, dislike hot humid sunshine, crave cool water (Pitta)
                </button>
                <button
                  onClick={() => handleSelectQuiz('q2', 'Kapha')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q2 === 'Kapha'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Dislike cold damp rainy weather, but handle warmth comfortably (Kapha)
                </button>
              </div>
            </div>

            {/* Question 3: Sleep & Mind */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-extrabold text-slate-800 block">
                3. What describes your typical sleep pattern?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectQuiz('q3', 'Vata')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q3 === 'Vata'
                      ? 'bg-sky-100 border-sky-400 font-bold text-sky-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Light sleeper, easily awakened by noises, mind races at night (Vata)
                </button>
                <button
                  onClick={() => handleSelectQuiz('q3', 'Pitta')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q3 === 'Pitta'
                      ? 'bg-rose-100 border-rose-400 font-bold text-rose-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Sound 6-7 hours, can wake up energized, dreams are vivid or intense (Pitta)
                </button>
                <button
                  onClick={() => handleSelectQuiz('q3', 'Kapha')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    quizAnswers.q3 === 'Kapha'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-900'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Heavy, deep 8+ hours sleep, difficult to get out of bed early (Kapha)
                </button>
              </div>
            </div>
          </div>

          {/* Dosha Result Card */}
          {calculatedDosha && (
            <div className="p-5 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider">
                Assessment Result
              </span>
              <h3 className="text-2xl font-black text-emerald-950">
                Dominant Dosha: {calculatedDosha}
              </h3>
              <p className="text-xs text-emerald-900 max-w-md mx-auto leading-relaxed">
                {calculatedDosha === 'Vata' &&
                  'Your body thrives on warm, nourishing soups, sesame oil self-massage (Abhyanga), grounding herbs like Ashwagandha, and consistent sleep schedules.'}
                {calculatedDosha === 'Pitta' &&
                  'Your fire element thrives on cooling foods (cucumber, coconut water, ghee), Amla, Brahmi, and avoiding overly spicy or sour fermented foods.'}
                {calculatedDosha === 'Kapha' &&
                  'Your earth-water element thrives on pungent warming spices (ginger, black pepper, cinnamon), honey in lukewarm water, Triphala, and vigorous daily exercise.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Incompatible Foods (Viruddha Ahara) */}
      {activeSubTab === 'viruddha' && (
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Charaka Samhita Dietary Toxicology
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Viruddha Ahara — Incompatible Food Pairings
            </h2>
            <p className="text-xs text-slate-500">
              Foods that disrupt cellular metabolism and generate endotoxins (Ama) when combined improperly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INCOMPATIBLE_FOODS_VIRUDDHA.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-rose-950">
                      {item.combination}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Ayurvedic Alternative: </span>
                    <span>{item.safeAlternative}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Dinacharya (Daily Routine) */}
      {activeSubTab === 'dinacharya' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Circadian Clock (Brahma Muhurta to Dusk)
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Dinacharya — Classical Daily Longevity Routine
            </h2>
            <p className="text-xs text-slate-500">
              Simple 15-minute daily practices to optimize biological rhythm, dental health, and Agni.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-teal-200 space-y-6">
            {DINACHARYA_STEPS.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  {idx + 1}
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">{step.title}</h3>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
