// Lens Packages & Prescription Matrix Data

export const LENS_PACKAGES = [
  {
    id: "anti-glare-arc",
    name: "Anti-Glare ARC Premium Lens",
    tagline: "Ultra-Clear & Reflection Free",
    price: 599,
    mrp: 1199,
    badge: "Essential",
    suitableFor: ["eyeglasses", "lenses"],
    description: "Multi-coated anti-reflective coating reduces nighttime headlight glare, digital reflections, and enhances contrast.",
    features: [
      "99% Light Transmission",
      "Green AR Anti-Reflective Coating",
      "Hydrophobic Water & Oil Repellent",
      "Scratch Guard Resistant Coating"
    ],
    recommendedFor: "Everyday prescription wear, students, and drivers."
  },
  {
    id: "blue-cut-screen",
    name: "Blue Cut Digital EyeShield™",
    tagline: "Essential for Mobile & Computer Users",
    price: 999,
    mrp: 1799,
    badge: "Most Popular",
    suitableFor: ["eyeglasses", "lenses"],
    description: "Filters 90%+ harmful high-energy blue-violet light emitted from computers, smartphones, and LED screens to reduce digital eye strain.",
    features: [
      "UV420 & Blue Light Filter",
      "Reduces Headaches & Digital Fatigue",
      "Crystal Clear Base (No Yellow Hue)",
      "Electromagnetic Interference (EMI) Coating"
    ],
    recommendedFor: "IT professionals, gamers, students, and frequent screen users."
  },
  {
    id: "photochromic-transition",
    name: "Photochromic 2-in-1 Transition Lens",
    tagline: "Clear Indoors · Dark Sunglasses Outdoors",
    price: 1499,
    mrp: 2699,
    badge: "Smart Adapt",
    suitableFor: ["eyeglasses", "lenses"],
    description: "Smart light-reactive molecules instantly darken under sunlight UV and revert back to fully transparent indoors in seconds.",
    features: [
      "Fast 30-Second Outdoor Darkening",
      "Complete UV400 Sun Protection",
      "Clear Indoors for Office & Home",
      "Blue-Light & Scratch Protection Included"
    ],
    recommendedFor: "People who switch frequently between indoors and outdoor sunlight."
  },
  {
    id: "progressive-multifocal",
    name: "Digital HD Progressive / Multifocal",
    tagline: "Near + Intermediate + Distance in One Lens",
    price: 2199,
    mrp: 3899,
    badge: "Premium HD",
    suitableFor: ["eyeglasses", "lenses"],
    description: "Seamless progressive vision with no visible lines on the lens. Enjoy natural focus from mobile reading to computer screen to driving.",
    features: [
      "No Bifocal Line on Glass",
      "Wide Distortion-Free Corridor",
      "Quick 2-Day Adaptation Technology",
      "Free Blue-Cut & Anti-Glare Coating Included"
    ],
    recommendedFor: "Presbyopia patients aged 40+ needing reading and distance vision."
  }
];

export const PRESCRIPTION_POWER_OPTIONS = {
  spheres: [
    "-8.00", "-7.50", "-7.00", "-6.50", "-6.00", "-5.50", "-5.00", "-4.50", "-4.00", "-3.50", "-3.00",
    "-2.75", "-2.50", "-2.25", "-2.00", "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25",
    "0.00 (Plano)",
    "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75",
    "+3.00", "+3.25", "+3.50", "+3.75", "+4.00", "+4.50", "+5.00", "+5.50", "+6.00"
  ],
  cylinders: [
    "0.00", "-0.25", "-0.50", "-0.75", "-1.00", "-1.25", "-1.50", "-1.75", "-2.00",
    "-2.25", "-2.50", "-2.75", "-3.00", "-3.50", "-4.00",
    "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+2.00"
  ],
  addPowers: [
    "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.50"
  ]
};
