import os
import glob
import re
from PIL import Image

# 1. Flip upside-down images
upside_down_images = [
    "images/products/unisex/unisex_frame_21.jpg",
    "images/products/unisex/unisex_frame_23.jpg",
    "images/products/unisex/unisex_frame_24.jpg",
    "images/products/unisex/unisex_frame_25.jpg",
    "images/products/unisex/unisex_frame_28.jpg",
    "images/products/unisex/unisex_frame_29.jpg",
    "images/products/womens/women_frame_31.jpg",
    "images/products/womens/women_frame_38.jpg"
]

for img_path in upside_down_images:
    if os.path.exists(img_path):
        im = Image.open(img_path)
        rotated = im.rotate(180)
        rotated.save(img_path, quality=95)
        print(f"Flipped 180°: {img_path}")

# 2. Build correctly categorized catalog data

# Womens (44 total)
womens_sun_indices = {19, 20, 24, 31, 32, 33, 34, 35, 36, 37}
womens_imgs = sorted(glob.glob("images/products/womens/women_frame_*.jpg"), key=lambda x: int(re.search(r'\d+', x).group()))
womens_products = []
w_shapes = ["Cat-Eye", "Round", "Pantos", "Butterfly", "Geometric", "Square", "Oval", "Rectangle", "Hexagonal", "Browline"]
w_colors = [
    "Blush Pink Crystal", "Translucent Rose", "Ice Mint Crystal", "Champagne Gold",
    "Rose Gold", "Burgundy Blush", "Smoky Mauve", "Caramel Tortoise", "Crystal Clear",
    "Lilac Frost", "Amber Glow", "Pearl White", "Crimson Spark", "Ocean Blue Tint",
    "Olive Green", "Lavender Dream", "Peach Sheen", "Gloss Black", "Demi Amber", "Honey Crystal"
]

for idx, img_path in enumerate(womens_imgs, start=1):
    num_str = f"{idx:03d}"
    is_sun = idx in womens_sun_indices
    p_type = "sunglasses" if is_sun else "eyeglasses"
    cat_title = "Sunglasses" if is_sun else "Eyeglasses"
    shape = w_shapes[(idx - 1) % len(w_shapes)]
    color = w_colors[(idx - 1) % len(w_colors)]
    price = 1499 if is_sun else (1299 + ((idx * 50) % 600))
    mrp = price + 1000
    
    prod = {
        "id": f"lens-s-world-women-frame-{idx}",
        "name": f"LENS S WORLD Women {shape} {cat_title} #{idx} ({color})",
        "type": p_type,
        "gender": "women",
        "cats": ["women"],
        "shape": shape,
        "img": img_path.replace("\\", "/"),
        "gallery": [img_path.replace("\\", "/")],
        "color": color,
        "colors": [color],
        "material": "Handcrafted Italian Acetate & Alloy",
        "price": price,
        "mrp": mrp,
        "brand": "LENS S WORLD",
        "sku": f"LSW-WMN-{num_str}",
        "stock": 15 + (idx % 10),
        "rating": round(4.7 + ((idx % 4) * 0.1), 1),
        "reviews": 20 + (idx * 3),
        "isNew": idx % 3 == 0,
        "bestSeller": idx % 4 == 0,
        "size": f"Medium ({48 + (idx % 5)}-{16 + (idx % 3)}-{140 + (idx % 5)})",
        "weight": f"{14 + (idx % 7)}g",
        "description": f"Premium {shape.lower()} {cat_title.lower()} for women in {color.lower()} crafted with exquisite detail.",
        "features": [
            f"Handcrafted Ergonomic {shape} Design",
            "100% UV Protection & Polarized Sun Guard" if is_sun else "Prescription & Blue Cut Screen Compatible",
            "Smooth 5-Barrel Steel Hinges",
            "Ultra-Lightweight Daily Comfort"
        ],
        "frameOnlyAvailable": not is_sun,
        "prescriptionAvailable": not is_sun,
        "lensOptionsAvailable": not is_sun
    }
    womens_products.append(prod)

# Kids (11 total - all eyeglasses)
kids_imgs = sorted(glob.glob("images/products/kids/kid_frame_*.jpg"), key=lambda x: int(re.search(r'\d+', x).group()))
kids_products = []
k_shapes = ["Rectangle", "Oval", "Round", "Sport Rectangle", "Square"]
k_colors = [
    "Translucent Pink / Black", "Magenta / White", "Cobalt / Cyan", "Lilac Violet",
    "Crimson Red", "Sky Blue / Grey", "Neon Green / Navy", "Bubblegum Pink",
    "Royal Blue", "Bright Purple", "Orange / Slate"
]

for idx, img_path in enumerate(kids_imgs, start=1):
    num_str = f"{idx:03d}"
    shape = k_shapes[(idx - 1) % len(k_shapes)]
    color = k_colors[(idx - 1) % len(k_colors)]
    price = 849 + ((idx * 50) % 300)
    mrp = price + 700
    
    prod = {
        "id": f"lens-s-world-kid-frame-{idx}",
        "name": f"LENS S WORLD Flex Kids Eyeglasses #{idx} ({color})",
        "type": "eyeglasses",
        "gender": "kids",
        "cats": ["kids"],
        "shape": shape,
        "img": img_path.replace("\\", "/"),
        "gallery": [img_path.replace("\\", "/")],
        "color": color,
        "colors": [color],
        "material": "Swiss TR90 Flexible Memory Polymer",
        "price": price,
        "mrp": mrp,
        "brand": "LENS S WORLD",
        "sku": f"LSW-KID-{num_str}",
        "stock": 18 + (idx % 8),
        "rating": round(4.8 + ((idx % 3) * 0.1), 1),
        "reviews": 15 + (idx * 2),
        "isNew": idx % 2 == 0,
        "bestSeller": idx % 3 == 0,
        "size": f"Kids ({44 + (idx % 3)}-{16 + (idx % 2)}-{125 + (idx % 6)})",
        "weight": "13g",
        "description": f"Unbreakable lightweight kids {shape.lower()} eyeglasses in {color.lower()} with soft silicone flex temples.",
        "features": [
            "Unbreakable Flexible TR90 Construction",
            "Soft Cushioned Temple Tips",
            "Skin-Friendly Hypoallergenic Material",
            "Compatible with Blue Cut & Power Lenses"
        ],
        "frameOnlyAvailable": True,
        "prescriptionAvailable": True,
        "lensOptionsAvailable": True
    }
    kids_products.append(prod)

# Readers (30 total - all reading-glasses)
readers_imgs = sorted(glob.glob("images/products/readers/reader_frame_*.jpg"), key=lambda x: int(re.search(r'\d+', x).group()))
readers_products = []
r_shapes = ["Rectangle", "Oval", "Square", "Half-Rim", "Classic Reader"]
r_powers = ["+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+3.00"]
r_colors = [
    "Smoky Grey Crystal", "Matte Black", "Warm Tortoise", "Transparent Ice", "Gunmetal Steel",
    "Caramel Demi", "Midnight Blue", "Amber Brown", "Crystal Frost", "Gloss Charcoal"
]

for idx, img_path in enumerate(readers_imgs, start=1):
    num_str = f"{idx:03d}"
    shape = r_shapes[(idx - 1) % len(r_shapes)]
    color = r_colors[(idx - 1) % len(r_colors)]
    power = r_powers[(idx - 1) % len(r_powers)]
    price = 449 + ((idx * 30) % 250)
    mrp = price + 500
    
    prod = {
        "id": f"lens-s-world-reader-frame-{idx}",
        "name": f"LENS S WORLD Clarity Reading Glasses #{idx} ({color} {power})",
        "type": "reading-glasses",
        "gender": "unisex",
        "cats": ["men", "women", "unisex"],
        "shape": shape,
        "img": img_path.replace("\\", "/"),
        "gallery": [img_path.replace("\\", "/")],
        "color": color,
        "colors": [color],
        "material": "High-Grade Optical Polycarbonate",
        "price": price,
        "mrp": mrp,
        "brand": "LENS S WORLD",
        "sku": f"LSW-RD-{num_str}",
        "stock": 20 + (idx % 12),
        "rating": round(4.7 + ((idx % 4) * 0.1), 1),
        "reviews": 30 + (idx * 2),
        "isNew": idx % 3 == 0,
        "bestSeller": idx % 4 == 0,
        "size": f"Universal ({49 + (idx % 4)}-{17 + (idx % 2)}-{140})",
        "weight": "15g",
        "description": f"High clarity {shape.lower()} reading spectacles in {color.lower()} with distortion-free optical magnification.",
        "features": [
            f"Precision Magnification ({power} to +3.00)",
            "Anti-Scratch Optical Resin Lenses",
            "Flexible Comfort Spring Hinges",
            "Featherlight Pocket Design"
        ],
        "frameOnlyAvailable": False,
        "prescriptionAvailable": True,
        "lensOptionsAvailable": False
    }
    readers_products.append(prod)

# Sports (9 total - all sunglasses)
sports_imgs = sorted(glob.glob("images/products/sports/sports_frame_*.jpg"), key=lambda x: int(re.search(r'\d+', x).group()))
sports_products = []
s_shapes = ["Wraparound Sport", "Shield Aviator", "Aerodynamic Wrap", "Active Sport"]
s_colors = [
    "Matte Black / Smoke Polarized", "Crystal Clear / Gold Shield", "Shadow Smoke",
    "Gloss Obsidian / Blue Polarized", "Matte Carbon / Red Mirror", "Gunmetal / Dark Grey",
    "Olive Sport / Polarized Brown", "Navy / Silver Mirror", "Stealth Black"
]

for idx, img_path in enumerate(sports_imgs, start=1):
    num_str = f"{idx:03d}"
    shape = s_shapes[(idx - 1) % len(s_shapes)]
    color = s_colors[(idx - 1) % len(s_colors)]
    price = 1599 + ((idx * 80) % 500)
    mrp = price + 1300
    
    prod = {
        "id": f"lens-s-world-sports-frame-{idx}",
        "name": f"LENS S WORLD Novair Sports Sunglasses #{idx} ({color})",
        "type": "sunglasses",
        "gender": "unisex",
        "cats": ["men", "women", "unisex"],
        "shape": shape,
        "img": img_path.replace("\\", "/"),
        "gallery": [img_path.replace("\\", "/")],
        "color": color,
        "colors": [color],
        "material": "High-Impact Swiss TR90 Memory Frame",
        "price": price,
        "mrp": mrp,
        "brand": "LENS S WORLD",
        "sku": f"LSW-SPT-{num_str}",
        "stock": 16 + (idx % 10),
        "rating": round(4.8 + ((idx % 3) * 0.1), 1),
        "reviews": 40 + (idx * 4),
        "isNew": idx % 2 == 0,
        "bestSeller": True,
        "size": f"Sport Universal ({62 + (idx % 4)}-{15 + (idx % 2)}-{138})",
        "weight": "24g",
        "description": f"High-performance {shape.lower()} sports sunglasses in {color.lower()} with UV400 polarized anti-glare protection.",
        "features": [
            "100% UV400 TAC Polarized Lenses",
            "Italian Aerodynamic Ergonomics",
            "Hydrophilic Anti-Slip Nose Grip",
            "Shatterproof Impact Resistant Frame"
        ],
        "frameOnlyAvailable": False,
        "prescriptionAvailable": False,
        "lensOptionsAvailable": False
    }
    sports_products.append(prod)

# Unisex (30 total - 14 sunglasses, 16 eyeglasses)
unisex_sun_indices = {10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25}
unisex_imgs = sorted(glob.glob("images/products/unisex/unisex_frame_*.jpg"), key=lambda x: int(re.search(r'\d+', x).group()))
unisex_products = []
u_shapes = ["Navigator", "Pilot Aviator", "Double Bridge", "Heritage Round", "Geometric", "Square", "Hexagonal", "Pantos"]
u_colors = [
    "Gunmetal Steel", "Gloss Black / Crystal", "Polished Gold / Brown", "Tokyo Tortoise",
    "Matte Black / Gold", "Silver / Ocean Blue", "Crystal Champagne", "Smoky Grey",
    "Amber Demi", "Rose Gold Wire", "Titanium Grey", "Classic Havana"
]

for idx, img_path in enumerate(unisex_imgs, start=1):
    num_str = f"{idx:03d}"
    is_sun = idx in unisex_sun_indices
    p_type = "sunglasses" if is_sun else "eyeglasses"
    cat_title = "Sunglasses" if is_sun else "Eyeglasses"
    shape = u_shapes[(idx - 1) % len(u_shapes)]
    color = u_colors[(idx - 1) % len(u_colors)]
    price = 1799 if is_sun else (1499 + ((idx * 60) % 500))
    mrp = price + 1200
    
    prod = {
        "id": f"lens-s-world-unisex-frame-{idx}",
        "name": f"LENS S WORLD Unisex {shape} {cat_title} #{idx} ({color})",
        "type": p_type,
        "gender": "unisex",
        "cats": ["men", "women", "unisex"],
        "shape": shape,
        "img": img_path.replace("\\", "/"),
        "gallery": [img_path.replace("\\", "/")],
        "color": color,
        "colors": [color],
        "material": "Surgical Stainless Steel & Premium Acetate",
        "price": price,
        "mrp": mrp,
        "brand": "LENS S WORLD",
        "sku": f"LSW-UNI-{num_str}",
        "stock": 20 + (idx % 10),
        "rating": round(4.8 + ((idx % 3) * 0.1), 1),
        "reviews": 35 + (idx * 3),
        "isNew": idx % 3 == 0,
        "bestSeller": idx % 4 == 0,
        "size": f"Universal ({50 + (idx % 6)}-{17 + (idx % 3)}-{142})",
        "weight": "18g",
        "description": f"Versatile {shape.lower()} {cat_title.lower()} in {color.lower()} designed for all face shapes.",
        "features": [
            "Universal Ergonomic Fit",
            "Stainless Steel & Handcrafted Acetate",
            "Zero-Pressure Adjustable Silicone Pads",
            "UV400 Polarized Sun Glare Protection" if is_sun else "Prescription & Blue Light Filter Compatible"
        ],
        "frameOnlyAvailable": not is_sun,
        "prescriptionAvailable": not is_sun,
        "lensOptionsAvailable": not is_sun
    }
    unisex_products.append(prod)

# Lens Packages (4 total)
lens_products = [
  {
    "id": "lens-s-world-anti-glare-arc-lens-pair",
    "name": "LENS S WORLD Anti-Glare ARC Lens Pair (Replacement)",
    "type": "lenses",
    "gender": "unisex",
    "shape": "Custom Optical",
    "img": "images/anti_glare_arc_lens.jpg",
    "gallery": ["images/anti_glare_arc_lens.jpg"],
    "color": "Clear Green AR Coating",
    "colors": ["Clear Green AR"],
    "material": "Index 1.56 Anti-Reflective Glass",
    "price": 599,
    "mrp": 1199,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
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
    "gender": "unisex",
    "shape": "Custom Optical",
    "img": "images/blue_cut_screen_lens.jpg",
    "gallery": ["images/blue_cut_screen_lens.jpg"],
    "color": "Transparent Blue AR Reflection",
    "colors": ["Clear with Blue Reflection"],
    "material": "Index 1.56 / 1.61 Polycarbonate",
    "price": 999,
    "mrp": 1799,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
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
    "gender": "unisex",
    "shape": "Custom Optical",
    "img": "images/photochromic_transition_lens.jpg",
    "gallery": ["images/photochromic_transition_lens.jpg"],
    "color": "Adaptive Sunlight Darkening",
    "colors": ["Adaptive Sun Tint"],
    "material": "Index 1.56 Fast-Reacting Photochromic",
    "price": 1499,
    "mrp": 2699,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
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
    "gender": "unisex",
    "shape": "Custom Optical",
    "img": "images/progressive_multifocal_lens.jpg",
    "gallery": ["images/progressive_multifocal_lens.jpg"],
    "color": "Multi-Distance Clear Corridor",
    "colors": ["Multi-Distance Clear"],
    "material": "Index 1.61 Digital Free-Form HD",
    "price": 2199,
    "mrp": 3899,
    "brand": "LENS S WORLD",
    "cats": ["men", "women", "unisex"],
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

all_catalog = womens_products + kids_products + readers_products + sports_products + unisex_products + lens_products

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
new_products_block = generate_products_js(all_catalog)

updated_data = re.sub(pattern, new_products_block, data_content, flags=re.DOTALL)
with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(updated_data)

# Update src/data/productsData.js
pattern_react = r"export const PRODUCTS_DATA = \[.*?\];"
new_react_block = new_products_block.replace("INITIAL_PRODUCTS", "PRODUCTS_DATA")
updated_react = f"// Comprehensive Product Catalog for LENS S WORLD\n\n{new_react_block}\n"
with open("src/data/productsData.js", "w", encoding="utf-8") as f:
    f.write(updated_react)

sunglasses_count = len([p for p in all_catalog if p["type"] == "sunglasses"])
eyeglasses_count = len([p for p in all_catalog if p["type"] == "eyeglasses"])
reading_count = len([p for p in all_catalog if p["type"] == "reading-glasses"])
lens_count = len([p for p in all_catalog if p["type"] == "lenses"])

print("\n--- CATALOG SUMMARY ---")
print(f"Total Products: {len(all_catalog)}")
print(f" - Sunglasses: {sunglasses_count} items (Sports: 9, Unisex: 14, Womens: 10)")
print(f" - Eyeglasses: {eyeglasses_count} items (Womens: 34, Unisex: 16, Kids: 11)")
print(f" - Reading Glasses: {reading_count} items")
print(f" - Replacement Lenses: {lens_count} items")
