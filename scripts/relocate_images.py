import os
import shutil

categories = [
    {
        'src': 'new images/eyeglass Mens-1-001/Mens',
        'target_dir': 'mens-eyeglasses',
        'prefix': 'mens_eyeglasses',
        'cat_name': "Men's Eyeglasses",
        'type': 'eyeglasses',
        'gender': 'men',
        'cats': ['men', 'eyeglasses']
    },
    {
        'src': 'new images/eyeglass Women-1-001/Women',
        'target_dir': 'womens-eyeglasses',
        'prefix': 'womens_eyeglasses',
        'cat_name': "Women's Eyeglasses",
        'type': 'eyeglasses',
        'gender': 'women',
        'cats': ['women', 'eyeglasses']
    },
    {
        'src': 'new images/eyeglass Unisex-1-001/Unisex',
        'target_dir': 'unisex-eyeglasses',
        'prefix': 'unisex_eyeglasses',
        'cat_name': 'Unisex Eyeglasses',
        'type': 'eyeglasses',
        'gender': 'unisex',
        'cats': ['unisex', 'men', 'women', 'couple', 'eyeglasses']
    },
    {
        'src': 'new images/Kids eye and sunglasses -1-001/Kids eye and sunglasses',
        'target_dir': 'kids-eyewear',
        'prefix': 'kids_eyewear',
        'cat_name': 'Kids Eyewear',
        'type': 'eyeglasses',
        'gender': 'kids',
        'cats': ['kids', 'eyeglasses', 'sunglasses']
    },
    {
        'src': "new images/Men's sunglasses -1-001/Men_s sunglasses",
        'target_dir': 'mens-sunglasses',
        'prefix': 'mens_sunglasses',
        'cat_name': "Men's Sunglasses",
        'type': 'sunglasses',
        'gender': 'men',
        'cats': ['men', 'sunglasses']
    },
    {
        'src': 'new images/Women sunglasses -1-001/Women sunglasses',
        'target_dir': 'womens-sunglasses',
        'prefix': 'womens_sunglasses',
        'cat_name': "Women's Sunglasses",
        'type': 'sunglasses',
        'gender': 'women',
        'cats': ['women', 'sunglasses']
    },
    {
        'src': 'new images/Unisex sunglasses -1-001/Unisex sunglasses',
        'target_dir': 'unisex-sunglasses',
        'prefix': 'unisex_sunglasses',
        'cat_name': 'Unisex Sunglasses',
        'type': 'sunglasses',
        'gender': 'unisex',
        'cats': ['unisex', 'men', 'women', 'couple', 'sunglasses']
    },
    {
        'src': 'new images/Sports sunglasses -1-001/Sports sunglasses',
        'target_dir': 'sports-sunglasses',
        'prefix': 'sports_sunglasses',
        'cat_name': 'Sports Sunglasses',
        'type': 'sunglasses',
        'gender': 'unisex',
        'cats': ['sports', 'men', 'women', 'unisex', 'sunglasses']
    }
]

total_copied = 0
for cat in categories:
    src_dir = cat['src']
    target_pub = os.path.join('public', 'images', 'products', cat['target_dir'])
    target_root = os.path.join('images', 'products', cat['target_dir'])
    os.makedirs(target_pub, exist_ok=True)
    os.makedirs(target_root, exist_ok=True)
    
    files = sorted([f for f in os.listdir(src_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))])
    print(f"Processing {cat['cat_name']}: {len(files)} files")
    
    for idx, f in enumerate(files, 1):
        ext = os.path.splitext(f)[1].lower()
        new_name = f"{cat['prefix']}_{idx:02d}{ext}"
        src_path = os.path.join(src_dir, f)
        dest_pub = os.path.join(target_pub, new_name)
        dest_root = os.path.join(target_root, new_name)
        shutil.copy2(src_path, dest_pub)
        shutil.copy2(src_path, dest_root)
        total_copied += 1

print(f"Successfully copied and renamed {total_copied} images to public and images products directories.")
