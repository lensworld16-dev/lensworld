import os
import glob
import re
from PIL import Image, ImageOps, ImageEnhance

def process_product_image(src_path, dest_path):
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        
        w, h = img.size
        
        # Most of these mobile camera shots were taken with the phone in landscape
        # while holding the glasses vertically, so rotating 270 deg (counter-clockwise 90)
        # aligns the glasses horizontally with top bridge up.
        if w > h:
            img = img.rotate(270, expand=True)
            
        w, h = img.size
        
        # Crop tight around the product
        crop_left = int(w * 0.12)
        crop_top = int(h * 0.14)
        crop_right = int(w * 0.88)
        crop_bottom = int(h * 0.86)
        
        cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))
        cw, ch = cropped.size
        
        # Square canvas matching backdrop
        max_dim = max(cw, ch)
        
        # Sample border color
        edge_pixels = []
        for x in range(0, cw, 25):
            edge_pixels.append(cropped.getpixel((x, 5)))
            edge_pixels.append(cropped.getpixel((x, ch - 6)))
        for y in range(0, ch, 25):
            edge_pixels.append(cropped.getpixel((5, y)))
            edge_pixels.append(cropped.getpixel((cw - 6, y)))
            
        avg_r = int(sum(p[0] for p in edge_pixels) / len(edge_pixels))
        avg_g = int(sum(p[1] for p in edge_pixels) / len(edge_pixels))
        avg_b = int(sum(p[2] for p in edge_pixels) / len(edge_pixels))
        
        bg_canvas = Image.new("RGB", (max_dim, max_dim), (avg_r, avg_g, avg_b))
        offset_x = (max_dim - cw) // 2
        offset_y = (max_dim - ch) // 2
        bg_canvas.paste(cropped, (offset_x, offset_y))
        
        # Resize to 900x900
        final_img = bg_canvas.resize((900, 900), Image.Resampling.LANCZOS)
        
        # Commercial quality enhancements
        final_img = ImageEnhance.Sharpness(final_img).enhance(1.28)
        final_img = ImageEnhance.Contrast(final_img).enhance(1.08)
        
        final_img.save(dest_path, "JPEG", quality=92, optimize=True)
        return True
    except Exception as e:
        print(f"Error {src_path}: {e}")
        return False

# Ensure destination folders exist
os.makedirs("images/products/kids", exist_ok=True)
os.makedirs("images/products/womens", exist_ok=True)

# 1. Process Kids
kids_src = sorted(glob.glob("Kids- eyeglasses/Kids/*.jpg"))
print(f"Processing {len(kids_src)} Kids photos...")
for idx, k in enumerate(kids_src):
    base_name = os.path.basename(k).replace(".jpg", "").replace(".HDR", "")
    dest = f"images/products/kids/kid_frame_{idx+1}.jpg"
    process_product_image(k, dest)

# 2. Process Womens
womens_src = sorted(glob.glob("Womens eyeglasses/Womens/*.jpg"))
print(f"Processing {len(womens_src)} Womens photos...")
for idx, w in enumerate(womens_src):
    dest = f"images/products/womens/women_frame_{idx+1}.jpg"
    process_product_image(w, dest)

print("All product images processed successfully!")
