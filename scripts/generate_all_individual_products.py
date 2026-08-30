import os
import glob
import re

# 1. Womens Eyeglasses (44 individual products)
womens_imgs = sorted(glob.glob("images/products/womens/women_frame_*.jpg"), key=lambda x: int(re.search(r'\d+', x).group()))
womens_products = []
w_shapes = ["Cat-Eye", "Round", "Pantos", "Butterfly", "Geometric", "Square", "Oval", "Rectangle", "Hexagonal", "Browline"]
w_colors = [
    "Blush Pink Crystal", "Translucent Rose", "Ice Mint Crystal", "Champagne Gold",
    "Rose Gold", "Burgundy Blush", "Smoky Mauve", "Caramel Tortoise", "Crystal Clear",
    "Lilac Frost", "Amber Glow", "Pearl White", "Crimson Spark", "Ocean Blue Tint",
    "Olive Green", "Lavender Dream", "Peach Sheen", "Gloss Black", "Demi Amber", "Honey Crystal"
]
w_materials = [
    "Handcrafted Italian Acetate", "Ultra-Lightweight Gloss Acetate", "Crystal TR90 Hybrid",
    "Corrosion-Resistant Metal Alloy", "Stainless Steel Alloy", "Sculpted Memory Polymer",
    "Bio-Acetate Premium", "Featherlight Steel Wire"
]

for idx, img_path in enumerate(womens_imgs, start=1):
    num_str = f"{idx:03d}"
    shape = w_shapes[(idx - 1) % len(w_shapes)]
    color = w_colors[(idx - 1) % len(w_colors)]
    material = w_materials[(idx - 1) % len(w_materials)]
    price = 1299 + ((idx * 50) % 600)  # Range: 1299 - 1899
    mrp = price + 1000
    
    prod = {
        "id": f"lens-s-world-women-frame-{idx}",
        "name": f"LENS S WORLD {shape} Women Eyewear #{idx} ({color})",
        "type": "eyeglasses",
        "gender": "women",
        "cats": ["women"],
        "shape": shape,
        "img": img_path.replace("\\", "/"),
        "gallery": [img_path.replace("\\", "/")],
        "color": color,
        "colors": [color],
        "material": material,
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
        "description": f"Premium {shape.lower()} optical frame in {color.lower()} crafted from {material.lower()}.",
        "features": [
            f"Handcrafted {material}",
            f"Ergonomic {shape} Silhouette",
            "Smooth 5-Barrel Steel Hinges",
            "Compatible with Blue Cut & Prescription Lenses"
        ],
        "frameOnlyAvailable": True,
        "prescriptionAvailable": True,
        "lensOptionsAvailable": True
    }
    womens_products.append(prod)

# 2. Kids Eyeglasses (11 individual products)
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
    price = 849 + ((idx * 50) % 300)  # Range: 849 - 1099
    mrp = price + 700
    
    prod = {
        "id": f"lens-s-world-kid-frame-{idx}",
        "name": f"LENS S WORLD Flex Kids Eyewear #{idx} ({color})",
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
        "description": f"Unbreakable lightweight kids {shape.lower()} frame in {color.lower()} with soft silicone flex temples.",
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

# 3. Reading Glasses (30 individual products)
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
    price = 449 + ((idx * 30) % 250)  # Range: 449 - 699
    mrp = price + 500
    
    prod = {
        "id": f"lens-s-world-reader-frame-{idx}",
        "name": f"LENS S WORLD Clarity Reader #{idx} ({color} {power})",
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

# 4. Sports Sunglasses (9 individual products)
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
    price = 1599 + ((idx * 80) % 500)  # Range: 1599 - 1999
    mrp = price + 1300
    
    prod = {
        "id": f"lens-s-world-sports-frame-{idx}",
        "name": f"LENS S WORLD Novair Sport #{idx} ({color})",
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
        "description": f"High-performance {shape.lower()} sunglasses in {color.lower()} with UV400 polarized anti-glare protection.",
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

# 5. Unisex Eyeglasses & Sunglasses (30 individual products)
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
    shape = u_shapes[(idx - 1) % len(u_shapes)]
    color = u_colors[(idx - 1) % len(u_colors)]
    is_sun = (idx % 4 == 0) or ("Gold" in color and "Brown" in color) or ("Blue" in color and "Silver" in color)
    p_type = "sunglasses" if is_sun else "eyeglasses"
    price = 1499 + ((idx * 60) % 600)  # Range: 1499 - 1999
    mrp = price + 1200
    
    prod = {
        "id": f"lens-s-world-unisex-frame-{idx}",
        "name": f"LENS S WORLD Unisex {shape} #{idx} ({color})",
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
        "description": f"Versatile {shape.lower()} {p_type} in {color.lower()} designed for all face shapes with premium metal-acetate craftsmanship.",
        "features": [
            "Universal Ergonomic Fit",
            "Stainless Steel & Handcrafted Acetate",
            "Zero-Pressure Adjustable Silicone Pads",
            "Prescription & Screen Protection Compatible" if not is_sun else "UV400 Polarized Sun Glare Protection"
        ],
        "frameOnlyAvailable": not is_sun,
        "prescriptionAvailable": not is_sun,
        "lensOptionsAvailable": not is_sun
    }
    unisex_products.append(prod)

# 6. Lens Packages (4 core products)
lens_products = [
  {
    "id": "lens-s-world-anti-glare-arc-lens-pair",
    "name": "LENS S WORLD Anti-Glare ARC Lens Pair (Replacement)",
    "type": "lenses",
    "gender": "unisex",
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
    "gallery": [
      "images/blue_cut_screen_lens.jpg"
    ],
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
    "gallery": [
      "images/photochromic_transition_lens.jpg"
    ],
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
    "gallery": [
      "images/progressive_multifocal_lens.jpg"
    ],
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

all_individual_products = womens_products + kids_products + readers_products + sports_products + unisex_products + lens_products

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
new_products_block = generate_products_js(all_individual_products)

updated_data = re.sub(pattern, new_products_block, data_content, flags=re.DOTALL)
with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(updated_data)

# Update src/data/productsData.js
pattern_react = r"export const PRODUCTS_DATA = \[.*?\];"
new_react_block = new_products_block.replace("INITIAL_PRODUCTS", "PRODUCTS_DATA")
updated_react = f"// Comprehensive Product Catalog for LENS S WORLD\n\n{new_react_block}\n"
with open("src/data/productsData.js", "w", encoding="utf-8") as f:
    f.write(updated_react)

print(f"Generated {len(all_individual_products)} individual products successfully!")
print(f" - Womens Eyeglasses: {len(womens_products)}")
print(f" - Kids Eyeglasses: {len(kids_products)}")
print(f" - Reading Glasses: {len(readers_products)}")
print(f" - Sports Sunglasses: {len(sports_products)}")
print(f" - Unisex Eyewear: {len(unisex_products)}")
print(f" - Lens Replacement Packages: {len(lens_products)}")
