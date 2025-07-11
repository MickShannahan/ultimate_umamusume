from PIL import Image, ImageSequence

fileName = '31_inesfujin.webp'
whiteThreshold = 230

import os
from PIL import Image, ImageSequence, ImageDraw

SOURCE_FOLDER = "imagesSources"
OUTPUT_FOLDER = "imagesClean"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def remove_edge_white(image):
    image = image.convert("RGBA")
    width, height = image.size
    pixels = image.load()

    mask = Image.new("L", image.size, 0)
    mask_draw = ImageDraw.Draw(mask)

    def flood_fill(x, y):
        stack = [(x, y)]
        visited = set()

        while stack:
            x, y = stack.pop()
            if (x, y) in visited:
                continue
            visited.add((x, y))

            if x < 0 or x >= width or y < 0 or y >= height:
                continue

            r, g, b, a = pixels[x, y]
            if r > whiteThreshold and g > whiteThreshold and b > whiteThreshold:
                mask.putpixel((x, y), 255)
                stack.extend([
                    (x+1, y), (x-1, y),
                    (x, y+1), (x, y-1)
                ])

    for corner in [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]:
        flood_fill(*corner)

    for x in range(width):
        for y in range(height):
            if mask.getpixel((x, y)) == 255:
                pixels[x, y] = (255, 255, 255, 0)

    return image

# ✅ Main loop
for filename in os.listdir(SOURCE_FOLDER):
    if not filename.lower().endswith(".webp"):
        continue

    input_path = os.path.join(SOURCE_FOLDER, filename)
    base, ext = os.path.splitext(filename)
    output_filename = f"{base}_clean{ext}"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    print(f"Processing {filename}...")

    try:
        with Image.open(input_path) as im:
            frames = []

            for frame in ImageSequence.Iterator(im):
                cleaned = remove_edge_white(frame.copy())
                frames.append(cleaned)

            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                loop=0,
                duration=im.info.get("duration", 100)
            )

        print(f"✅ Saved: {output_filename}")
    except Exception as e:
        print(f"❌ Failed: {filename} - {e}")

