import os
import glob
from PIL import Image

def create_preview_html():
    folders = [
        ("Kids", "images/products/kids/kid_frame_*.jpg"),
        ("Womens", "images/products/womens/women_frame_*.jpg"),
        ("Readers", "images/products/readers/reader_frame_*.jpg"),
        ("Sports", "images/products/sports/sports_frame_*.jpg"),
        ("Unisex", "images/products/unisex/unisex_frame_*.jpg"),
    ]
    
    html = ['<!DOCTYPE html><html><head><style>body{font-family:sans-serif; background:#1e293b; color:#fff; padding:20px;} .grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:15px; margin-bottom:40px;} .card{background:#334155; padding:8px; border-radius:8px; text-align:center;} img{width:100%; border-radius:4px; aspect-ratio:1/1; object-fit:contain; background:#fff;} .btn{background:#3b82f6; color:#fff; border:none; padding:4px 8px; border-radius:4px; margin-top:5px; cursor:pointer; font-size:12px;}</style></head><body>']
    
    for title, pattern in folders:
        files = sorted(glob.glob(pattern), key=lambda x: int(os.path.basename(x).split('_')[-1].split('.')[0]) if os.path.basename(x).split('_')[-1].split('.')[0].isdigit() else 0)
        html.append(f'<h2>{title} ({len(files)} items)</h2><div class="grid">')
        for f in files:
            rel = f.replace('\\', '/')
            html.append(f'''
            <div class="card">
                <img src="/{rel}" id="img_{os.path.basename(f)}" />
                <div style="font-size:11px; margin-top:4px;">{os.path.basename(f)}</div>
            </div>
            ''')
        html.append('</div>')
        
    html.append('</body></html>')
    
    with open("dist/image_review.html", "w", encoding="utf-8") as f:
        f.write("\n".join(html))
    with open("image_review.html", "w", encoding="utf-8") as f:
        f.write("\n".join(html))
    print("Preview HTML generated!")

create_preview_html()
