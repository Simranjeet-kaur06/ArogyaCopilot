import React, { useState } from 'react';
import {
  Calculator,
  Scale,
  Flame,
  Activity,
  Heart,
  TrendingDown,
  Info,
  CheckCircle2,
  Utensils,
  ChevronRight,
  PieChart,
} from 'lucide-react';
import { LanguageCode } from '../types/health';
import { t } from '../utils/translations';

interface CalculatorsHubProps {
  currentLang: LanguageCode;
}

export const CalculatorsHub: React.FC<CalculatorsHubProps> = ({ currentLang }) => {
  const [calcTab, setCalcTab] = useState<'bmi' | 'calories'>('bmi');

  // BMI State
  const [bmiWeightKg, setBmiWeightKg] = useState<number>(72);
  const [bmiHeightCm, setBmiHeightCm] = useState<number>(172);
  const [useAsianIndianCutoffs, setUseAsianIndianCutoffs] = useState<boolean>(true);

  // Calorie State
  const [calAge, setCalAge] = useState<number>(38);
  const [calGender, setCalGender] = useState<'male' | 'female'>('male');
  const [calHeightCm, setCalHeightCm] = useState<number>(172);
  const [calWeightKg, setCalWeightKg] = useState<number>(72);
  const [calActivity, setCalActivity] = useState<number>(1.375); // Light activity default
  const [calGoal, setCalGoal] = useState<'loss' | 'maintain' | 'gain'>('loss');

  // --- BMI Calculations ---
  const heightM = bmiHeightCm / 100;
  const bmiValue = parseFloat((bmiWeightKg / (heightM * heightM)).toFixed(1));

  // Thresholds (Asian-Indian cutoffs as per WHO/ICMR or Global WHO)
  let bmiCategory = 'Normal';
  let bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-300';
  let bmiRisk = 'Low risk of cardiovascular / metabolic disorders';

  if (useAsianIndianCutoffs) {
    if (bmiValue < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-sky-700 bg-sky-50 border-sky-300';
      bmiRisk = 'Nutritional deficiency, lower bone mineral density';
    } else if (bmiValue <= 22.9) {
      bmiCategory = 'Normal / Healthy';
      bmiColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
      bmiRisk = 'Optimal metabolic and cardiovascular baseline';
    } else if (bmiValue <= 27.4) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-amber-700 bg-amber-50 border-amber-300';
      bmiRisk = 'Increased risk of Type 2 Diabetes, hypertension & fatty liver in South Asians';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-rose-700 bg-rose-50 border-rose-300';
      bmiRisk = 'High risk of insulin resistance, dyslipidemia, coronary artery disease';
    }
  } else {
    if (bmiValue < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-sky-700 bg-sky-50 border-sky-300';
    } else if (bmiValue <= 24.9) {
      bmiCategory = 'Normal Weight';
      bmiColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    } else if (bmiValue <= 29.9) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-amber-700 bg-amber-50 border-amber-300';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-rose-700 bg-rose-50 border-rose-300';
    }
  }

  const idealWeightMin = Math.round(18.5 * heightM * heightM);
  const idealWeightMax = Math.round((useAsianIndianCutoffs ? 22.9 : 24.9) * heightM * heightM);

  // --- Calorie Calculations (Mifflin-St Jeor) ---
  // BMR = 10*W + 6.25*H - 5*A (+5 male, -161 female)
  const bmr =
    calGender === 'male'
      ? Math.round(10 * calWeightKg + 6.25 * calHeightCm - 5 * calAge + 5)
      : Math.round(10 * calWeightKg + 6.25 * calHeightCm - 5 * calAge - 161);

  const tdee = Math.round(bmr * calActivity);

  let targetCalories = tdee;
  if (calGoal === 'loss') targetCalories = Math.round(tdee - 500);
  else if (calGoal === 'gain') targetCalories = Math.round(tdee + 350);

  // Macro Splits: Carbs 45%, Protein 25%, Fat 30%
  const proteinCalories = targetCalories * 0.25;
  const proteinGrams = Math.round(proteinCalories / 4);

  const carbsCalories = targetCalories * 0.45;
  const carbsGrams = Math.round(carbsCalories / 4);

  const fatCalories = targetCalories * 0.3;
  const fatGrams = Math.round(fatCalories / 9);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-linear-to-r from-violet-950 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-400/30 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Metabolic Health Analytics • Clinical Anthropometry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            BMI & Daily Calorie Hub
          </h1>
          <p className="text-sm text-violet-100 mt-2 leading-relaxed">
            Calculate your Body Mass Index (with South Asian specific risk thresholds) and determine your daily caloric & macronutrient targets using the Mifflin-St Jeor clinical equation.
          </p>
        </div>
      </div>

      {/* Calculator Tab Switcher */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto border border-slate-200">
        <button
          onClick={() => setCalcTab('bmi')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            calcTab === 'bmi'
              ? 'bg-white text-violet-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-violet-600" />
          <span>{t('calculateBmi', currentLang)}</span>
        </button>
        <button
          onClick={() => setCalcTab('calories')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            calcTab === 'calories'
              ? 'bg-white text-violet-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{t('dailyCalories', currentLang)}</span>
        </button>
      </div>

      {/* BMI Calculator Panel */}
      {calcTab === 'bmi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-violet-600" />
                Anthropometric Parameters
              </h2>
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="asianCutoff"
                  checked={useAsianIndianCutoffs}
                  onChange={(e) => setUseAsianIndianCutoffs(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="asianCutoff" className="text-xs text-slate-600 font-semibold cursor-pointer">
                  Asian-Indian Cutoffs (WHO/ICMR)
                </label>
              </div>
            </div>

            {/* Weight Slider & Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Body Weight</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={bmiWeightKg}
                    onChange={(e) => setBmiWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-16 p-1 text-center font-bold text-sm rounded-lg border border-slate-300 bg-slate-50"
                  />
                  <span className="font-bold text-slate-500">kg</span>
                </div>
              </div>
              <input
                type="range"
                min="35"
                max="160"
                step="0.5"
                value={bmiWeightKg}
                onChange={(e) => setBmiWeightKg(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>35 kg</span>
                <span>Ideal: {idealWeightMin}-{idealWeightMax} kg</span>
                <span>160 kg</span>
              </div>
            </div>

            {/* Height Slider & Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Standing Height</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={bmiHeightCm}
                    onChange={(e) => setBmiHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-16 p-1 text-center font-bold text-sm rounded-lg border border-slate-300 bg-slate-50"
                  />
                  <span className="font-bold text-slate-500">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="120"
                max="215"
                value={bmiHeightCm}
                onChange={(e) => setBmiHeightCm(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>120 cm (3'11")</span>
                <span>{Math.floor(bmiHeightCm / 30.48)}' {Math.round((bmiHeightCm % 30.48) / 2.54)}"</span>
                <span>215 cm (7'0")</span>
              </div>
            </div>

            {/* Quick Reference Note */}
            <div className="p-3.5 bg-violet-50/70 border border-violet-200 rounded-2xl text-xs text-violet-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Why Asian-Indian Cutoffs matter:</p>
                <p className="text-[11px] text-violet-800 mt-0.5 leading-relaxed">
                  South Asians possess higher body fat percentages and visceral abdominal fat at lower BMI values compared to Caucasians. WHO & ICMR set the healthy cutoff at &le;22.9 kg/m².
                </p>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Calculated BMI Score
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl font-black text-slate-900 tracking-tight">
                  {bmiValue}
                </span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${bmiColor}`}>
                  {bmiCategory}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                {bmiRisk}
              </p>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Underweight</span>
                <span>Normal (&le;22.9)</span>
                <span>Overweight (23-27.4)</span>
                <span>Obese (&gt;27.5)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className="w-[18%] bg-sky-400" title="Underweight" />
                <div className="w-[30%] bg-emerald-500" title="Normal" />
                <div className="w-[28%] bg-amber-400" title="Overweight" />
                <div className="w-[24%] bg-rose-500" title="Obese" />
              </div>
            </div>

            {/* Ideal Weight & Guidance */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Ideal Healthy Weight</p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">
                  {idealWeightMin} - {idealWeightMax} kg
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Difference to Normal</p>
                <p className="text-base font-extrabold text-violet-700 mt-0.5">
                  {bmiWeightKg > idealWeightMax
                    ? `-${(bmiWeightKg - idealWeightMax).toFixed(1)} kg needed`
                    : bmiWeightKg < idealWeightMin
                    ? `+${(idealWeightMin - bmiWeightKg).toFixed(1)} kg needed`
                    : 'Within optimal range!'}
                </p>
              </div>
            </div>

            {/* Clinical Recommendation */}
            <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-800">Cardio-Metabolic Advice:</span>
              <p>
                Pair your weight management with 150 minutes of moderate aerobic activity weekly and track waist-to-hip ratio (&lt;0.90 for men, &lt;0.85 for women).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calorie Calculator Panel */}
      {calcTab === 'calories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Personal Energy Profile (Mifflin-St Jeor)
            </h2>

            {/* Gender & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Biological Sex</label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => setCalGender('male')}
                    className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      calGender === 'male' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setCalGender('female')}
                    className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      calGender === 'female' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={calAge}
                  onChange={(e) => setCalAge(parseInt(e.target.value) || 25)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                />
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={calHeightCm}
                  onChange={(e) => setCalHeightCm(parseFloat(e.target.value) || 170)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="180"
                  value={calWeightKg}
                  onChange={(e) => setCalWeightKg(parseFloat(e.target.value) || 70)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Daily Activity Level</label>
              <select
                value={calActivity}
                onChange={(e) => setCalActivity(parseFloat(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
              >
                <option value={1.2}>Sedentary (Desk job, little/no exercise)</option>
                <option value={1.375}>Lightly Active (Brisk walk or workout 1-3 days/wk)</option>
                <option value={1.55}>Moderately Active (Moderate exercise 3-5 days/wk)</option>
                <option value={1.725}>Very Active (Hard sports / gym 6-7 days/wk)</option>
                <option value={1.9}>Extra Active (Physical labor or athlete training 2x/day)</option>
              </select>
            </div>

            {/* Health Goal */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Primary Weight Goal</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCalGoal('loss')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    calGoal === 'loss'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Weight Loss
                  <span className="block text-[10px] font-normal opacity-90">-500 kcal</span>
                </button>
                <button
                  onClick={() => setCalGoal('maintain')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    calGoal === 'maintain'
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Maintain
                  <span className="block text-[10px] font-normal opacity-90">TDEE baseline</span>
                </button>
                <button
                  onClick={() => setCalGoal('gain')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                    calGoal === 'gain'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Lean Gain
                  <span className="block text-[10px] font-normal opacity-90">+350 kcal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Daily Intake
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {targetCalories}
                  </span>
                  <span className="text-sm font-bold text-amber-600">kcal / day</span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400 font-medium block">Basal BMR: {bmr} kcal</span>
                <span className="text-slate-400 font-medium block">TDEE: {tdee} kcal</span>
              </div>
            </div>

            {/* Macronutrient Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-violet-600" />
                Target Macronutrient Split
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Carbs */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-800">Carbohydrates</span>
                  <p className="text-xl font-black text-amber-950 mt-1">{carbsGrams}g</p>
                  <span className="text-[10px] text-amber-700 font-semibold">{carbsCalories} kcal (45%)</span>
                </div>
                {/* Protein */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800">Protein</span>
                  <p className="text-xl font-black text-emerald-950 mt-1">{proteinGrams}g</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">{proteinCalories} kcal (25%)</span>
                </div>
                {/* Healthy Fats */}
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-sky-800">Healthy Fats</span>
                  <p className="text-xl font-black text-sky-950 mt-1">{fatGrams}g</p>
                  <span className="text-[10px] text-sky-700 font-semibold">{fatCalories} kcal (30%)</span>
                </div>
              </div>
            </div>

            {/* Indian Meal Timing Suggestions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-teal-600" />
                Recommended Meal Calorie Distribution:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-900">Breakfast (25%):</span>
                  <span>~{Math.round(targetCalories * 0.25)} kcal (Idli/Poha + Sprouts/Eggs)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-900">Lunch (35%):</span>
                  <span>~{Math.round(targetCalories * 0.35)} kcal (Roti/Millets + Dal + Sabzi)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-900">Snack (15%):</span>
                  <span>~{Math.round(targetCalories * 0.15)} kcal (Makhana, Chana, Green tea)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-900">Dinner (25%):</span>
                  <span>~{Math.round(targetCalories * 0.25)} kcal (Light Khichdi/Soup + Paneer)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
