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
        
        center_crop = img.crop((int(w * 0.12), int(h * 0.18), int(w * 0.88), int(h * 0.82)))
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

os.makedirs("images/products/unisex", exist_ok=True)

unisex_src = sorted(glob.glob("Unisex -1-001/Unisex/*.jpg"))
print(f"Processing {len(unisex_src)} Unisex photos...")
for idx, u in enumerate(unisex_src):
    dest = f"images/products/unisex/unisex_frame_{idx+1}.jpg"
    tight_crop_frame(u, dest)

print("Unisex photos processed successfully!")
