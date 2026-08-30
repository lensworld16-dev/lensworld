import json
import re

# Read data from script
from scripts.generate_catalog_data import kids_products, womens_products

# Core lenses
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

all_products = womens_products + kids_products + lens_products

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
        lines[-1] = lines[-1].rstrip(",")  # remove trailing comma on last prop
        lines.append("  },")
    lines[-1] = lines[-1].rstrip(",")
    lines.append("];")
    return "\n".join(lines)

# Update js/data.js
with open("js/data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

# Replace INITIAL_PRODUCTS block
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

print("Updated data.js and productsData.js successfully with all Womens, Kids, and Lens products!")
