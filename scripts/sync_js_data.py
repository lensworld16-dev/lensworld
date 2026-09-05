import json

# Read products from src/data/productsData.js
with open('src/data/productsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = 'export const PRODUCTS_DATA = ['
end_marker = 'export const CATEGORIES = ['

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)
products_json = content[start_idx + len('export const PRODUCTS_DATA = '):end_idx].strip()
if products_json.endswith(';'):
    products_json = products_json[:-1].strip()

products_list = json.loads(products_json)
print(f"Loaded {len(products_list)} products from src/data/productsData.js")

# Read js/data.js
with open('js/data.js', 'r', encoding='utf-8') as f:
    js_data = f.read()

js_start = js_data.find('export const INITIAL_PRODUCTS = [')
js_end = js_data.find('export const COUPONS = {', js_start)

if js_start == -1 or js_end == -1:
    raise Exception(f"Markers not found in js/data.js: js_start={js_start}, js_end={js_end}")

formatted_products = json.dumps(products_list, indent=2)

new_js_data = js_data[:js_start] + f"export const INITIAL_PRODUCTS = {formatted_products};\n\n" + js_data[js_end:]

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(new_js_data)

print("Updated js/data.js with new 187 products successfully!")
