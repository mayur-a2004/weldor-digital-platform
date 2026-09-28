import fitz
import os

os.makedirs('public/extracted_images', exist_ok=True)
doc = fitz.open('E:\\Weldor Welding Catalog.pdf')

img_count = 0
for page_idx, page in enumerate(doc):
    image_list = page.get_images(full=True)
    print(f"Page {page_idx+1} has {len(image_list)} embedded images")
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image['image']
        image_ext = base_image['ext']
        w = base_image['width']
        h = base_image['height']
        img_filename = f"public/extracted_images/p{page_idx+1}_img{img_idx+1}_{w}x{h}.{image_ext}"
        with open(img_filename, 'wb') as f:
            f.write(image_bytes)
        img_count += 1
        print(f"  -> Saved {img_filename} ({w}x{h})")

print(f"Total extracted images: {img_count}")
