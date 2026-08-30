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
        
        # Focus on the middle region of the photo (where the glasses lie)
        # We start by isolating the central 60% of the image to avoid background room/floor/chairs
        center_crop = img.crop((int(w * 0.15), int(h * 0.22), int(w * 0.85), int(h * 0.78)))
        cw, ch = center_crop.size
        
        arr = np.array(center_crop.convert("RGB"))
        
        # Calculate color difference from the mat/cloth background (sample 4 corners of center crop)
        corners = np.concatenate([
            arr[0:15, 0:15].reshape(-1, 3),
            arr[0:15, -15:].reshape(-1, 3),
            arr[-15:, 0:15].reshape(-1, 3),
            arr[-15:, -15:].reshape(-1, 3)
        ])
        bg_color = np.mean(corners, axis=0)
        
        diff = np.sqrt(np.sum((arr - bg_color) ** 2, axis=2))
        mask = diff > 22
        
        # Find tight bounds of the frame
        row_indices = np.where(np.sum(mask, axis=1) > 20)[0]
        col_indices = np.where(np.sum(mask, axis=0) > 20)[0]
        
        if len(row_indices) > 0 and len(col_indices) > 0:
            ymin, ymax = row_indices[0], row_indices[-1]
            xmin, xmax = col_indices[0], col_indices[-1]
            
            # Add comfortable 12% padding around the frame
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

# Process all Kids
kids_src = sorted(glob.glob("Kids- eyeglasses/Kids/*.jpg"))
print(f"Tight cropping {len(kids_src)} Kids photos...")
for idx, k in enumerate(kids_src):
    dest = f"images/products/kids/kid_frame_{idx+1}.jpg"
    tight_crop_frame(k, dest)

# Process all Womens
womens_src = sorted(glob.glob("Womens eyeglasses/Womens/*.jpg"))
print(f"Tight cropping {len(womens_src)} Womens photos...")
for idx, w in enumerate(womens_src):
    dest = f"images/products/womens/women_frame_{idx+1}.jpg"
    tight_crop_frame(w, dest)

print("Tight frame cropping complete!")
