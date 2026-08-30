import os
import re

def main():
    target_files = ['src/data/productsData.js', 'src/data/lensesData.js', 'js/data.js']
    
    for filepath in target_files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Fix relative image paths without leading slash
        content = re.sub(r'\"images/', '\"/images/', content)
        content = re.sub(r'\'images/', '\'/images/', content)
        
        # Check if src/data/productsData.js needs exports
        if filepath == 'src/data/productsData.js' and 'export const CATEGORIES' not in content:
            categories_block = '''

export const CATEGORIES = [
  { key: "all", label: "All Eyewear", icon: "Glasses" },
  { key: "eyeglasses", label: "Eyeglasses", desc: "Prescription frames and computer glasses", icon: "Glasses" },
  { key: "sunglasses", label: "Sunglasses", desc: "UV400 Polarized and fashion styles", icon: "Sun" },
  { key: "lenses", label: "Prescription Lenses", desc: "Blue-cut, ARC and Progressives", icon: "Eye" },
  { key: "contact-lenses", label: "Contact Lenses", desc: "Daily and Monthly sterile disposables", icon: "Layers" },
  { key: "reading-glasses", label: "Reading Glasses", desc: "Ready-to-wear power readers", icon: "BookOpen" },
  { key: "accessories", label: "Accessories", desc: "Cleaning kits, cases and cords", icon: "Shield" },
  { key: "offers", label: "Offers & Sale", desc: "Up to 50% Off and BOGO deals", icon: "Tag" }
];

export const GENDER_COLLECTIONS = [
  {
    key: "men",
    label: "Men's Collection",
    tagline: "Bold, sharp & effortless",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=men"
  },
  {
    key: "women",
    label: "Women's Collection",
    tagline: "Elegant, chic & statement",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=women"
  },
  {
    key: "kids",
    label: "Kids' Collection",
    tagline: "Durable, flexible & colorful",
    img: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=kids"
  },
  {
    key: "couple",
    label: "Couple / Unisex",
    tagline: "Matching styles for two",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    link: "/shop?gender=couple"
  }
];

export const COUPONS = {
  "LENS10": { type: "percent", value: 10, label: "10% Discount on Total Order", minOrder: 500 },
  "FLAT200": { type: "flat", value: 200, label: "Flat ₹200 Off", minOrder: 1200 },
  "FREESHIP": { type: "free_shipping", value: 0, label: "Free Express Shipping", minOrder: 0 }
};
'''
            content += categories_block

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

if __name__ == '__main__':
    main()
