import os
import glob
from PIL import Image, ImageOps, ImageEnhance

os.makedirs("images/products/womens", exist_ok=True)
os.makedirs("images/products/kids", exist_ok=True)

def process_image(src_path, dest_path, rotate_angle=270):
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        
        # If image width > height and glasses are vertical, rotate by angle
        if rotate_angle != 0:
            img = img.rotate(rotate_angle, expand=True)
            
        # Get bounding box or crop center
        w, h = img.size
        # The glasses are usually centrally placed, crop central 75% region
        crop_box = (int(w * 0.12), int(h * 0.12), int(w * 0.88), int(h * 0.88))
        img_cropped = img.crop(crop_box)
        
        # Fit into a 800x800 square
        cw, ch = img_cropped.size
        max_dim = max(cw, ch)
        
        # Create high quality clean square background using average border color
        # or white
        square = Image.new("RGB", (max_dim, max_dim), (255, 255, 255))
        offset_x = (max_dim - cw) // 2
        offset_y = (max_dim - ch) // 2
        square.paste(img_cropped, (offset_x, offset_y))
        
        # Resize to standard e-commerce 800x800
        square = square.resize((800, 800), Image.Resampling.LANCZOS)
        
        # Enhance slightly for crisp optical clarity
        enhancer = ImageEnhance.Sharpness(square)
        square = enhancer.enhance(1.15)
        
        square.save(dest_path, "JPEG", quality=90, optimize=True)
        print(f"Saved: {dest_path}")
        return True
    except Exception as e:
        print(f"Error processing {src_path}: {e}")
        return False

print("Script template ready")
