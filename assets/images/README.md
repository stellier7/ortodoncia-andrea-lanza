# Images

Drop client media here and reference paths from `js/config.js`.

## Template demo files (included)

These are the only images shipped with the template. Replace them per client.

| File | Used for |
| --- | --- |
| `hero.jpg` | Hero background (`branding.heroImageUrl`) |
| `dentist.jpg` | Dentist photo (`dentists[].photoUrl`) |
| `gallery/smile-01.jpg` … `smile-05.jpg` | Smile gallery (`gallery[]`) |
| `financing/financing-01.svg` | First financing image (`financingImages[0]`) |
| `financing/financing-02.svg` | Second financing image (`financingImages[1]`) |

## Per-client layout

```
assets/images/
  hero.jpg
  dentist.jpg          (or dentist-name.jpg)
  gallery/
    smile-01.jpg
    smile-02.jpg
    …
  financing/
    financing-01.jpg     (replace SVG placeholders if needed)
    financing-02.jpg
```

Optional: add `logo.png` / `logo.svg` and set `branding.logoUrl` in config.
