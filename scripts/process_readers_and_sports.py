import os
import glob
from PIL import Image, ImageOps, ImageEnhance
import numpy as np

def tight_crop_frame(src_path, dest_path):
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        
        w, h = img.size
        if w > h:
            img = img.rotate(270, expand=True)
            
        w, h = img.size
        
        # Isolate central 65% region
        center_crop = img.crop((int(w * 0.12), int(h * 0.20), int(w * 0.88), int(h * 0.80)))
        cw, ch = center_crop.size
        
        arr = np.array(center_crop.convert("RGB"))
        
        corners = np.concatenate([
            arr[0:15, 0:15].reshape(-1, 3),
            arr[0:15, -15:].reshape(-1, 3),
            arr[-15:, 0:15].reshape(-1, 3),
            arr[-15:, -15:].reshape(-1, 3)
        ])
        bg_color = np.mean(corners, axis=0)
        
        diff = np.sqrt(np.sum((arr - bg_color) ** 2, axis=2))
        mask = diff > 22
        
        row_indices = np.where(np.sum(mask, axis=1) > 20)[0]
        col_indices = np.where(np.sum(mask, axis=0) > 20)[0]
        
        if len(row_indices) > 0 and len(col_indices) > 0:
            ymin, ymax = row_indices[0], row_indices[-1]
            xmin, xmax = col_indices[0], col_indices[-1]
            
            pad_x = int((xmax - xmin) * 0.12)
            pad_y = int((ymax - ymin) * 0.14)
            
            ymin = max(0, ymin - pad_y)
            ymax = min(ch, ymax + pad_y)
            xmin = max(0, xmin - pad_x)
            xmax = min(cw, xmax + pad_x)
            
            frame_cropped = center_crop.crop((xmin, ymin, xmax, ymax))
        else:
            frame_cropped = center_crop
            
        fw, fh = frame_cropped.size
        max_dim = max(fw, fh)
        
        bg_tuple = (int(bg_color[0]), int(bg_color[1]), int(bg_color[2]))
        canvas = Image.new("RGB", (max_dim, max_dim), bg_tuple)
        
        pos_x = (max_dim - fw) // 2
        pos_y = (max_dim - fh) // 2
        canvas.paste(frame_cropped, (pos_x, pos_y))
        
        final_img = canvas.resize((900, 900), Image.Resampling.LANCZOS)
        final_img = ImageEnhance.Sharpness(final_img).enhance(1.3)
        final_img = ImageEnhance.Contrast(final_img).enhance(1.06)
        
        final_img.save(dest_path, "JPEG", quality=93, optimize=True)
        return True
    except Exception as e:
        print(f"Error {src_path}: {e}")
        return False

os.makedirs("images/products/readers", exist_ok=True)
os.makedirs("images/products/sports", exist_ok=True)

# 1. Process Reading Glasses
readers_src = sorted(glob.glob("Reading glasses -1-001/Reading glasses/*.jpg"))
print(f"Processing {len(readers_src)} Reading glasses photos...")
for idx, r in enumerate(readers_src):
    dest = f"images/products/readers/reader_frame_{idx+1}.jpg"
    tight_crop_frame(r, dest)

# 2. Process Sports Sunglasses
sports_src = sorted(glob.glob("Sports sunglasses/Sports sunglasses/*.jpg"))
print(f"Processing {len(sports_src)} Sports sunglasses photos...")
for idx, s in enumerate(sports_src):
    dest = f"images/products/sports/sports_frame_{idx+1}.jpg"
    tight_crop_frame(s, dest)

print("Readers and Sports photos processed successfully!")
