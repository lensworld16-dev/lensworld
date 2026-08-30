import os
import glob
import numpy as np
from PIL import Image

def analyze_unisex():
    files = sorted(glob.glob("images/products/unisex/unisex_frame_*.jpg"), 
                   key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0]))
    
    print(f"Total unisex files: {len(files)}")
    for f in files:
        img = Image.open(f)
        w, h = img.size
        # Sample center lens area
        center_crop = img.crop((int(w*0.3), int(h*0.35), int(w*0.7), int(h*0.65)))
        arr = np.array(center_crop)
        gray = np.mean(arr, axis=2)
        mean_brightness = np.mean(gray)
        top_half = gray[:gray.shape[0]//2, :]
        bot_half = gray[gray.shape[0]//2:, :]
        
        print(f"{os.path.basename(f)}: brightness={mean_brightness:.1f} (top={np.mean(top_half):.1f}, bot={np.mean(bot_half):.1f})")

analyze_unisex()
