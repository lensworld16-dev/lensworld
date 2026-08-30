import glob
import os
from PIL import Image

# Let's inspect all files and flip any known inverted images
flips = {
    "unisex": [21, 23, 24, 25, 28, 29],
    "womens": [31, 38],
}

# Also let's check women frames 34..44
for w_idx in [34, 35, 36, 37, 39, 40, 41, 42, 43, 44]:
    f = f"images/products/womens/women_frame_{w_idx}.jpg"
    if os.path.exists(f):
        im = Image.open(f)
        print(f"Checking {f}")

