import json
import re

# 1. Womens Eyeglasses
from scripts.generate_catalog_data import womens_products, kids_products

# 2. Reading Glasses Products
reading_products = [
  {
    "id": "lens-s-world-clarity-reader-ys1119-grey",
    "name": "LENS S WORLD Clarity Reader YS-1119 (Smoky Grey)",
    "type": "reading-glasses",
    "shape": "Rectangle",
    "img": "images/products/readers/reader_frame_1.jpg",
    "gallery": [
      "images/products/readers/reader_frame_1.jpg",
      "images/products/readers/reader_frame_2.jpg",
      "images/products/readers/reader_frame_3.jpg",
      "images/products/readers/reader_frame_4.jpg"
    ],
    "color": "Smoky Grey Crystal",
    "colors": ["Smoky Grey Crystal", "Clear Glass"],
    "material": "High-Grade Optical Polycarbonate",
    "price": 499,
    "mrp": 899,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-RD-001",
    "stock": 25,
    "rating": 4.9,
    "reviews": 86,
    "isNew": True,
    "bestSeller": True,
    "size": "Medium Universal (51-17-140)",
    "weight": "16g",
    "description": "Ready-to-wear reading spectacles with crystal clear anti-scratch optics and flexible spring temples for strain-free reading.",
    "features": [
      "Distortion-Free Magnification Optics",
      "Available in +1.00, +1.50, +2.00, +2.50, +3.00",
      "Featherweight 16g Design",
      "Flexible Comfort Spring Hinges"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-focus-comfort-slim-reader",
    "name": "LENS S WORLD Focus Comfort Slim Reader (Matte Black)",
    "type": "reading-glasses",
    "shape": "Rectangle",
    "img": "images/products/readers/reader_frame_6.jpg",
    "gallery": [
      "images/products/readers/reader_frame_6.jpg",
      "images/products/readers/reader_frame_7.jpg",
      "images/products/readers/reader_frame_8.jpg",
      "images/products/readers/reader_frame_9.jpg"
    ],
    "color": "Matte Black",
    "colors": ["Matte Black", "Gunmetal"],
    "material": "Slim Profile Swiss TR90",
    "price": 549,
    "mrp": 999,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-RD-002",
    "stock": 20,
    "rating": 4.8,
    "reviews": 64,
    "isNew": False,
    "bestSeller": True,
    "size": "Slim Universal (50-18-138)",
    "weight": "14g",
    "description": "Sleek pocket-friendly reading glasses engineered for comfortable close-up vision during mobile reading and desk work.",
    "features": [
      "Ultra-Slim Pocket Profile",
      "Precision Power Correction",
      "Anti-Reflective Front Surface",
      "Durable Bendable Temples"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-vintage-tortoise-reader",
    "name": "LENS S WORLD Vintage Amber Reader (Warm Tortoise)",
    "type": "reading-glasses",
    "shape": "Oval",
    "img": "images/products/readers/reader_frame_12.jpg",
    "gallery": [
      "images/products/readers/reader_frame_12.jpg",
      "images/products/readers/reader_frame_13.jpg",
      "images/products/readers/reader_frame_14.jpg",
      "images/products/readers/reader_frame_15.jpg"
    ],
    "color": "Warm Amber Tortoise",
    "colors": ["Warm Amber Tortoise", "Caramel Demi"],
    "material": "Hand-Polished Bio-Acetate",
    "price": 599,
    "mrp": 1099,
    "brand": "LENS S WORLD",
    "cats": ["men", "women"],
    "sku": "LSW-RD-003",
    "stock": 18,
    "rating": 5.0,
    "reviews": 72,
    "isNew": True,
    "bestSeller": True,
    "size": "Medium (49-19-142)",
    "weight": "17g",
    "description": "Classic vintage aesthetic reading spectacles with rich warm tortoiseshell patterns and optical grade resin lenses.",
    "features": [
      "Timeless Vintage Tortoise Styling",
      "High Definition Optical Resin",
      "Zero-Pressure Saddle Nose Bridge",
      "Blue Light Shield Compatible"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-crystal-clear-light-reader",
    "name": "LENS S WORLD Crystal Clear Light Reader (Transparent Ice)",
    "type": "reading-glasses",
    "shape": "Rectangle",
    "img": "images/products/readers/reader_frame_18.jpg",
    "gallery": [
      "images/products/readers/reader_frame_18.jpg",
      "images/products/readers/reader_frame_19.jpg",
      "images/products/readers/reader_frame_20.jpg"
    ],
    "color": "Transparent Ice",
    "colors": ["Transparent Ice", "Frost White"],
    "material": "Crystal Clear Lightweight Polymer",
    "price": 499,
    "mrp": 899,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-RD-004",
    "stock": 22,
    "rating": 4.8,
    "reviews": 49,
    "isNew": False,
    "bestSeller": False,
    "size": "Universal (50-17-140)",
    "weight": "15g",
    "description": "Minimalist transparent frame that pairs effortlessly with any attire, offering sharp crisp magnification for reading and hobbies.",
    "features": [
      "Contemporary Clear Frame Aesthetics",
      "Multi-Power Options (+1.0 to +3.0)",
      "Anti-Smudge Lens Coating",
      "Reinforced Temple Joints"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-executive-halfrim-reader",
    "name": "LENS S WORLD Executive Half-Rim Reader (Gunmetal Steel)",
    "type": "reading-glasses",
    "shape": "Rectangle",
    "img": "images/products/readers/reader_frame_25.jpg",
    "gallery": [
      "images/products/readers/reader_frame_25.jpg",
      "images/products/readers/reader_frame_26.jpg",
      "images/products/readers/reader_frame_27.jpg",
      "images/products/readers/reader_frame_28.jpg"
    ],
    "color": "Gunmetal Grey",
    "colors": ["Gunmetal Grey", "Matte Silver"],
    "material": "Stainless Steel & Carbon Acetate",
    "price": 649,
    "mrp": 1199,
    "brand": "LENS S WORLD",
    "cats": ["men", "women"],
    "sku": "LSW-RD-005",
    "stock": 16,
    "rating": 4.9,
    "reviews": 57,
    "isNew": True,
    "bestSeller": True,
    "size": "Executive Medium (52-18-142)",
    "weight": "18g",
    "description": "Professional half-rim metal reading spectacles featuring adjustable silicone nose pads and distortion-free optical lenses.",
    "features": [
      "Executive Half-Rim Stainless Steel Frame",
      "Adjustable Ergonomic Nose Pads",
      "High Clarity Anti-Scratch Lenses",
      "Available across all Reading Powers"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  }
]

# 3. Sports Sunglasses Products
sports_products = [
  {
    "id": "lens-s-world-novair-polarized-sport-black",
    "name": "LENS S WORLD Novair Italy Polarized Sport (Matte Black)",
    "type": "sunglasses",
    "shape": "Wraparound",
    "img": "images/products/sports/sports_frame_2.jpg",
    "gallery": [
      "images/products/sports/sports_frame_2.jpg",
      "images/products/sports/sports_frame_3.jpg",
      "images/products/sports/sports_frame_4.jpg"
    ],
    "color": "Matte Black / Smoke Polarized",
    "colors": ["Matte Black / Smoke Polarized"],
    "material": "High-Impact Swiss TR90 Memory Frame",
    "price": 1699,
    "mrp": 2999,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-SPT-001",
    "stock": 24,
    "rating": 4.9,
    "reviews": 92,
    "isNew": True,
    "bestSeller": True,
    "size": "Sport Wrap Universal (62-16-135)",
    "weight": "24g",
    "description": "Designed in Italy, Novair high-performance polarized sports sunglasses with aerodynamic wraparound coverage for cycling, driving, and running.",
    "features": [
      "UV400 TAC Polarized Lenses (Anti-Glare)",
      "Novair Italian Aerodynamic Ergonomics",
      "Hydrophilic Anti-Slip Nose Grip",
      "Shatterproof Impact Resistant Construction"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": False,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-aero-shield-aviator-sport",
    "name": "LENS S WORLD Aero-Shield Aviator Sport (Crystal / Gold)",
    "type": "sunglasses",
    "shape": "Shield / Aviator",
    "img": "images/products/sports/sports_frame_1.jpg",
    "gallery": [
      "images/products/sports/sports_frame_1.jpg"
    ],
    "color": "Crystal Clear / Gold Accent",
    "colors": ["Crystal Clear / Gold Accent", "Dark Polarized Tint"],
    "material": "Polycarbonate Shield & Polished Metal Bridge",
    "price": 1899,
    "mrp": 3299,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-SPT-002",
    "stock": 14,
    "rating": 5.0,
    "reviews": 68,
    "isNew": True,
    "bestSeller": True,
    "size": "Oversized Shield (65-14-140)",
    "weight": "26g",
    "description": "Retro-futuristic one-piece shield sunglasses featuring an engraved geometric gold browbar and 100% UV-blocking polarized dark lenses.",
    "features": [
      "One-Piece Panoramic Panoramic Lens View",
      "Gold Mesh Geometric Browbar",
      "100% UVA/UVB Maximum Protection",
      "Ultra-Durable Polycarbonate Front"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": False,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-velocity-wrap-performance",
    "name": "LENS S WORLD Velocity Wrap Performance (Shadow Smoke)",
    "type": "sunglasses",
    "shape": "Wraparound",
    "img": "images/products/sports/sports_frame_5.jpg",
    "gallery": [
      "images/products/sports/sports_frame_5.jpg",
      "images/products/sports/sports_frame_6.jpg",
      "images/products/sports/sports_frame_7.jpg",
      "images/products/sports/sports_frame_8.jpg"
    ],
    "color": "Shadow Smoke",
    "colors": ["Shadow Smoke", "Gloss Obsidian"],
    "material": "Lightweight High-Velocity TR90",
    "price": 1799,
    "mrp": 2999,
    "brand": "LENS S WORLD",
    "cats": ["men", "unisex"],
    "sku": "LSW-SPT-003",
    "stock": 19,
    "rating": 4.8,
    "reviews": 53,
    "isNew": False,
    "bestSeller": True,
    "size": "Large Sport (63-17-138)",
    "weight": "23g",
    "description": "Aggressive wraparound design delivering maximum peripheral coverage, wind reduction, and glare-free polarized vision for intense outdoor action.",
    "features": [
      "Full Peripheral Shielding",
      "Polarized Category 3 Sun Glare Reduction",
      "Sweat & Moisture Channeling Temples",
      "Snug Bounce-Free Grip"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": False,
    "lensOptionsAvailable": False
  }
]

# 4. Lens Replacement Packages
lens_products = [
  {
    "id": "lens-s-world-anti-glare-arc-lens-pair",
    "name": "LENS S WORLD Anti-Glare ARC Lens Pair (Replacement)",
    "type": "lenses",
    "shape": "Custom Optical",
    "img": "images/anti_glare_arc_lens.jpg",
    "gallery": [
      "images/anti_glare_arc_lens.jpg"
    ],
    "color": "Clear Green AR Coating",
    "colors": ["Clear Green AR"],
    "material": "Index 1.56 Anti-Reflective Glass",
    "price": 599,
    "mrp": 1199,
    "brand": "LENS S WORLD",
    "cats": ["men", "women"],
    "sku": "LSW-LENS-001",
    "stock": 99,
    "rating": 4.9,
    "reviews": 88,
    "isNew": False,
    "bestSeller": True,
    "description": "Anti-reflective coating reduces glare for clearer, more comfortable vision.",
    "features": [
      "99% Light Transmission",
      "Green AR Anti-Reflective Coating",
      "Hydrophobic Water & Oil Repellent",
      "Scratch Guard Resistant Coating"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-blue-cut-lens-pair",
    "name": "LENS S WORLD Blue Cut Screen Lens Pair (Replacement)",
    "type": "lenses",
    "shape": "Custom Optical",
    "img": "images/blue_cut_screen_lens.jpg",
    "gallery": [
      "images/blue_cut_screen_lens.jpg"
    ],
    "color": "Transparent Blue AR Reflection",
    "colors": ["Clear with Blue Reflection"],
    "material": "Index 1.56 / 1.61 Polycarbonate",
    "price": 999,
    "mrp": 1799,
    "brand": "LENS S WORLD",
    "cats": ["men", "women"],
    "sku": "LSW-LENS-002",
    "stock": 99,
    "rating": 5.0,
    "reviews": 95,
    "isNew": False,
    "bestSeller": True,
    "description": "Filters harmful blue light from screens for all-day digital comfort.",
    "features": [
      "UV420 & Blue Light Filter",
      "Reduces Headaches & Digital Fatigue",
      "Crystal Clear Base (No Yellow Hue)",
      "Electromagnetic Interference (EMI) Coating"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-photochromic-transition-lens-pair",
    "name": "LENS S WORLD Photochromic Transition Lens Pair",
    "type": "lenses",
    "shape": "Custom Optical",
    "img": "images/photochromic_transition_lens.jpg",
    "gallery": [
      "images/photochromic_transition_lens.jpg"
    ],
    "color": "Adaptive Sunlight Darkening",
    "colors": ["Adaptive Sun Tint"],
    "material": "Index 1.56 Fast-Reacting Photochromic",
    "price": 1499,
    "mrp": 2699,
    "brand": "LENS S WORLD",
    "cats": ["men", "women"],
    "sku": "LSW-LENS-003",
    "stock": 99,
    "rating": 4.9,
    "reviews": 74,
    "isNew": True,
    "bestSeller": True,
    "description": "Lenses that darken outdoors and clear indoors — day to night adaptability.",
    "features": [
      "Fast 30-Second Outdoor Darkening",
      "Complete UV400 Sun Protection",
      "Clear Indoors for Office & Home",
      "Blue-Light & Scratch Protection Included"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-progressive-multifocal-lens-pair",
    "name": "LENS S WORLD Progressive Multifocal Lens Pair",
    "type": "lenses",
    "shape": "Custom Optical",
    "img": "images/progressive_multifocal_lens.jpg",
    "gallery": [
      "images/progressive_multifocal_lens.jpg"
    ],
    "color": "Multi-Distance Clear Corridor",
    "colors": ["Multi-Distance Clear"],
    "material": "Index 1.61 Digital Free-Form HD",
    "price": 2199,
    "mrp": 3899,
    "brand": "LENS S WORLD",
    "cats": ["men", "women"],
    "sku": "LSW-LENS-004",
    "stock": 99,
    "rating": 5.0,
    "reviews": 62,
    "isNew": False,
    "bestSeller": True,
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
  }
]

all_products = womens_products + kids_products + sports_products + reading_products + lens_products

def format_js_val(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        escaped = v.replace('"', '\\"')
        return f'"{escaped}"'
    if isinstance(v, list):
        items = ", ".join(format_js_val(item) for item in v)
        return f"[{items}]"
    if isinstance(v, dict):
        entries = ", ".join(f'"{k}": {format_js_val(val)}' for k, val in v.items())
        return f"{{{entries}}}"
    return "null"

def generate_products_js(prod_list):
    lines = ["export const INITIAL_PRODUCTS = ["]
    for p in prod_list:
        lines.append("  {")
        for k, v in p.items():
            lines.append(f"    {k}: {format_js_val(v)},")
        lines[-1] = lines[-1].rstrip(",")
        lines.append("  },")
    lines[-1] = lines[-1].rstrip(",")
    lines.append("];")
    return "\n".join(lines)

# Update js/data.js
with open("js/data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

pattern = r"export const INITIAL_PRODUCTS = \[.*?\];"
new_products_block = generate_products_js(all_products)

updated_data = re.sub(pattern, new_products_block, data_content, flags=re.DOTALL)
with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(updated_data)

# Update src/data/productsData.js
pattern_react = r"export const PRODUCTS_DATA = \[.*?\];"
new_react_block = new_products_block.replace("INITIAL_PRODUCTS", "PRODUCTS_DATA")
updated_react = f"// Comprehensive Product Catalog for LENS S WORLD\n\n{new_react_block}\n"
with open("src/data/productsData.js", "w", encoding="utf-8") as f:
    f.write(updated_react)

print(f"Successfully added all products to catalog! Total active products: {len(all_products)}")
print(f" - Womens Eyeglasses: {len(womens_products)}")
print(f" - Kids Eyeglasses: {len(kids_products)}")
print(f" - Sports Sunglasses: {len(sports_products)}")
print(f" - Reading Glasses: {len(reading_products)}")
print(f" - Optical Lens Packages: {len(lens_products)}")
