import os
import shutil

# Old root raw folders to remove
old_root_dirs = [
    'Kids- eyeglasses',
    'Reading glasses -1-001',
    'Sports sunglasses',
    'Unisex -1-001',
    'Womens eyeglasses'
]

for d in old_root_dirs:
    if os.path.exists(d):
        shutil.rmtree(d)
        print(f"Removed old root directory: {d}")
    else:
        print(f"Not found / already removed: {d}")

# Old product folders
old_prod_dirs = ['kids', 'readers', 'sports', 'unisex', 'womens']

for base in [os.path.join('public', 'images', 'products'), os.path.join('images', 'products')]:
    for old_sub in old_prod_dirs:
        target = os.path.join(base, old_sub)
        if os.path.exists(target):
            shutil.rmtree(target)
            print(f"Removed old product folder: {target}")

# Verification of preserved lens and contact lens files
preserved_files = [
    'public/images/anti_glare_arc_lens.jpg',
    'public/images/blue_cut_screen_lens.jpg',
    'public/images/photochromic_transition_lens.jpg',
    'public/images/progressive_multifocal_lens.jpg',
    'public/images/progressive_multifocal_lens.png',
    'public/images/contact_lens_circle.jpg',
    'public/images/lenss_world_logo_with_name-removebg-preview.png'
]

print("\n--- Preserved Critical Assets Check ---")
for p in preserved_files:
    exists = os.path.exists(p)
    print(f"{p}: {'EXISTS (SAFE)' if exists else 'MISSING (ALERT!)'}")
