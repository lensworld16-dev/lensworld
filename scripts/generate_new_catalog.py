import os
import json

categories_info = [
    {
        'folder': 'mens-eyeglasses',
        'prefix': 'mens_eyeglasses',
        'count': 39,
        'cat_name': "Men's Eyeglasses",
        'type': 'eyeglasses',
        'gender': 'men',
        'cats': ['men', 'eyeglasses'],
        'sku_pfx': 'LSW-ME',
        'shapes': ['Rectangle', 'Square', 'Aviator', 'Geometric', 'Browline', 'Round', 'Wayfarer'],
        'colors': [
            'Matte Black', 'Gunmetal Slate', 'Dark Demi Tortoise', 'Deep Navy Blue', 
            'Brushed Silver', 'Smoke Grey Crystal', 'Midnight Onyx', 'Wood Grain Texture'
        ],
        'materials': [
            'Ultra-Lightweight Titanium Alloy', 'Handcrafted Italian Acetate', 
            'Swiss TR90 Memory Polymer', 'Surgical Grade Stainless Steel'
        ],
        'base_price': 1299,
        'titles': [
            "Titanium Featherlite Rectangle Eyeglasses",
            "Executive Matte Browline Eyeglasses",
            "Apex Architect Geometric Eyeglasses",
            "Vanguard Minimalist Square Eyeglasses",
            "Nordic Sleek Metal Eyeglasses",
            "Metro Bold Acetate Eyeglasses",
            "Urban Commander Pilot Eyeglasses",
            "Orbit Classic Round Metal Eyeglasses",
            "Matrix Streamlined Rectangle Eyeglasses",
            "Cobalt Edge Precision Eyeglasses"
        ]
    },
    {
        'folder': 'womens-eyeglasses',
        'prefix': 'womens_eyeglasses',
        'count': 25,
        'cat_name': "Women's Eyeglasses",
        'type': 'eyeglasses',
        'gender': 'women',
        'cats': ['women', 'eyeglasses'],
        'sku_pfx': 'LSW-WE',
        'shapes': ['Cat-Eye', 'Round', 'Butterfly', 'Hexagonal', 'Pantos', 'Soft Square'],
        'colors': [
            'Rose Gold Crystal', 'Blush Pink', 'Champagne Gold', 'Translucent Peach', 
            'Plum Wine Crystal', 'Honey Tortoise', 'Lavender Mist', 'Glazed Marble'
        ],
        'materials': [
            'Handcrafted Italian Bio-Acetate', 'Rose Gold Alloy & Acetate', 
            'Ultra-Slim Stainless Steel', 'Swiss TR90 Memory Crystal'
        ],
        'base_price': 1349,
        'titles': [
            "Lumina Couture Cat-Eye Eyeglasses",
            "Rose Blossom Delicate Round Eyeglasses",
            "Stella Glamour Butterfly Eyeglasses",
            "Grace Hexagonal Crystal Eyeglasses",
            "Aura Sleek Petite Eyeglasses",
            "Bella Translucent Pastel Eyeglasses",
            "Elegance Sculpted Acetate Eyeglasses",
            "Serena Vintage Pantos Eyeglasses"
        ]
    },
    {
        'folder': 'unisex-eyeglasses',
        'prefix': 'unisex_eyeglasses',
        'count': 40,
        'cat_name': 'Unisex Eyeglasses',
        'type': 'eyeglasses',
        'gender': 'unisex',
        'cats': ['unisex', 'men', 'women', 'couple', 'eyeglasses'],
        'sku_pfx': 'LSW-UE',
        'shapes': ['Round', 'Geometric', 'Square', 'Pantos', 'Rectangle', 'Clubmaster'],
        'colors': [
            'Classic Black & Gold', 'Tortoise Demi', 'Crystal Clear', 'Amber Havana', 
            'Slate Grey', 'Caramel Crystal', 'Dual Tone Espresso', 'Matte Olive'
        ],
        'materials': [
            'Handcrafted Italian Acetate & Alloy', 'Ultra-Lightweight Metal Alloy', 
            'Swiss TR90 Memory Polymer', 'Pure Eco-Cellulose Acetate'
        ],
        'base_price': 1249,
        'titles': [
            "Minimalist Studio Round Eyeglasses",
            "Brooklyn Panto Balanced Eyeglasses",
            "Hexagon Architectural Eyeglasses",
            "Nova Contemporary Square Eyeglasses",
            "Zen Lightweight Wireframe Eyeglasses",
            "Soho Urban Clubmaster Eyeglasses",
            "Moda Translucent Acetate Eyeglasses",
            "Equinox Universal Geometric Eyeglasses"
        ]
    },
    {
        'folder': 'kids-eyewear',
        'prefix': 'kids_eyewear',
        'count': 7,
        'cat_name': 'Kids Eyewear',
        'type': 'eyeglasses',
        'gender': 'kids',
        'cats': ['kids', 'eyeglasses', 'sunglasses'],
        'sku_pfx': 'LSW-KD',
        'shapes': ['Round', 'Rectangle', 'Wayfarer', 'Oval'],
        'colors': [
            'Ocean Blue & Neon Yellow', 'Bubblegum Pink & White', 'Cherry Red & Black', 
            'Royal Navy & Sky Blue', 'Lime Green & Teal', 'Electric Purple', 'Sunny Orange'
        ],
        'materials': [
            'Shatterproof Food-Grade TR90 & Silicone', 'Ultra-Flexible Bendable Polymer', 
            'Anti-Break BPA-Free Silicone TR90'
        ],
        'base_price': 899,
        'titles': [
            "Junior Flex Unbreakable Eyeglasses",
            "Active Kids TR90 Safe Eyewear",
            "Hero Playtime Flexible Eyeglasses",
            "Junior Explorer Blue-Cut Eyeglasses",
            "SmartKid Ergonomic Lightweight Frame",
            "Little Star Flexible Silicone Eyeglasses",
            "Junior Champion Sports & Study Eyewear"
        ]
    },
    {
        'folder': 'mens-sunglasses',
        'prefix': 'mens_sunglasses',
        'count': 30,
        'cat_name': "Men's Sunglasses",
        'type': 'sunglasses',
        'gender': 'men',
        'cats': ['men', 'sunglasses'],
        'sku_pfx': 'LSW-MS',
        'shapes': ['Aviator', 'Square', 'Wayfarer', 'Rectangle', 'Browline'],
        'colors': [
            'Polarized G-15 Dark Green', 'Polarized Matte Black Smoke', 'Polarized Amber Bronze', 
            'Midnight Blue Gradient', 'Silver Mirror Chrome', 'Gunmetal Charcoal'
        ],
        'materials': [
            'Aviation Grade Alloy & TAC Polarized', 'Handcrafted Acetate & Polycarbonate', 
            'Ultra-Tough Swiss TR90'
        ],
        'base_price': 1499,
        'titles': [
            "Solaro Polarized Pilot Aviator Sunglasses",
            "Maverick Square Polarized Sunglasses",
            "Stealth Matte Wayfarer Sunglasses",
            "Vortex Sport Luxury Sunglasses",
            "Navigator Precision Metal Sunglasses",
            "Apex Blackout Polarized Sunglasses",
            "Atlas Heavy-Bridge Aviator Sunglasses"
        ]
    },
    {
        'folder': 'womens-sunglasses',
        'prefix': 'womens_sunglasses',
        'count': 5,
        'cat_name': "Women's Sunglasses",
        'type': 'sunglasses',
        'gender': 'women',
        'cats': ['women', 'sunglasses'],
        'sku_pfx': 'LSW-WS',
        'shapes': ['Oversized', 'Cat-Eye', 'Round', 'Butterfly'],
        'colors': [
            'Gradient Brown Polarized', 'Rose Gold Mirror', 'Classic Glossy Black', 
            'Honey Tortoise Gold', 'Smoky Champagne Gradient'
        ],
        'materials': [
            'Handcrafted Bio-Acetate & UV400 TAC', 'Rose Gold Alloy & Impact Resin'
        ],
        'base_price': 1599,
        'titles': [
            "Diva Oversized Polarized Sunglasses",
            "Bella Sculpted Cat-Eye Sunglasses",
            "Riviera Chic Round Sunglasses",
            "Glamour Butterfly UV400 Sunglasses",
            "Couture Statement Gradient Sunglasses"
        ]
    },
    {
        'folder': 'unisex-sunglasses',
        'prefix': 'unisex_sunglasses',
        'count': 31,
        'cat_name': 'Unisex Sunglasses',
        'type': 'sunglasses',
        'gender': 'unisex',
        'cats': ['unisex', 'men', 'women', 'couple', 'sunglasses'],
        'sku_pfx': 'LSW-US',
        'shapes': ['Round', 'Wayfarer', 'Hexagonal', 'Aviator', 'Square'],
        'colors': [
            'Polarized Smoke Green G-15', 'Polarized Midnight Black', 'Amber Tortoise Gradient', 
            'Gold Rim Emerald Green Lens', 'Matte Carbon Grey'
        ],
        'materials': [
            'Handcrafted Acetate & Polarized TAC', 'High-Grade Lightweight Metal Alloy'
        ],
        'base_price': 1399,
        'titles': [
            "Urban Horizon Polarized Sunglasses",
            "Retro Round Metal Sunglasses",
            "Iconic Hexagon UV400 Sunglasses",
            "Wanderer Polarized Wayfarer Sunglasses",
            "Nomad Everyday Outdoor Sunglasses",
            "Solstice Minimalist Wireframe Sunglasses"
        ]
    },
    {
        'folder': 'sports-sunglasses',
        'prefix': 'sports_sunglasses',
        'count': 5,
        'cat_name': 'Sports Sunglasses',
        'type': 'sunglasses',
        'gender': 'unisex',
        'cats': ['sports', 'men', 'women', 'unisex', 'sunglasses'],
        'sku_pfx': 'LSW-SP',
        'shapes': ['Sports'],
        'colors': [
            'Matte Black / Ice Blue Polarized Mirror', 'Neon Orange / Fire Red Polarized', 
            'Matte Carbon / Smoke Polarized', 'Electric Lime / Emerald Mirror', 'Gloss White / Blue Flash'
        ],
        'materials': [
            'Impact-Resistant TR90 & Hydrophilic Rubber', 'High-Velocity Polycarbonate Shield'
        ],
        'base_price': 1699,
        'titles': [
            "AeroSpeed Wrap Polarized Sports Sunglasses",
            "TurboShield Cycling & Running Sunglasses",
            "Apex Pro Hydrophobic Grip Sunglasses",
            "Veloce High-Velocity Sport Shield",
            "Endurance Tri-Active Polarized Sunglasses"
        ]
    }
]

products = []
sizes = ["Medium (50-18-142)", "Wide (52-19-145)", "Narrow (48-17-140)", "Medium (51-18-143)"]

for cat in categories_info:
    dir_path = os.path.join('public', 'images', 'products', cat['folder'])
    files = sorted([f for f in os.listdir(dir_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))])
    
    for idx, f in enumerate(files, 1):
        rel_img = f"/images/products/{cat['folder']}/{f}"
        
        # ID generation
        if cat['folder'] == 'mens-eyeglasses' and idx == 1:
            prod_id = "lens-s-world-orbit-round-metal"
        else:
            prod_id = f"lens-s-world-{cat['folder']}-{idx}"
        
        title_base = cat['titles'][(idx - 1) % len(cat['titles'])]
        prod_name = f"LENS S WORLD {title_base} #{idx}"
        shape = cat['shapes'][(idx - 1) % len(cat['shapes'])]
        color = cat['colors'][(idx - 1) % len(cat['colors'])]
        material = cat['materials'][(idx - 1) % len(cat['materials'])]
        
        # Price calculation with slight realistic variation
        price = cat['base_price'] + ((idx * 37) % 5) * 50
        mrp = price + 1000 + ((idx * 23) % 4) * 100
        
        sku = f"{cat['sku_pfx']}-{idx:03d}"
        rating = round(4.7 + ((idx * 7) % 4) * 0.1, 1)
        reviews = 18 + (idx * 11) % 65
        stock = 12 + (idx * 5) % 25
        size = sizes[(idx - 1) % len(sizes)]
        
        is_new = (idx % 3 == 0)
        best_seller = (idx % 4 == 1)
        
        if cat['type'] == 'sunglasses':
            features = [
                "100% UV400 Protection & High Contrast Polarized Lenses",
                "Glare-Free Optical Clarity for Driving & Outdoor",
                "Ergonomic Non-Slip Temples with High-Tensile Hinges",
                "Includes Hard Protective Case & Microfiber Cleaning Cloth"
            ]
            desc = f"Premium {shape.lower()} polarized sunglasses in {color.lower()} crafted from {material.lower()} for effortless elegance and all-day sun protection."
            frame_only = True
            prescription_avail = True
            lens_options = False
        else:
            features = [
                "Doctor-Grade Optical Ergonomics & Featherlight Fit",
                "Zero-Pressure Nose Bridge with 5-Barrel Steel Hinges",
                "Fully Compatible with Blue-Cut, Anti-Glare & Progressive Lenses",
                "Includes Hard Protective Case & Microfiber Cleaning Cloth"
            ]
            desc = f"Handcrafted {shape.lower()} eyeglasses in {color.lower()} designed with {material.lower()} for crystal clear vision and superior everyday comfort."
            frame_only = True
            prescription_avail = True
            lens_options = True
            
        prod = {
            "id": prod_id,
            "name": prod_name,
            "type": cat['type'],
            "gender": cat['gender'],
            "cats": cat['cats'],
            "shape": shape,
            "img": rel_img,
            "gallery": [rel_img],
            "color": color,
            "colors": [color],
            "material": material,
            "price": price,
            "mrp": mrp,
            "brand": "LENS S WORLD",
            "sku": sku,
            "stock": stock,
            "rating": rating,
            "reviews": reviews,
            "isNew": is_new,
            "bestSeller": best_seller,
            "size": size,
            "weight": f"{14 + (idx % 6)}g",
            "description": desc,
            "features": features,
            "frameOnlyAvailable": frame_only,
            "prescriptionAvailable": prescription_avail,
            "lensOptionsAvailable": lens_options
        }
        products.append(prod)

print(f"Generated {len(products)} new catalog products from relocated images.")

# Prescription lenses to preserve
lens_products = [
  {
    "id": "lens-s-world-single-vision-anti-glare",
    "name": "LENS S WORLD Anti-Glare ARC Single Vision Prescription Lens Pair",
    "type": "lenses",
    "gender": "unisex",
    "shape": "Round",
    "img": "/images/anti_glare_arc_lens.jpg",
    "gallery": [
      "/images/anti_glare_arc_lens.jpg"
    ],
    "color": "Green ARC Reflex Coating",
    "colors": ["Green ARC Reflex Coating"],
    "material": "1.56 Index MR-8 Impact Resistant Optical Polymer",
    "price": 599,
    "mrp": 1299,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "kids", "lenses"],
    "sku": "LSW-LNS-001",
    "stock": 100,
    "rating": 4.9,
    "reviews": 112,
    "isNew": False,
    "bestSeller": True,
    "size": "Custom Lab Cut to your Frame",
    "weight": "8g",
    "description": "Premium 1.56 high-index single vision lenses featuring 16-layer Anti-Reflective Coating (ARC) for ultra-sharp night driving and zero reflection glare.",
    "features": [
      "16-Layer Double Sided Anti-Reflective Coating (ARC)",
      "High Clarity Night Driving & Glare Suppression",
      "Hydrophobic & Oleophobic Water/Smudge Repellent",
      "Scratch-Resistant Diamond Hard Coat"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-blue-cut-digital",
    "name": "LENS S WORLD Blue Cut Digital Shield Computer Lens Pair",
    "type": "lenses",
    "gender": "unisex",
    "shape": "Round",
    "img": "/images/blue_cut_screen_lens.jpg",
    "gallery": [
      "/images/blue_cut_screen_lens.jpg"
    ],
    "color": "Subtle Violet-Blue Reflection Filter",
    "colors": ["Subtle Violet-Blue Reflection Filter"],
    "material": "1.56 Index Optical Resin with Nano Blue-Block Matrix",
    "price": 899,
    "mrp": 1899,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "kids", "lenses"],
    "sku": "LSW-LNS-002",
    "stock": 100,
    "rating": 5.0,
    "reviews": 164,
    "isNew": False,
    "bestSeller": True,
    "size": "Custom Lab Cut to your Frame",
    "weight": "8g",
    "description": "Doctor-recommended blue-cut computer lenses blocking 90%+ of harmful blue rays from monitors, smartphones, and LED screens to prevent eye strain and headaches.",
    "features": [
      "Blocks 90%+ Harmful HEV 400-455nm Blue Light",
      "Reduces Digital Eye Fatigue, Headaches & Dry Eyes",
      "Integrated ARC Glare Reduction Coating",
      "100% UV400 Broad Spectrum Protection"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-photochromic-transitions",
    "name": "LENS S WORLD Photochromic Auto-Tint Transition Lens Pair",
    "type": "lenses",
    "gender": "unisex",
    "shape": "Round",
    "img": "/images/photochromic_transition_lens.jpg",
    "gallery": [
      "/images/photochromic_transition_lens.jpg"
    ],
    "color": "Clear Indoors to Deep Charcoal Outdoors",
    "colors": ["Clear Indoors to Deep Charcoal Outdoors"],
    "material": "1.56 Index Rapid-Reaction Photochromic Matrix",
    "price": 1499,
    "mrp": 2999,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "kids", "lenses"],
    "sku": "LSW-LNS-003",
    "stock": 100,
    "rating": 4.9,
    "reviews": 88,
    "isNew": True,
    "bestSeller": True,
    "size": "Custom Lab Cut to your Frame",
    "weight": "9g",
    "description": "2-in-1 intelligent lenses that remain 100% crystal clear indoors and automatically transform into dark sunglass tint within seconds under direct sunlight.",
    "features": [
      "Fast 15-Second Activation in Sunlight",
      "Full UV400 & Polarized Glare Defense Outdoors",
      "Crystal Clear Optical Transparency Indoors",
      "ARC & Scratch Resistance Hard-Coated"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-progressive-multifocal",
    "name": "LENS S WORLD HD Digital Progressive Freeform Multifocal Lens Pair",
    "type": "lenses",
    "gender": "unisex",
    "shape": "Round",
    "img": "/images/progressive_multifocal_lens.jpg",
    "gallery": [
      "/images/progressive_multifocal_lens.jpg"
    ],
    "color": "Ultra-Clear ARC Finish",
    "colors": ["Ultra-Clear ARC Finish"],
    "material": "1.60 High-Index Free-Form Digital Cut Optical Monomer",
    "price": 2499,
    "mrp": 4999,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "lenses"],
    "sku": "LSW-LNS-004",
    "stock": 100,
    "rating": 4.8,
    "reviews": 73,
    "isNew": False,
    "bestSeller": True,
    "size": "Custom Lab Cut to your Frame",
    "weight": "9g",
    "description": "Seamless multi-distance vision — near, intermediate and far in one lens.",
    "features": [
      "No Bifocal Line on Glass",
      "Wide Distortion-Free Corridor",
      "Quick 2-Day Adaptation Technology",
      "Free Blue-Cut & Anti-Glare Coating Included"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-microfiber-cleaning-cloth",
    "name": "LENS S WORLD Ultra-Soft Microfiber Eyeglass Cleaning Cloth",
    "type": "accessories",
    "gender": "unisex",
    "shape": "Square",
    "img": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    ],
    "color": "Sky Blue",
    "colors": ["Sky Blue", "Slate Grey", "Classic Black"],
    "material": "Premium High-Density Microfiber",
    "price": 10,
    "mrp": 49,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "kids", "accessories"],
    "sku": "LSW-ACC-010",
    "stock": 500,
    "rating": 4.9,
    "reviews": 184,
    "isNew": True,
    "bestSeller": True,
    "size": "15cm x 15cm",
    "weight": "8g",
    "description": "Ultra-fine lint-free microfiber cloth for crystal-clear, scratch-free lens and screen cleaning. Specially formulated for anti-reflective and blue-cut optical lenses.",
    "features": [
      "Zero-Scratch Optical Grade Fiber",
      "Absorbs Fingerprints, Oils & Smudges Instantly",
      "Reusable & Machine Washable",
      "100% Safe for Blue-Cut & Polarized Lenses"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": False,
    "lensOptionsAvailable": False
  }
]

all_products = products + lens_products

js_content = f"""// Comprehensive Product Catalog for LENS S WORLD
// Catalog Version 2026.09.v2 (182 Category-Relocated Eyewear + Doctor-Grade Prescription Lenses)

export const CATALOG_VERSION = "2026.09.v2";

export const PRODUCTS_DATA = {json.dumps(all_products, indent=2)};

export const CATEGORIES = [
  {{ key: "all", label: "All Eyewear", icon: "Glasses" }},
  {{ key: "eyeglasses", label: "Eyeglasses", desc: "Prescription frames and computer glasses", icon: "Glasses" }},
  {{ key: "sunglasses", label: "Sunglasses", desc: "UV400 Polarized and fashion styles", icon: "Sun" }},
  {{ key: "lenses", label: "Prescription Lenses", desc: "Blue-cut, ARC and Progressives", icon: "Eye" }},
  {{ key: "contact-lenses", label: "Contact Lenses", desc: "Daily and Monthly sterile disposables", icon: "Layers" }},
  {{ key: "accessories", label: "Accessories", desc: "Cleaning kits, cases and cords", icon: "Shield" }},
  {{ key: "offers", label: "Offers & Sale", desc: "Up to 50% Off and BOGO deals", icon: "Tag" }}
];

export const GENDER_COLLECTIONS = [
  {{
    key: "men",
    label: "Men's Collection",
    tagline: "Bold, sharp & effortless",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=men"
  }},
  {{
    key: "women",
    label: "Women's Collection",
    tagline: "Elegant, chic & statement",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=women"
  }},
  {{
    key: "kids",
    label: "Kids' Collection",
    tagline: "Durable, flexible & colorful",
    img: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=kids"
  }},
  {{
    key: "couple",
    label: "Couple / Unisex",
    tagline: "Matching styles for two",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=couple"
  }}
];

export const COUPONS = {{
  "LENS10": {{ type: "percent", value: 10, label: "10% Discount on Total Order", minOrder: 500 }},
  "FLAT200": {{ type: "flat", value: 200, label: "Flat ₹200 Off", minOrder: 1200 }},
  "FREESHIP": {{ type: "free_shipping", value: 0, label: "Free Express Shipping", minOrder: 0 }}
}};
"""

with open('src/data/productsData.js', 'w', encoding='utf-8') as out_f:
    out_f.write(js_content)

print("Wrote src/data/productsData.js successfully with all 187 products!")
