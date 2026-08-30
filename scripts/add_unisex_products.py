import json
import re

from scripts.generate_catalog_data import womens_products, kids_products
from scripts.update_all_catalog_full import reading_products, sports_products, lens_products

unisex_products = [
  {
    "id": "lens-s-world-rover-dualtone-navigator",
    "name": "LENS S WORLD Rover Dual-Tone Navigator (Gloss Black / Crystal)",
    "type": "eyeglasses",
    "shape": "Rectangle",
    "img": "images/products/unisex/unisex_frame_2.jpg",
    "gallery": [
      "images/products/unisex/unisex_frame_2.jpg",
      "images/products/unisex/unisex_frame_3.jpg",
      "images/products/unisex/unisex_frame_4.jpg"
    ],
    "color": "Black & Crystal Clear",
    "colors": ["Black & Crystal Clear", "Smoky Grey"],
    "material": "Dual-Layer Premium Acetate",
    "price": 1599,
    "mrp": 2699,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-UNI-001",
    "stock": 25,
    "rating": 4.9,
    "reviews": 84,
    "isNew": True,
    "bestSeller": True,
    "size": "Medium to Large (50-21-147)",
    "weight": "19g",
    "description": "Bold square-navigator optical frame crafted with dual-tone black crystal acetate and spring loaded flex hinges.",
    "features": [
      "RROVER Italian Dual-Tone Profile",
      "Reinforced Core Wire Temples",
      "Precision Keyhole Bridge",
      "Compatible with All Prescription Lenses"
    ],
    "frameOnlyAvailable": True,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": True
  },
  {
    "id": "lens-s-world-roma-gold-luxury-pilot-sunglasses",
    "name": "LENS S WORLD Roma Gold Luxury Pilot (Brown Polarized)",
    "type": "sunglasses",
    "shape": "Aviator",
    "img": "images/products/unisex/unisex_frame_10.jpg",
    "gallery": [
      "images/products/unisex/unisex_frame_10.jpg",
      "images/products/unisex/unisex_frame_11.jpg",
      "images/products/unisex/unisex_frame_12.jpg"
    ],
    "color": "Polished Gold / Gradient Brown",
    "colors": ["Polished Gold / Gradient Brown", "Gunmetal / Black"],
    "material": "Diamond-Cut High-Luster Metal Alloy",
    "price": 1999,
    "mrp": 3499,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-UNI-002",
    "stock": 16,
    "rating": 5.0,
    "reviews": 97,
    "isNew": True,
    "bestSeller": True,
    "size": "Oversized Pilot (58-15-142)",
    "weight": "24g",
    "description": "Luxury navigator sunglasses showcasing a diamond-textured gold top bar and polarized HD gradient sun lenses.",
    "features": [
      "ROMA Diamond-Textured Gold Browbar",
      "UV400 Category 3 Polarized Glare Protection",
      "Cushioned Anti-Allergic Silicone Pads",
      "Laser Engraved Metal Core Temples"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": False,
    "lensOptionsAvailable": False
  },
  {
    "id": "lens-s-world-trendy-italy-double-bridge",
    "name": "LENS S WORLD Trendy Fashion Italy Double-Bridge (Gunmetal)",
    "type": "eyeglasses",
    "shape": "Aviator",
    "img": "images/products/unisex/unisex_frame_1.jpg",
    "gallery": [
      "images/products/unisex/unisex_frame_1.jpg",
      "images/products/unisex/unisex_frame_5.jpg",
      "images/products/unisex/unisex_frame_6.jpg"
    ],
    "color": "Gunmetal Steel",
    "colors": ["Gunmetal Steel", "Matte Gold"],
    "material": "Featherlight Stainless Steel Alloy",
    "price": 1699,
    "mrp": 2899,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-UNI-003",
    "stock": 21,
    "rating": 4.8,
    "reviews": 69,
    "isNew": True,
    "bestSeller": True,
    "size": "Medium Universal (53-16-140)",
    "weight": "16g",
    "description": "Italian designed double-bridge pilot optical frames blending retro aviator flair with modern ultra-thin steel lines.",
    "features": [
      "Classic Double Bridge Aviator Bar",
      "Featherweight 16g Construction",
      "Adjustable Silicone Bridge Pads",
      "Prescription & Blue Filter Ready"
    ],
    "frameOnlyAvailable": True,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": True
  },
  {
    "id": "lens-s-world-classic-heritage-demi-acetate",
    "name": "LENS S WORLD Heritage Demi Acetate (Tokyo Tortoise)",
    "type": "eyeglasses",
    "shape": "Round",
    "img": "images/products/unisex/unisex_frame_16.jpg",
    "gallery": [
      "images/products/unisex/unisex_frame_16.jpg",
      "images/products/unisex/unisex_frame_17.jpg",
      "images/products/unisex/unisex_frame_18.jpg"
    ],
    "color": "Tokyo Tortoise",
    "colors": ["Tokyo Tortoise", "Amber Demi"],
    "material": "Handcrafted Bio-Acetate",
    "price": 1749,
    "mrp": 2999,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-UNI-004",
    "stock": 19,
    "rating": 4.9,
    "reviews": 78,
    "isNew": False,
    "bestSeller": True,
    "size": "Universal (49-20-142)",
    "weight": "18g",
    "description": "Iconic round-square demi tortoise frame handcrafted from Italian acetate with seamless organic contours.",
    "features": [
      "Hand-Polished Gloss Tortoise Pattern",
      "5-Barrel Stainless Steel Hinges",
      "Saddle Keyhole Bridge",
      "Progressive & Single Vision Ready"
    ],
    "frameOnlyAvailable": True,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": True
  },
  {
    "id": "lens-s-world-urban-edge-geometric-metal",
    "name": "LENS S WORLD Urban Edge Geometric Metal (Matte Black / Gold)",
    "type": "eyeglasses",
    "shape": "Geometric",
    "img": "images/products/unisex/unisex_frame_22.jpg",
    "gallery": [
      "images/products/unisex/unisex_frame_22.jpg",
      "images/products/unisex/unisex_frame_23.jpg",
      "images/products/unisex/unisex_frame_24.jpg"
    ],
    "color": "Matte Black / Gold",
    "colors": ["Matte Black / Gold", "Rose Gold"],
    "material": "High-Tensile Thin Wire Alloy",
    "price": 1649,
    "mrp": 2799,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-UNI-005",
    "stock": 17,
    "rating": 4.8,
    "reviews": 54,
    "isNew": True,
    "bestSeller": False,
    "size": "Medium (51-19-140)",
    "weight": "15g",
    "description": "Sharply styled octagonal geometric wireframe spectacles designed for contemporary streetwear and formal elegance.",
    "features": [
      "Octagonal Geometric Rim Profile",
      "Dual-Tone Electroplated Finish",
      "Zero-Slip Comfort Temple Sleeves",
      "Single Vision & Screen Lens Ready"
    ],
    "frameOnlyAvailable": True,
    "prescriptionAvailable": True,
    "lensOptionsAvailable": True
  },
  {
    "id": "lens-s-world-horizon-slim-aviator-sunglasses",
    "name": "LENS S WORLD Horizon Slim Aviator (Silver / Blue Polarized)",
    "type": "sunglasses",
    "shape": "Aviator",
    "img": "images/products/unisex/unisex_frame_28.jpg",
    "gallery": [
      "images/products/unisex/unisex_frame_28.jpg",
      "images/products/unisex/unisex_frame_29.jpg",
      "images/products/unisex/unisex_frame_30.jpg"
    ],
    "color": "Silver / Ocean Blue Polarized",
    "colors": ["Silver / Ocean Blue Polarized", "Matte Silver / Grey"],
    "material": "Surgical Grade Stainless Steel",
    "price": 1899,
    "mrp": 3199,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
    "sku": "LSW-UNI-006",
    "stock": 18,
    "rating": 4.9,
    "reviews": 63,
    "isNew": True,
    "bestSeller": True,
    "size": "Universal Aviator (57-14-140)",
    "weight": "21g",
    "description": "Timeless teardrop aviator sunglasses featuring polarized ocean blue lenses and a featherlight corrosion-resistant silver steel frame.",
    "features": [
      "100% UV400 Polarized Blue Mirror Lenses",
      "Surgical Grade Steel Aviator Geometry",
      "Anti-Glare Hydrophobic Outer Coating",
      "Durable Double-Screwed Hinges"
    ],
    "frameOnlyAvailable": False,
    "prescriptionAvailable": False,
    "lensOptionsAvailable": False
  }
]

all_products = womens_products + kids_products + unisex_products + sports_products + reading_products + lens_products

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

print(f"Successfully integrated all products into catalog! Total active products: {len(all_products)}")
print(f" - Womens Eyeglasses: {len(womens_products)}")
print(f" - Kids Eyeglasses: {len(kids_products)}")
print(f" - Unisex Eyeglasses & Sunglasses: {len(unisex_products)}")
print(f" - Sports Sunglasses: {len(sports_products)}")
print(f" - Reading Glasses: {len(reading_products)}")
print(f" - Optical Lens Packages: {len(lens_products)}")
