"""Generate a WhatsApp sticker pack from the Athlento brand assets.

WhatsApp requirements (static stickers):
  - 512x512 WebP, transparent background, under 100 KB each
  - ~16px margin around the artwork
  - 96x96 PNG tray icon, under 50 KB

Usage: python3 scripts/make-whatsapp-stickers.py
Output: public/stickers/whatsapp/
"""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT = PUBLIC / "stickers" / "whatsapp"

SIZE = 512
SCALE = 2  # render at 2x, then downsample for smooth edges
MARGIN = 16
OUTLINE = 14  # white die-cut border width (at 1x)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def fit(img: Image.Image, box: int) -> Image.Image:
    img = img.crop(img.getchannel("A").getbbox())
    ratio = min(box / img.width, box / img.height)
    return img.resize((round(img.width * ratio), round(img.height * ratio)), Image.LANCZOS)


def die_cut(art: Image.Image) -> Image.Image:
    """Center art on a transparent canvas with a white sticker outline and soft shadow."""
    big = SIZE * SCALE
    pad = (MARGIN + OUTLINE) * SCALE
    art = fit(art, big - 2 * pad)

    canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    pos = ((big - art.width) // 2, (big - art.height) // 2)
    layer = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    layer.paste(art, pos, art)

    # Grow the alpha mask into a rounded outline: blur, then threshold.
    alpha = layer.getchannel("A").point(lambda a: 255 if a > 40 else 0)
    r = OUTLINE * SCALE
    grown = alpha.filter(ImageFilter.GaussianBlur(r * 0.75)).point(lambda a: 255 if a > 8 else 0)
    # Fill enclosed holes (e.g. inside the "O") so the art stays readable on dark chats.
    ImageDraw.floodfill(grown, (0, 0), 128)
    grown = grown.point(lambda a: 0 if a == 128 else 255)
    grown = grown.filter(ImageFilter.GaussianBlur(1.5))

    shadow = grown.filter(ImageFilter.GaussianBlur(6 * SCALE)).point(lambda a: a * 0.35)
    shadow = ImageChops.offset(shadow, 0, 4 * SCALE)
    canvas.paste((0, 0, 0, 255), (0, 0), shadow)
    canvas.paste((255, 255, 255, 255), (0, 0), grown)
    canvas.alpha_composite(layer)
    return canvas.resize((SIZE, SIZE), Image.LANCZOS)


def text_art(icon: Image.Image, lines: list[str]) -> Image.Image:
    """Stack the Athlento icon above bold caption text."""
    w = 1000
    icon = fit(icon, 560)
    font = ImageFont.truetype(FONT, 170)
    draw = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    boxes = [draw.textbbox((0, 0), line, font=font) for line in lines]
    text_h = sum(b[3] - b[1] for b in boxes) + 30 * (len(lines) - 1)
    width = max(w, *(b[2] - b[0] for b in boxes))
    img = Image.new("RGBA", (width, icon.height + 50 + text_h), (0, 0, 0, 0))
    img.paste(icon, ((width - icon.width) // 2, 0), icon)
    d = ImageDraw.Draw(img)
    y = icon.height + 50
    for line, b in zip(lines, boxes):
        d.text(((width - (b[2] - b[0])) // 2 - b[0], y - b[1]), line, font=font, fill=(0, 0, 0, 255))
        y += b[3] - b[1] + 30
    return img


def save_webp(img: Image.Image, name: str) -> None:
    path = OUT / name
    for quality in (90, 80, 70, 60):
        img.save(path, "WEBP", quality=quality, method=6)
        if path.stat().st_size < 100 * 1024:
            break
    print(f"{path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    icon = Image.open(PUBLIC / "icons.png").convert("RGBA")
    logo = Image.open(PUBLIC / "logo.png").convert("RGBA")

    save_webp(die_cut(icon), "01-athlento-icon.webp")
    save_webp(die_cut(logo), "02-athlento-logo.webp")
    save_webp(die_cut(text_art(icon, ["LET'S", "TRAIN!"])), "03-lets-train.webp")
    save_webp(die_cut(text_art(icon, ["NO", "EXCUSES"])), "04-no-excuses.webp")

    tray = die_cut(icon).resize((96, 96), Image.LANCZOS)
    tray.save(OUT / "tray.png", optimize=True)
    print(f"{(OUT / 'tray.png').relative_to(ROOT)}  {(OUT / 'tray.png').stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
