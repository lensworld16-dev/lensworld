import json
import hashlib
import os

def get_hash(img_path):
    if not img_path or not img_path.startswith('/'):
        return img_path
    local_path = os.path.join('public', img_path.lstrip('/'))
    if os.path.exists(local_path):
        with open(local_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    return img_path

# 1. Update src/data/productsData.js
with open('src/data/productsData.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const PRODUCTS_DATA = [')
end = text.find('export const CATEGORIES = [', start)
prods = json.loads(text[start + len('export const PRODUCTS_DATA = '):end].strip().rstrip(';'))

for p in prods:
    p['imgHash'] = get_hash(p.get('img'))

formatted_prods = json.dumps(prods, indent=2)
new_content = text[:start] + f"export const PRODUCTS_DATA = {formatted_prods};\n\n" + text[end:]

with open('src/data/productsData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Added imgHash to src/data/productsData.js!")

# 2. Update js/data.js
with open('js/data.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

js_start = js_text.find('export const INITIAL_PRODUCTS = [')
js_end = js_text.find('export const COUPONS = {', js_start)

new_js_content = js_text[:js_start] + f"export const INITIAL_PRODUCTS = {formatted_prods};\n\n" + js_text[js_end:]

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(new_js_content)

print("Added imgHash to js/data.js!")
