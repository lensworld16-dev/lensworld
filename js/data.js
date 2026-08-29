// LENS S WORLD - Master Data Catalog
// All original LENS S WORLD products, exact details, lens packages, and coupons

export const STORE_INFO = {
  name: "LENS S WORLD",
  brandSubtitle: "चश्मा & Eyewear",
  tagline: "Nayi Nazar, Naya Style",
  subTagline: "Buy stylish eyeglasses & sunglasses for men, women & kids online",
  phone: "+91 86686 87897",
  whatsappNumber: "918668687897",
  email: "lensworld16@gmail.com",
  instagram: "https://www.instagram.com/lens_s_world?igsh=MTc1ZTdnY2Ridmdv",
  facebook: "https://www.facebook.com/share/1DbFJthuZ2/",
  address: "Shop No. 4, LENS S WORLD Optics Hub, Commercial Complex, India",
  supportHours: "Mon - Sun: 10:00 AM - 9:30 PM",
  freeShippingAbove: 499,
  gstRate: 0.12
};

export const CATEGORIES = [
  { key: "all", label: "All Eyewear" },
  { key: "eyeglasses", label: "Eyeglasses" },
  { key: "sunglasses", label: "Sunglasses" },
  { key: "power-specs", label: "Power Specs" },
  { key: "contact-lenses", label: "Contact Lens" },
  { key: "reading-glasses", label: "Readers" },
  { key: "lenses", label: "Lens" },
  { key: "accessories", label: "Accessories" }
];

export const GENDER_CATEGORIES = [
  {
    key: "men",
    label: "Men",
    subtitle: "Eyeglasses & Sunglasses for Men",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    key: "women",
    label: "Women",
    subtitle: "Chic & Statement Frames for Women",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    key: "kids",
    label: "Kids",
    subtitle: "Durable & Flexible Eyewear for Kids",
    img: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=600&q=80"
  }
];

export const DEFAULT_CATEGORY_IMAGES = {
  // Top Story Circles (Order: Eyeglasses, Sunglasses, Power Specs, Contact Lens, Readers, Lens, Accessories)
  story_eyeglasses: "https://chashmah.com/wp-content/uploads/2026/08/1001073249_cropped_768x768.webp",
  story_sunglasses: "https://chashmah.com/wp-content/uploads/2026/08/1001073284_768x768.webp",
  story_power_specs: "https://chashmah.com/wp-content/uploads/2026/08/1001073289_768x768.webp",
  story_contact_lenses: "images/contact_lens_circle.jpg",
  story_readers: "https://chashmah.com/wp-content/uploads/2026/08/1001073293_768x768.webp",
  story_lenses: "https://chashmah.com/wp-content/uploads/2026/08/modern-Silver-rimless-eyeglasses-for-Sikh-LDX178-4.webp",
  story_accessories: "https://chashmah.com/wp-content/uploads/2026/08/1001073223_768x768.webp",

  // Eyeglasses Demographics
  eye_men: "https://chashmah.com/wp-content/uploads/2026/08/1001073265_768x768.webp",
  eye_women: "https://chashmah.com/wp-content/uploads/2026/08/1001073249_cropped_768x768.webp",
  eye_kids: "https://chashmah.com/wp-content/uploads/2026/06/Glass-Grey-Classic-Eyeglasses-175804-4.webp",
  eye_essentials: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",

  // Sunglasses Demographics
  sun_men: "https://chashmah.com/wp-content/uploads/2026/08/1001073284_768x768.webp",
  sun_women: "https://chashmah.com/wp-content/uploads/2026/08/1001073289_768x768.webp",
  sun_kids: "https://chashmah.com/wp-content/uploads/2026/01/Hexxa-Brown-Turban-fit-Sunglasses-GG003-4.webp",
  sun_essentials: "https://chashmah.com/wp-content/uploads/2025/09/Golden-Green-Turban-Fit-Sunglasses-101-5.webp",

  // Mobile Promo Banners
  banner_new_arrival: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
  banner_trending: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240514142320.webp"
};

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

// All 12 Original LENS S WORLD Products with Complete Details
export const INITIAL_PRODUCTS = [
  {
    id: "lens-s-world-ravenna-rectangle",
    name: "LENS S WORLD Ravenna Rectangle",
    type: "eyeglasses",
    shape: "Rectangle",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Midnight Black",
    colors: ["Midnight Black", "Tortoise Shell", "Matte Grey"],
    material: "Premium Italian Acetate",
    price: 1499,
    mrp: 2499,
    brand: "LENS S WORLD",
    cats: ["men", "couple", "unisex"],
    sku: "LSW-EYE-001",
    stock: 18,
    rating: 4.8,
    reviews: 42,
    isNew: false,
    bestSeller: true,
    size: "Medium (52-18-140)",
    weight: "22g",
    description: "Classic handcrafted rectangle eyewear frame designed for all-day comfort and timeless executive style. Compatible with all prescription lens packages.",
    features: [
      "Lightweight Italian Acetate Construction",
      "Reinforced 5-Barrel Steel Hinges",
      "Prescription & Blue-Cut Ready",
      "Hypoallergenic Ergonomic Nose Bridges"
    ],
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  },
  {
    id: "lens-s-world-orbit-round-metal",
    name: "LENS S WORLD Orbit Round Metal",
    type: "eyeglasses",
    shape: "Round",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Vintage Gold / Tortoise",
    colors: ["Vintage Gold / Tortoise", "Rose Gold", "Brushed Silver"],
    material: "Ultra-Lightweight Metal Alloy",
    price: 1899,
    mrp: 2999,
    brand: "LENS S WORLD",
    cats: ["men", "women"],
    sku: "LSW-EYE-002",
    stock: 12,
    rating: 4.9,
    reviews: 68,
    isNew: true,
    bestSeller: true,
    size: "Medium (50-20-142)",
    weight: "17g",
    description: "Retro-inspired round metal eyewear frame featuring delicate filigree engraving and adjustable silicone nose pads for effortless all-day aesthetics.",
    features: [
      "Featherlight Corrosion-Resistant Metal",
      "Soft Cushioned Silicone Nose Pads",
      "Flexible Comfort-Fit Temple Tips",
      "Prescription & Transition Compatible"
    ],
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  },
  {
    id: "lens-s-world-solaro-aviator",
    name: "LENS S WORLD Solaro Aviator",
    type: "sunglasses",
    shape: "Aviator",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Gold & Dark Green Polarized",
    colors: ["Gold & Dark Green", "Black & Smoke", "Silver & Mirror Blue"],
    material: "Stainless Steel & Polycarbonate",
    price: 2299,
    mrp: 3499,
    brand: "LENS S WORLD",
    cats: ["men", "women"],
    sku: "LSW-SUN-001",
    stock: 9,
    rating: 4.7,
    reviews: 35,
    isNew: false,
    bestSeller: true,
    size: "Large (58-14-140)",
    weight: "24g",
    description: "Iconic teardrop aviator sunglasses engineered with UV400 polarized lenses to eliminate road and water reflections while keeping your styling sharp.",
    features: [
      "100% UV400 Protection with Polarized Filter",
      "Signature Double Brow Bar Design",
      "Shatter-Resistant Polycarbonate Lenses",
      "Comes with Premium Leather Case"
    ],
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  },
  {
    id: "lens-s-world-bella-cat-eye",
    name: "LENS S WORLD Bella Cat-Eye",
    type: "eyeglasses",
    shape: "Cat-Eye",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Crystal Champagne",
    colors: ["Crystal Champagne", "Glossy Black", "Blush Pink"],
    material: "Swiss TR90 Memory Polymer",
    price: 1699,
    mrp: 2799,
    brand: "LENS S WORLD",
    cats: ["women"],
    sku: "LSW-EYE-003",
    stock: 14,
    rating: 4.9,
    reviews: 53,
    isNew: true,
    bestSeller: true,
    size: "Small to Medium (51-17-138)",
    weight: "18g",
    description: "Chic and modern cat-eye eyewear designed to uplift facial contours with crystal clear acetate and ultra-flexible TR90 durability.",
    features: [
      "Ultra-Flexible Swiss TR90 Material",
      "Feminine Sculpted Browline",
      "Zero-Pressure Temple Arms",
      "Supports All Prescription Powers"
    ],
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  },
  {
    id: "lens-s-world-velocity-sports",
    name: "LENS S WORLD Velocity Sports",
    type: "sunglasses",
    shape: "Sports",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Matte Carbon Black",
    colors: ["Matte Carbon Black", "Neon Red Accents", "Electric Blue"],
    material: "High-Impact Polycarbonate",
    price: 1999,
    mrp: 3299,
    brand: "LENS S WORLD",
    cats: ["men", "kids"],
    sku: "LSW-SUN-002",
    stock: 15,
    rating: 4.8,
    reviews: 29,
    isNew: false,
    bestSeller: false,
    size: "Large Wrap (62-16-135)",
    weight: "26g",
    description: "Aerodynamic wraparound sports sunglasses engineered for cycling, driving, cricket, and outdoor high-performance adventures.",
    features: [
      "Wind and Dust Proof Wrap Ergonomics",
      "Anti-Slip Hydrophilic Rubber Grip",
      "Polarized Anti-Glare High-Definition Lenses",
      "Impact Resistant Standard ANSI Z87.1"
    ],
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  },
  {
    id: "lens-s-world-azure-wayfarer",
    name: "LENS S WORLD Azure Wayfarer",
    type: "eyeglasses",
    shape: "Wayfarer",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Deep Ocean Blue",
    colors: ["Deep Ocean Blue", "Classic Black", "Havana Brown"],
    material: "Acetate & TR90 Hybrid",
    price: 1299,
    mrp: 2199,
    brand: "LENS S WORLD",
    cats: ["men", "women", "kids"],
    sku: "LSW-EYE-004",
    stock: 22,
    rating: 4.6,
    reviews: 84,
    isNew: false,
    bestSeller: true,
    size: "Medium (53-18-142)",
    weight: "23g",
    description: "Versatile wayfarer silhouette with modern bevels and a subtle deep ocean hue. The universal everyday frame that suits any face shape.",
    features: [
      "Universal Geometric Flattering Fit",
      "Scratch-Resistant Surface Treatment",
      "Flexible Snap-Back Hinges",
      "Full Prescription Customization"
    ],
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  },
  {
    id: "lens-s-world-clarity-reader",
    name: "LENS S WORLD Clarity Reader",
    type: "reading-glasses",
    shape: "Round",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Warm Amber Tortoise",
    colors: ["Warm Amber Tortoise", "Sleek Gunmetal", "Classic Black"],
    material: "Hypoallergenic Metal Frame",
    price: 799,
    mrp: 1299,
    brand: "LENS S WORLD",
    cats: ["men", "women"],
    sku: "LSW-READ-001",
    stock: 30,
    rating: 4.7,
    reviews: 49,
    isNew: false,
    bestSeller: true,
    size: "Compact (48-19-138)",
    weight: "16g",
    powersAvailable: ["+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.50"],
    description: "Ready-to-wear optical reading glasses with crystal-clear precision magnification for reading books, smartphones, and menus comfortably.",
    features: [
      "Selectable Optical Strength (+1.00 to +3.50)",
      "Anti-Reflective Glare Shielding",
      "Compact Pocket-Friendly Profile",
      "Includes Microfiber Soft Pouch"
    ],
    frameOnlyAvailable: false,
    prescriptionAvailable: false,
    lensOptionsAvailable: false
  },
  {
    id: "lens-s-world-focus-reading-pro",
    name: "LENS S WORLD Focus Reading Pro",
    type: "reading-glasses",
    shape: "Rectangle",
    img: "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2024/05/IMG20240502181046.webp"
    ],
    color: "Matte Obsidian Black",
    colors: ["Matte Obsidian Black", "Navy Slate"],
    material: "Ultra-Light Swiss TR90",
    price: 899,
    mrp: 1499,
    brand: "LENS S WORLD",
    cats: ["men", "women"],
    sku: "LSW-READ-002",
    stock: 25,
    rating: 4.8,
    reviews: 62,
    isNew: true,
    bestSeller: false,
    size: "Standard (52-16-140)",
    weight: "14g",
    powersAvailable: ["+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.50"],
    description: "Super-light rectangular reading spectacles with blue-light filtration coating. Ideal for extended tablet and laptop sessions.",
    features: [
      "Dual Action: Reading Power + Blue Cut Filter",
      "Featherlight 14g Weight",
      "Bendable Shatterproof Temples",
      "Available in powers up to +3.50 D"
    ],
    frameOnlyAvailable: false,
    prescriptionAvailable: false,
    lensOptionsAvailable: false
  },
  {
    id: "lens-s-world-aquasoft-monthly",
    name: "LENS S WORLD AquaSoft Monthly",
    type: "contact-lenses",
    shape: "Soft Lens",
    img: "images/contact_lens_circle.jpg",
    gallery: [
      "images/contact_lens_circle.jpg"
    ],
    color: "Clear (With Visibility Tint)",
    colors: ["Clear"],
    material: "Hydrogel 58% Water Content",
    price: 649,
    mrp: 999,
    brand: "LENS S WORLD",
    cats: ["women", "men"],
    sku: "LSW-CL-001",
    stock: 45,
    rating: 4.9,
    reviews: 110,
    isNew: false,
    bestSeller: true,
    packSize: "6 Lenses / Box (3 Months Supply)",
    duration: "Monthly Disposable",
    description: "Premium monthly disposable contact lenses with high oxygen permeability and moisture lock technology for 16-hour irritation-free hydration.",
    features: [
      "58% High Water Content for Dry Eye Relief",
      "Class II UV Blocker",
      "Ultra-Thin Edges for Zero Sensation",
      "Prescription Power from -0.50 to -10.00 D"
    ],
    frameOnlyAvailable: false,
    prescriptionAvailable: true,
    lensOptionsAvailable: false
  },
  {
    id: "lens-s-world-dailyclear-contacts",
    name: "LENS S WORLD DailyClear Contacts",
    type: "contact-lenses",
    shape: "Soft Lens",
    img: "images/contact_lens_circle.jpg",
    gallery: [
      "images/contact_lens_circle.jpg"
    ],
    color: "Clear",
    colors: ["Clear"],
    material: "Silicone Hydrogel",
    price: 549,
    mrp: 899,
    brand: "LENS S WORLD",
    cats: ["women", "men"],
    sku: "LSW-CL-002",
    stock: 50,
    rating: 4.8,
    reviews: 77,
    isNew: true,
    bestSeller: false,
    packSize: "30 Lenses / Pack (15 Days Supply)",
    duration: "Daily Disposable",
    description: "Hygienic single-use daily contact lenses. Fresh sterile pair every morning with zero maintenance, no lens case, and no solution needed.",
    features: [
      "Zero Cleaning Hassle - Fresh Pair Daily",
      "Superior Silicone Breathability",
      "Great for Travel, Sports & Occasions",
      "Supports -0.50 to -8.00 D Prescription"
    ],
    frameOnlyAvailable: false,
    prescriptionAvailable: true,
    lensOptionsAvailable: false
  },
  {
    id: "lens-s-world-blue-cut-lens-pair",
    name: "LENS S WORLD Blue Cut Lens Pair (Replacement)",
    type: "lenses",
    shape: "Custom Optical",
    img: "https://chashmah.com/wp-content/uploads/2026/07/Silver-Rimless-Photochoromic-Eyeglasses-2586-4.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2026/07/Silver-Rimless-Photochoromic-Eyeglasses-2586-4.webp"
    ],
    color: "Transparent Blue AR Reflection",
    colors: ["Clear with Blue Reflection"],
    material: "Index 1.56 / 1.61 Polycarbonate",
    price: 999,
    mrp: 1699,
    brand: "LENS S WORLD",
    cats: ["men", "women"],
    sku: "LSW-LENS-001",
    stock: 99,
    rating: 5.0,
    reviews: 95,
    isNew: false,
    bestSeller: true,
    description: "Standalone pair of custom laboratory-cut blue-light filtering prescription lenses fitted to your existing frame or custom order.",
    features: [
      "Filters 99% Harmful HEV Blue Light (400-455nm)",
      "Hydrophobic & Oleophobic Smudge Resistance",
      "Hard Multi-Coated Anti-Scratch Layer",
      "Precision Digitally Surfaced"
    ],
    frameOnlyAvailable: false,
    prescriptionAvailable: true,
    lensOptionsAvailable: false
  },
  {
    id: "lens-s-world-lens-cleaner-kit",
    name: "LENS S WORLD Lens Cleaner Kit",
    type: "accessories",
    shape: "Care Kit",
    img: "https://chashmah.com/wp-content/uploads/2026/08/1001073223_768x768.webp",
    gallery: [
      "https://chashmah.com/wp-content/uploads/2026/08/1001073223_768x768.webp"
    ],
    color: "Professional Black & Clear",
    colors: ["Kit"],
    material: "Alcohol-free Formulation",
    price: 199,
    mrp: 349,
    brand: "LENS S WORLD",
    cats: ["men", "women", "kids"],
    sku: "LSW-ACC-001",
    stock: 120,
    rating: 4.9,
    reviews: 130,
    isNew: false,
    bestSeller: true,
    description: "Complete professional eyewear care kit featuring anti-static lens spray, premium microfiber cloths, and a miniature keychain optical screwdriver.",
    features: [
      "60ml Streak-Free Anti-Fog Lens Spray",
      "2x Lint-Free Silky Microfiber Cloths",
      "3-in-1 Keychain Precision Screwdriver",
      "Safe for AR, Blue Cut & Polarized Coatings"
    ],
    frameOnlyAvailable: false,
    prescriptionAvailable: false,
    lensOptionsAvailable: false
  }
];

export const COUPONS = {
  "LENS10": { type: "percent", value: 10, label: "10% Discount on Total Order", minOrder: 500 },
  "FLAT200": { type: "flat", value: 200, label: "Flat ₹200 Off", minOrder: 1200 },
  "FREESHIP": { type: "free_shipping", value: 0, label: "Free Express Shipping", minOrder: 0 }
};

export const ORDER_STATUSES = [
  "Placed",
  "Payment Confirmed",
  "Prescription Verification",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled"
];

export const INITIAL_MOCK_ORDERS = [
  {
    id: "LSW-9281",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "Prescription Verification",
    customer: {
      name: "Aman Sharma",
      phone: "+91 98201 44589",
      email: "aman.sharma@example.com",
      address: "Flat 402, Sunshine Residency, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053"
    },
    items: [
      {
        id: "lens-s-world-orbit-round-metal",
        name: "LENS S WORLD Orbit Round Metal",
        price: 1899,
        qty: 1,
        selectedColor: "Vintage Gold / Tortoise",
        selectedLens: {
          id: "blue-cut-screen",
          name: "Blue Cut Digital EyeShield™",
          price: 999
        },
        sku: "LSW-EYE-002",
        img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 2898,
    discount: 200,
    couponApplied: "FLAT200",
    shipping: 0,
    gst: 323,
    total: 3021,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    prescriptionMethod: "upload",
    prescriptionFile: { name: "Rx_Dr_Kapoor_Aman.pdf", size: "1.2 MB" },
    prescriptionDetails: { odSphere: "-1.75", osSphere: "-2.00", odCyl: "-0.50", osCyl: "0.00" },
    notes: "Please pack with extra anti-scratch cloth."
  }
];
