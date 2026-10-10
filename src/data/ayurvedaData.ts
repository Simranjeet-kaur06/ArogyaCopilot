import { AyurvedicHerb } from '../types/health';

export const AYURVEDIC_HERBS: AyurvedicHerb[] = [
  {
    id: 'herb-1',
    name: 'Ashwagandha (Indian Ginseng)',
    sanskritName: 'अश्वगंधा (Withania somnifera)',
    doshaImpact: 'Balances Vata & Kapha',
    keyBenefits: [
      'Lowers serum cortisol and eases nervous exhaustion / stress',
      'Enhances deep delta-wave sleep and physical vitality',
      'Supports neuromuscular recovery and joint strength',
    ],
    recommendedForm: '3-5g root churna (powder) or 250-500mg extract with warm milk or water at bedtime',
    therapeuticUse: 'Stress resilience, insomnia, fatigue, cognitive revitalization',
    contraindications: 'Avoid in acute hyperthyroidism or pregnancy without qualified Ayurvedic Vaidya guidance.',
    allopathicInteractionNote: 'May mildly potentiate sedatives or thyroid hormone medications. Keep a 90-minute gap from allopathic drugs.',
  },
  {
    id: 'herb-2',
    name: 'Giloy / Guduchi (Amrita - Nectar of Life)',
    sanskritName: 'गिलोय / गुडूची (Tinospora cordifolia)',
    doshaImpact: 'Tridoshic (Balances Vata, Pitta, Kapha)',
    keyBenefits: [
      'Potent immunomodulator and Rasayana rejuvenating tonic',
      'Assists hepatic detox and fever recovery (Jwarahara)',
      'Aids in metabolic insulin sensitivity and healthy uric acid levels',
    ],
    recommendedForm: '15-20ml freshly prepared juice or 500mg extract tablet before morning meal',
    therapeuticUse: 'Immunity defense, chronic low-grade fever, liver detoxification, gout',
    contraindications: 'Caution in severe autoimmune conditions or acute liver failure.',
    allopathicInteractionNote: 'Can lower blood sugar; monitor glucose if taking concurrent Metformin or Glimepiride.',
  },
  {
    id: 'herb-3',
    name: 'Triphala (Three Sacred Fruits: Amla, Haritaki, Bibhitaki)',
    sanskritName: 'त्रिफला (Emblica officinalis, Terminalia chebula, Terminalia bellirica)',
    doshaImpact: 'Tridoshic (Balances all three doshas)',
    keyBenefits: [
      'Gentle natural digestive regulator and colon cleanser (Deepana-Pachana)',
      'Rich in gallic acid and natural antioxidants',
      'Supports healthy gut microbiome without dependency',
    ],
    recommendedForm: '3g powder with lukewarm water 30 minutes before sleep',
    therapeuticUse: 'Sluggish digestion, constipation, ocular health (Chakshushya), systemic detox',
    contraindications: 'Avoid during acute diarrhea, dysentery, or severe dehydration.',
    allopathicInteractionNote: 'Mild bowel stimulant; take 2 hours away from oral medications to ensure full absorption.',
  },
  {
    id: 'herb-4',
    name: 'Arjuna Bark (Guardian of the Heart)',
    sanskritName: 'अर्जुन (Terminalia arjuna)',
    doshaImpact: 'Balances Pitta & Kapha',
    keyBenefits: [
      'Cardioprotective tonic that strengthens myocardial contraction',
      'Promotes healthy lipid metabolism and arterial flexibility',
      'Rich in cardiac glycosides, flavonoids, and CoQ10 precursors',
    ],
    recommendedForm: 'Ksheerapaka (Arjuna bark boiled with milk and water) or 500mg extract capsule twice daily',
    therapeuticUse: 'Mild hypertension, dyslipidemia, cardiac wellness, angina support',
    contraindications: 'Consult doctor before combining with acute heart failure medications.',
    allopathicInteractionNote: 'May synergize with antihypertensive medications like Telmisartan or Beta-blockers; monitor home BP regularly.',
  },
  {
    id: 'herb-5',
    name: 'Brahmi (Herb of Grace)',
    sanskritName: 'ब्राह्मी (Bacopa monnieri)',
    doshaImpact: 'Balances Vata & Pitta',
    keyBenefits: [
      'Premier Medhya Rasayana (brain and cognitive enhancer)',
      'Sharpens working memory, concentration, and synaptic plasticity',
      'Calms hyperactive nervous mind without inducing sleepiness',
    ],
    recommendedForm: '1-2 capsules (250mg extract) or 1 tsp Brahmi Ghrita with warm water after breakfast',
    therapeuticUse: 'Brain fog, memory retention, student exam focus, mild anxiety',
    contraindications: 'May cause mild stomach upset if taken on an empty stomach.',
    allopathicInteractionNote: 'No severe known interactions; maintains a safe synergistic profile.',
  },
  {
    id: 'herb-6',
    name: 'Curcumin & Haridra (Golden Turmeric)',
    sanskritName: 'हरिद्रा (Curcuma longa)',
    doshaImpact: 'Balances Kapha & Vata',
    keyBenefits: [
      'Systemic natural anti-inflammatory and joint cartilage preserver',
      'Potent antimicrobial (Vranaropana) and skin purifier',
      'Protects against oxidative cellular stress and fatty liver changes',
    ],
    recommendedForm: 'Golden Milk (Haldi Doodh) with a pinch of black pepper (piperine) for 2000% higher absorption',
    therapeuticUse: 'Joint stiffness, inflammation, respiratory allergies, seasonal cough',
    contraindications: 'Avoid very high therapeutic doses prior to planned surgery or with gallstone biliary obstruction.',
    allopathicInteractionNote: 'High supplemental doses can have mild anticoagulant properties; caution with Warfarin or Heparin.',
  },
];

export const INCOMPATIBLE_FOODS_VIRUDDHA = [
  {
    combination: 'Milk + Sour Citrus / Fruits (e.g. Banana or Lemon)',
    reason: 'Charaka Samhita warns this curdles dairy in the stomach, creating sticky digestive endotoxins (Ama) and triggering skin eczema or sinus congestion.',
    safeAlternative: 'Enjoy sweet fruit alone as a mid-morning snack, and drink warm spiced milk at night.',
  },
  {
    combination: 'Honey Heated or in Boiling Hot Water',
    reason: 'Heating raw honey beyond 40°C alters its molecular enzymes into a sticky, non-metabolizable residue known as Ghora-Visha (slow toxin).',
    safeAlternative: 'Add raw honey only after herbal tea or kadha has cooled down to warm/lukewarm temperature.',
  },
  {
    combination: 'Nighttime Curd / Yogurt Consumption',
    reason: 'Yogurt is heavy (Guru) and channel-blocking (Abhishyandi). Consumed after sunset, it aggravates Kapha dosha, causing mucus and puffiness.',
    safeAlternative: 'Consume spiced buttermilk (Takra) during lunchtime with roasted cumin and rock salt instead.',
  },
  {
    combination: 'Equal Proportions of Ghee and Honey by Weight',
    reason: 'Classical Ayurvedic toxicology lists 1:1 ratio of Ghee and Honey as an incompatible combination that burdens the digestive fire (Agni).',
    safeAlternative: 'Always use unequal proportions (e.g., 2 parts Ghee to 1 part Honey).',
  },
];

export const DINACHARYA_STEPS = [
  {
    time: '06:00 AM',
    title: 'Ushapan (Morning Warm Water)',
    description: 'Drink 1-2 glasses of warm copper or plain water immediately upon waking to stimulate downward Apana Vata peristalsis.',
  },
  {
    time: '06:15 AM',
    title: 'Jihwa Nirlekhana (Tongue Scraping)',
    description: 'Use a copper or stainless steel tongue cleaner to remove nocturnal bacterial coating (Ama) and awaken taste buds.',
  },
  {
    time: '06:30 AM',
    title: 'Gandusha / Kavala (Oil Pulling)',
    description: 'Swish 1 tablespoon of warm sesame or virgin coconut oil in mouth for 5-8 minutes to strengthen gums and jaw.',
  },
  {
    time: '07:00 AM',
    title: 'Abhyanga (Warm Oil Self-Massage)',
    description: 'Apply warm sesame oil before bathing with long strokes along limbs and circular strokes on joints to pacify Vata.',
  },
  {
    time: '07:30 AM',
    title: 'Pranayama & Surya Namaskar',
    description: '10 minutes of Anulom Vilom (alternate nostril breathing) and gentle Sun Salutations to awaken digestive fire (Agni).',
  },
];
