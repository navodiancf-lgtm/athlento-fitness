# Athlento WhatsApp stickers

| File | Sticker |
| --- | --- |
| `01-athlento-icon.webp` | Athlento "O" icon |
| `02-athlento-logo.webp` | Full ATHLENTO wordmark |
| `03-lets-train.webp` | Icon + "LET'S TRAIN!" |
| `04-no-excuses.webp` | Icon + "NO EXCUSES" |
| `tray.png` | 96x96 pack tray icon |

All stickers are 512x512 transparent WebP files under 100 KB, with a white die-cut outline, as WhatsApp requires.

Regenerate them with `python3 scripts/make-whatsapp-stickers.py` (needs Pillow).

## Adding them to WhatsApp

- **Quickest:** use a sticker maker app such as "Sticker Maker" (Android or iOS), make a new pack, import the `.webp` files and set `tray.png` as the tray icon. A pack needs at least 3 stickers.
- **Single sticker:** on WhatsApp Web or Desktop, open the sticker panel, choose **Create**, then upload one of the files.
