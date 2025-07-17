from PIL import Image, ImageSequence, ImageDraw, ImageFilter, ImageChops
import os

fileName = '31_inesfujin.webp'
whiteThreshold = 228


SOURCE_FOLDER = "imagesSource"
OUTPUT_FOLDER = "imagesClean"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def remove_edge_white_and_stroke(image, stroke_width=3, stroke_color=(0, 0, 0, 255)):
    image = image.convert("RGBA")
    width, height = image.size
    pixels = image.load()

    # Step 1: Flood-fill to find white edge background
    mask = Image.new("L", image.size, 0)

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
                stack.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])

    for corner in [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]:
        flood_fill(*corner)

    # Step 2: Apply transparency to background
    for x in range(width):
        for y in range(height):
            if mask.getpixel((x, y)) == 255:
                pixels[x, y] = (255, 255, 255, 0)

    # Step 3: Create alpha mask of foreground
    alpha_mask = image.getchannel("A")

    # Step 4: Create stroke by expanding the alpha mask
    expanded = alpha_mask.filter(ImageFilter.MaxFilter(stroke_width * 2 + 1))

    # Step 5: Create stroke mask = expanded - original alpha
    stroke_mask = Image.eval(expanded, lambda px: 255 if px > 0 else 0)
    stroke_only = ImageChops.subtract(stroke_mask, alpha_mask)

    # Step 6: Create stroke image
    stroke_image = Image.new("RGBA", image.size, stroke_color)
    stroke_image.putalpha(stroke_only)

    # Step 7: Composite stroke below original
    final = Image.alpha_composite(stroke_image, image)

    return final


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
    output_static_filename = f"{base}_static.png"
    output_static_path = os.path.join(OUTPUT_FOLDER, output_static_filename)

    print(f"Processing {filename}...")

    try:
        with Image.open(input_path) as im:
            frames = []

            for frame in ImageSequence.Iterator(im):
                cleaned = remove_edge_white_and_stroke(frame.copy(), 3, (255,255,255,255))
                frames.append(cleaned)

            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                loop=0,
                duration=im.info.get("duration", 100)
            )

            # Save static first frame
            frames[2].save(output_static_path)

        print(f"✅ Saved: {output_filename}")
    except Exception as e:
        print(f"❌ Failed: {filename} - {e}")

