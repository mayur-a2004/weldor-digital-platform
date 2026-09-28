import asyncio
import os
import winsdk.windows.storage as storage
import winsdk.windows.graphics.imaging as imaging
import winsdk.windows.media.ocr as ocr
import winsdk.windows.globalization as glob

async def ocr_page(img_path, engine):
    file = await storage.StorageFile.get_file_from_path_async(os.path.abspath(img_path))
    stream = await file.open_async(storage.FileAccessMode.READ)
    decoder = await imaging.BitmapDecoder.create_async(stream)
    bitmap = await decoder.get_software_bitmap_async()
    result = await engine.recognize_async(bitmap)
    return result.text

async def main():
    os.makedirs('scripts/ocr_results', exist_ok=True)
    
    # Create engine
    lang = glob.Language("en-US")
    engine = ocr.OcrEngine.try_create_from_language(lang)
    if not engine:
        engine = ocr.OcrEngine.try_create_from_user_profile_languages()
        
    print(f"OCR Engine Language: {engine.recognizer_language.language_tag}")
    
    all_pages_text = {}
    for page_num in range(1, 13):
        img_path = f"public/catalog_pages/page_{page_num}.png"
        if not os.path.exists(img_path):
            continue
        text = await ocr_page(img_path, engine)
        all_pages_text[page_num] = text
        out_file = f"scripts/ocr_results/page_{page_num}.txt"
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"=== PAGE {page_num} ({len(text)} chars) ===")
        print(text[:300] if len(text) > 300 else text)
        print("-" * 50)
        
    with open("scripts/ocr_results/all_catalog_text.txt", "w", encoding="utf-8") as f:
        for p, t in all_pages_text.items():
            f.write(f"\n\n================ PAGE {p} ================\n\n")
            f.write(t)

if __name__ == "__main__":
    asyncio.run(main())
