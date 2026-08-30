import os
import glob
import numpy as np
from PIL import Image

def analyze_all():
    folders = [
        ("womens", "images/products/womens/women_frame_*.jpg"),
        ("kids", "images/products/kids/kid_frame_*.jpg"),
        ("readers", "images/products/readers/reader_frame_*.jpg"),
        ("sports", "images/products/sports/sports_frame_*.jpg"),
        ("unisex", "images/products/unisex/unisex_frame_*.jpg"),
    ]
    
    for cat, pattern in folders:
        files = sorted(glob.glob(pattern), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0]))
        print(f"\n=== {cat.upper()} ({len(files)}) ===")
        for f in files:
            img = Image.open(f)
            w, h = img.size
            # Sample center lens
            crop = img.crop((int(w*0.25), int(h*0.35), int(w*0.75), int(h*0.65)))
            arr = np.array(crop)
            # calculate saturation and lightness
            # convert to HSV
            hsv = crop.convert('HSV')
            hsv_arr = np.array(hsv)
            sat = np.mean(hsv_arr[:, :, 1])
            val = np.mean(hsv_arr[:, :, 2])
            print(f"{os.path.basename(f)}: Value(Brightness)={val:.1f}, Sat={sat:.1f}")

analyze_all()
