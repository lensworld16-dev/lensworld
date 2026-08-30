// Lens Packages, Contact Lens Disposals & Prescription Matrix Data

export const LENS_PACKAGES = [
  {
    id: "anti-glare-arc",
    name: "Anti-Glare ARC Lens",
    tagline: "Reduces glare & reflections for clear vision.",
    img: "/images/anti_glare_arc_lens.jpg",
    price: 599,
    mrp: 1199,
    badge: "Essential",
    suitableFor: ["eyeglasses", "lenses", "sunglasses"],
    description: "Multi-coated anti-reflective coating reduces nighttime headlight glare and enhances contrast.",
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
    name: "Blue Cut Screen Lens",
    tagline: "Blocks harmful digital screen blue light.",
    img: "/images/blue_cut_screen_lens.jpg",
    price: 999,
    mrp: 1799,
    badge: "Most Popular",
    suitableFor: ["eyeglasses", "lenses", "sunglasses"],
    description: "Filters 90%+ harmful blue-violet light emitted from computers, mobiles, and LED screens.",
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
    name: "Photochromic Transition Lens",
    tagline: "Darkens outdoors, clear indoors adaptively.",
    img: "/images/photochromic_transition_lens.jpg",
    price: 1499,
    mrp: 2699,
    badge: "Smart Adapt",
    suitableFor: ["eyeglasses", "lenses", "sunglasses"],
    description: "Smart light-reactive lenses darken in sunlight UV and turn fully transparent indoors.",
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
    name: "Progressive / Multifocal Lens",
    tagline: "Near, intermediate & far vision in one lens.",
    img: "/images/progressive_multifocal_lens.jpg",
    price: 2199,
    mrp: 3899,
    badge: "Premium HD",
    suitableFor: ["eyeglasses", "lenses", "sunglasses"],
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

export const CONTACT_LENS_DISPOSAL_TYPES = [
  {
    id: "daily",
    name: "Daily",
    tagline: "Daily-use contact lens option.",
    badge: "Most Hygienic",
    description: "Single-use daily disposable contact lens option. Fresh sterile pair every day with zero cleaning or lens case required.",
    packInfo: "30 Lenses / Pack (15 Pairs)",
    priceMultiplier: 1.0
  },
  {
    id: "monthly",
    name: "Monthly",
    tagline: "Monthly-use contact lens option.",
    badge: "Most Popular",
    description: "Monthly-use contact lens option. High oxygen permeability and moisture lock technology for 30 days comfortable wear.",
    packInfo: "6 Lenses / Box (3 Pairs - 3 Months)",
    priceMultiplier: 1.2
  },
  {
    id: "quarterly",
    name: "Quarterly",
    tagline: "Quarterly-use contact lens option.",
    badge: "Extended Wear",
    description: "Quarterly-use contact lens option. 3-Month durable extended-wear soft contact lenses with soothing hydration.",
    packInfo: "2 Lenses / Pack (1 Pair - 3 Months)",
    priceMultiplier: 1.5
  },
  {
    id: "yearly",
    name: "Yearly",
    tagline: "Yearly-use contact lens option.",
    badge: "Annual Value",
    description: "Yearly-use contact lens option. Premium annual soft contact lenses crafted for maximum comfort and lasting clarity.",
    packInfo: "2 Lenses / Vial (1 Pair - 1 Year)",
    priceMultiplier: 2.0
  }
];

export const PRESCRIPTION_POWER_OPTIONS = {
  spheres: [
    "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00", "-5.50", "-5.00",
    "-4.75", "-4.50", "-4.25", "-4.00", "-3.75", "-3.50", "-3.25", "-3.00",
    "-2.75", "-2.50", "-2.25", "-2.00", "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25",
    "0.00 (Plano)",
    "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75",
    "+3.00", "+3.25", "+3.50", "+3.75", "+4.00", "+4.50", "+5.00", "+5.50", "+6.00"
  ],
  contactLensSpheres: [
    "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00", "-5.50", "-5.00",
    "-4.75", "-4.50", "-4.25", "-4.00", "-3.75", "-3.50", "-3.25", "-3.00",
    "-2.75", "-2.50", "-2.25", "-2.00", "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50",
    "0.00 (Plano / Cosmetic)",
    "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75",
    "+3.00", "+3.50", "+4.00", "+4.50", "+5.00", "+5.50", "+6.00"
  ],
  cylinders: [
    "0.00", "-0.25", "-0.50", "-0.75", "-1.00", "-1.25", "-1.50", "-1.75", "-2.00",
    "-2.25", "-2.50", "-2.75", "-3.00", "-3.50", "-4.00",
    "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+2.00"
  ],
  addPowers: [
    "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.50"
  ],
  axis: [
    "0°", "10°", "20°", "30°", "40°", "50°", "60°", "70°", "80°", "90°",
    "100°", "110°", "120°", "130°", "140°", "150°", "160°", "170°", "180°"
  ]
};
