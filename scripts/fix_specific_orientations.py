import os
from PIL import Image

def fix_images():
    # Rotate 180° to ensure perfect orientation
    for path in [
        "images/products/womens/women_frame_38.jpg",
        "images/products/unisex/unisex_frame_28.jpg",
        "images/products/unisex/unisex_frame_29.jpg"
    ]:
        if os.path.exists(path):
            im = Image.open(path)
            im.rotate(180).save(path, quality=95)
            print(f"Fixed: {path}")

fix_images()
