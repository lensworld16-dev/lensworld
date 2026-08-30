import glob
import os
from PIL import Image

def get_all_images():
    categories = {
        "kids": sorted(glob.glob("images/products/kids/kid_frame_*.jpg"), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0])),
        "womens": sorted(glob.glob("images/products/womens/women_frame_*.jpg"), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0])),
        "readers": sorted(glob.glob("images/products/readers/reader_frame_*.jpg"), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0])),
        "sports": sorted(glob.glob("images/products/sports/sports_frame_*.jpg"), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0])),
        "unisex": sorted(glob.glob("images/products/unisex/unisex_frame_*.jpg"), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0])),
    }
    return categories

print("Checking images...")
cats = get_all_images()
for cat, imgs in cats.items():
    print(f"{cat}: {len(imgs)} images")
