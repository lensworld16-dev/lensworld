import os
import glob
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import numpy as np

def auto_process_glasses(src_path, dest_path):
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        
        # In these photos, the glasses are shot standing vertically along the image's height
        # Rotate 90 degrees clockwise (or 270) to place them horizontally
        # If width > height, rotating by 90 makes height > width, so we rotate 270 to orient correctly
        w, h = img.size
        if w > h:
            # Landscape photo with vertical glasses -> rotate 270 deg (90 counter-clockwise)
            img = img.rotate(270, expand=True)
            
        w, h = img.size
        
        # In the rotated image (now width is wider than height or vertical orientation is corrected):
        # Detect bounding box based on color variance from background edges
        # We sample 4 borders (top 5%, bottom 5%, left 5%, right 5%)
        # Crop tight around the product (center 70% width, 65% height)
        crop_left = int(w * 0.15)
        crop_top = int(h * 0.15)
        crop_right = int(w * 0.85)
        crop_bottom = int(h * 0.85)
        
        cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))
        cw, ch = cropped.size
        
        # Create a clean square image
        max_dim = max(cw, ch)
        
        # Sample border color to create a seamless natural backdrop
        edge_pixels = []
        for x in range(0, cw, 20):
            edge_pixels.append(cropped.getpixel((x, 5)))
            edge_pixels.append(cropped.getpixel((x, ch - 6)))
        for y in range(0, ch, 20):
            edge_pixels.append(cropped.getpixel((5, y)))
            edge_pixels.append(cropped.getpixel((cw - 6, y)))
            
        avg_r = int(sum(p[0] for p in edge_pixels) / len(edge_pixels))
        avg_g = int(sum(p[1] for p in edge_pixels) / len(edge_pixels))
        avg_b = int(sum(p[2] for p in edge_pixels) / len(edge_pixels))
        
        bg_canvas = Image.new("RGB", (max_dim, max_dim), (avg_r, avg_g, avg_b))
        offset_x = (max_dim - cw) // 2
        offset_y = (max_dim - ch) // 2
        bg_canvas.paste(cropped, (offset_x, offset_y))
        
        # High quality resize
        final_img = bg_canvas.resize((900, 900), Image.Resampling.LANCZOS)
        
        # Sharpen & Enhance
        final_img = ImageEnhance.Sharpness(final_img).enhance(1.25)
        final_img = ImageEnhance.Contrast(final_img).enhance(1.06)
        
        final_img.save(dest_path, "JPEG", quality=92, optimize=True)
        return True
    except Exception as e:
        print(f"Error {src_path}: {e}")
        return False

# Test on 2 sample images
os.makedirs("images/products/kids", exist_ok=True)
os.makedirs("images/products/womens", exist_ok=True)

auto_process_glasses("Kids- eyeglasses/Kids/IMG_20260824_124655979_HDR.jpg", "images/products/kids/test_auto_kid1.jpg")
auto_process_glasses("Womens eyeglasses/Womens/IMG_20260823_203431496_HDR.jpg", "images/products/womens/test_auto_women1.jpg")
print("Auto process test done!")
