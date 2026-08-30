import os
import glob
from PIL import Image, ImageOps, ImageEnhance
import numpy as np

def smart_center_crop_glasses(src_path, dest_path):
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        
        w, h = img.size
        if w > h:
            img = img.rotate(270, expand=True)
            
        w, h = img.size
        arr = np.array(img.convert("RGB"))
        
        # Sample corner background color
        corner_pixels = np.concatenate([
            arr[0:20, 0:20].reshape(-1, 3),
            arr[0:20, -20:].reshape(-1, 3),
            arr[-20:, 0:20].reshape(-1, 3),
            arr[-20:, -20:].reshape(-1, 3)
        ])
        bg_mean = np.mean(corner_pixels, axis=0)
        
        # Calculate color difference map
        diff = np.sqrt(np.sum((arr - bg_mean) ** 2, axis=2))
        
        # Threshold to detect frame / object (difference > 28)
        mask = diff > 28
        
        # Find bounding box rows and cols with object pixels
        row_sums = np.sum(mask, axis=1)
        col_sums = np.sum(mask, axis=0)
        
        # Filter noise by requiring at least 25 foreground pixels in a row/col
        min_pixels = 25
        valid_rows = np.where(row_sums > min_pixels)[0]
        valid_cols = np.where(col_sums > min_pixels)[0]
        
        if len(valid_rows) > 0 and len(valid_cols) > 0:
            top = max(0, valid_rows[0] - int(h * 0.04))
            bottom = min(h, valid_rows[-1] + int(h * 0.04))
            left = max(0, valid_cols[0] - int(w * 0.04))
            right = min(w, valid_cols[-1] + int(w * 0.04))
        else:
            left, top, right, bottom = int(w*0.1), int(h*0.1), int(w*0.9), int(h*0.9)
            
        cropped = img.crop((left, top, right, bottom))
        cw, ch = cropped.size
        
        # Add 12% padding around the bounding box so the frame breathes comfortably
        max_dim = int(max(cw, ch) * 1.15)
        
        bg_tuple = (int(bg_mean[0]), int(bg_mean[1]), int(bg_mean[2]))
        bg_canvas = Image.new("RGB", (max_dim, max_dim), bg_tuple)
        
        pos_x = (max_dim - cw) // 2
        pos_y = (max_dim - ch) // 2
        bg_canvas.paste(cropped, (pos_x, pos_y))
        
        final_img = bg_canvas.resize((900, 900), Image.Resampling.LANCZOS)
        
        # Enhance for crisp optical clarity
        final_img = ImageEnhance.Sharpness(final_img).enhance(1.3)
        final_img = ImageEnhance.Contrast(final_img).enhance(1.08)
        
        final_img.save(dest_path, "JPEG", quality=93, optimize=True)
        return True
    except Exception as e:
        print(f"Error {src_path}: {e}")
        return False

# Re-process all Kids and Womens with smart center crop
kids_src = sorted(glob.glob("Kids- eyeglasses/Kids/*.jpg"))
print(f"Smart centering {len(kids_src)} Kids photos...")
for idx, k in enumerate(kids_src):
    dest = f"images/products/kids/kid_frame_{idx+1}.jpg"
    smart_center_crop_glasses(k, dest)

womens_src = sorted(glob.glob("Womens eyeglasses/Womens/*.jpg"))
print(f"Smart centering {len(womens_src)} Womens photos...")
for idx, w in enumerate(womens_src):
    dest = f"images/products/womens/women_frame_{idx+1}.jpg"
    smart_center_crop_glasses(w, dest)

print("Smart centering completed for all 55 photos!")
