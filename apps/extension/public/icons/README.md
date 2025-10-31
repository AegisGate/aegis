# Extension Icons

The extension requires three icon sizes:
- `icon-16.png` - 16x16 pixels
- `icon-48.png` - 48x48 pixels  
- `icon-128.png` - 128x128 pixels

## Creating Icons

You can:
1. Use the provided SVG files and convert them to PNG
2. Create custom icons with your preferred design
3. Use online tools like favicon.io or Figma

## Quick Generation

Using ImageMagick:
```bash
magick convert icon-16.svg -resize 16x16 icon-16.png
magick convert icon-48.svg -resize 48x48 icon-48.png
magick convert icon-128.svg -resize 128x128 icon-128.png
```

Or use: https://favicon.io/favicon-converter/


