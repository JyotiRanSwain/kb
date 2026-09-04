# Kaberi Beverages Pvt. Ltd. — Website

A premium, animated, mobile-responsive corporate website for Kaberi Beverages
Pvt. Ltd. (packaged drinking water, Kolkata, West Bengal), built as static
HTML/CSS/JS — no build step required.

## Structure

```
kaberi/
├── index.html                Home
├── about.html                About Us
├── products.html              Products
├── quality.html                Quality
├── manufacturing.html          Manufacturing
├── distribution.html           Distribution
├── gallery.html                Gallery
├── contact.html                Contact Us
├── become-distributor.html      Become a Distributor
├── enquiry.html                 Customer Enquiry
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css              All design tokens + component styles
└── js/
    ├── partials.js             Shared header/footer, injected on every page
    ├── main.js                 Scroll header state, mobile nav, reveals, counters, bubble bg
    ├── frame-animation.js      ProductFrameAnimation component (see below)
    └── forms.js                Validation + success state for all forms
```

Open `index.html` directly in a browser — everything runs client-side with
no dependencies beyond Google Fonts (loaded from CDN).

## Product frame animation

`js/frame-animation.js` implements a reusable `ProductFrameAnimation`
component. Any element marked `data-frame-animation` is picked up
automatically:

```html
<div class="bottle-stage" data-frame-animation
     data-src-pattern="images/ezgif-frame-{n}.jpg"
     data-start="1" data-total="60" data-fps="24">
  <canvas></canvas>
  <div class="bottle-fallback">…static SVG bottle…</div>
</div>
```

- It preloads frame 1 first; if that image exists, it loads the rest of
  the sequence in the background and plays it on `<canvas>` at the given
  FPS without blocking the page.
- If no `images/ezgif-frame-###.jpg` sequence is present (as in this
  starter project — no real product photography was supplied), it falls
  back permanently to the static animated SVG bottle already in the markup,
  so the hero is never blank.
- `prefers-reduced-motion` skips the sequence entirely and keeps the
  static fallback.
- The animation loop is cancelled via a `MutationObserver` if the node is
  removed from the page.

**To use real product photography:** export a frame-by-frame sequence
(e.g. from a turntable video) as `images/ezgif-frame-001.jpg`,
`ezgif-frame-002.jpg`, … and drop them in an `images/` folder next to
`index.html`. Update `data-total` to match the frame count. No other
code changes are needed.

## Placeholder content

No real product photography, certifications, awards, statistics, office
address, or additional phone numbers were supplied, so none have been
invented. Only the phone number given in the brief (091233 73088) is
used. Bottle/jar visuals, the gallery grid, and the about/hero graphics
are original SVG illustrations standing in for real photography — swap
them out via the `<img>`/`<svg>` markup in each page whenever real photos
are available.

## Forms

`contact.html`, `become-distributor.html`, and `enquiry.html` each contain
a `<form data-kaberi-form>`. `js/forms.js` validates required fields,
email format, and 10-digit Indian mobile numbers on submit, then swaps
the form for a `.form-success` panel with a drawn-checkmark animation.
Forms currently only validate and show a success state client-side —
wire the `handleSubmit` function in `forms.js` to an actual endpoint
(email service, CRM, etc.) to receive submissions in production.

## Accessibility & performance

- Respects `prefers-reduced-motion` (skips bubble background, frame
  animation, and scroll-reveal transitions).
- Semantic HTML, heading hierarchy, alt-less decorative SVGs are
  `aria`-neutral by default since they're inline and decorative.
- IntersectionObserver-driven reveals only animate elements once, and
  never block content from being visible if JS fails to load early.
- No external JS frameworks; total payload is small.
