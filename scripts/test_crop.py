import os
import glob
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import numpy as np

def crop_and_rotate_glasses(src_path, dest_path, angle=90):
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        
        # Rotate glasses so they sit horizontally (front facing upright)
        if angle != 0:
            img = img.rotate(angle, expand=True)
            
        w, h = img.size
        
        # Focus tightly on the center where the glasses are
        # In a 3072x4096 (rotated to 4096x3072):
        # crop margins: left/right 10%, top/bottom 15%
        left = int(w * 0.12)
        top = int(h * 0.18)
        right = int(w * 0.88)
        bottom = int(h * 0.82)
        
        cropped = img.crop((left, top, right, bottom))
        cw, ch = cropped.size
        
        # Pad to make it a perfect square without distortion
        max_side = max(cw, ch)
        
        # Sample border color from corners to blend naturally or use pure white/soft background
        corner_pixels = [
            cropped.getpixel((5, 5)),
            cropped.getpixel((cw - 6, 5)),
            cropped.getpixel((5, ch - 6)),
            cropped.getpixel((cw - 6, ch - 6))
        ]
        # Average background color
        avg_r = int(sum(p[0] for p in corner_pixels) / 4)
        avg_g = int(sum(p[1] for p in corner_pixels) / 4)
        avg_b = int(sum(p[2] for p in corner_pixels) / 4)
        bg_color = (avg_r, avg_g, avg_b)
        
        square_canvas = Image.new("RGB", (max_side, max_side), bg_color)
        pos_x = (max_side - cw) // 2
        pos_y = (max_side - ch) // 2
        square_canvas.paste(cropped, (pos_x, pos_y))
        
        # Resize to standard e-commerce 900x900
        final_img = square_canvas.resize((900, 900), Image.Resampling.LANCZOS)
        
        # Subtle contrast and sharpness enhancement for commercial product look
        enhancer = ImageEnhance.Sharpness(final_img)
        final_img = enhancer.enhance(1.2)
        
        enhancer = ImageEnhance.Contrast(final_img)
        final_img = enhancer.enhance(1.08)
        
        final_img.save(dest_path, "JPEG", quality=92, optimize=True)
        return True
    except Exception as e:
        print(f"Error {src_path}: {e}")
        return False

# Test on 3 kids and 3 womens
os.makedirs("images/products/kids", exist_ok=True)
os.makedirs("images/products/womens", exist_ok=True)

kids = sorted(glob.glob("Kids- eyeglasses/Kids/*.jpg"))
for idx, k in enumerate(kids[:4]):
    crop_and_rotate_glasses(k, f"images/products/kids/test_kid_{idx+1}.jpg", angle=90)

womens = sorted(glob.glob("Womens eyeglasses/Womens/*.jpg"))
for idx, w in enumerate(womens[:4]):
    crop_and_rotate_glasses(w, f"images/products/womens/test_women_{idx+1}.jpg", angle=90)

print("Test processing completed!")
