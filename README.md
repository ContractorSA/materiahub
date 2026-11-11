# Materia Hub homepage

Responsive one-page HTML/CSS/JS website adapted from the supplied Materia Hub company presentation.

## Files
- `index.html`
- `styles.css`
- `script.js`

## Replace image placeholders
Search `index.html` for `data-image=`. Replace a placeholder block such as:

```html
<div class="hero-media media-placeholder" data-image="HERO IMAGE URL"></div>
```

with:

```html
<div class="hero-media" style="background-image:url('YOUR_RAW_GITHUB_IMAGE_URL')"></div>
```

You can keep `data-parallax` where it exists:

```html
<div class="hero-media" data-parallax style="background-image:url('YOUR_URL')"></div>
```

## Logo
The logo in the header is a CSS placeholder. Replace the `.brand-mark` element with an `<img>` when the final SVG/PNG logo is available.

## Included interactions
- sticky transparent-to-dark header
- full-screen mobile menu
- fade/slide reveals using IntersectionObserver
- parallax hero and CTA backgrounds
- animated counters
- accordion support section
- reduced-motion accessibility support

## Deploy on GitHub Pages
Upload all three files to the repository root and enable GitHub Pages from the repository settings.
