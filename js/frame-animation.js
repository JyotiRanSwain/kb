/**
 * ProductFrameAnimation
 * ----------------------------------------------------------------------
 * Renders a frame-by-frame product sequence onto a <canvas> that fills its
 * container edge-to-edge (cover fit), and scrubs through the sequence as
 * the visitor scrolls the page — the further you scroll through the hero,
 * the further the sequence advances. This mirrors the "scroll-driven
 * product reveal" pattern used on premium product pages.
 *
 * Configure per element via data-attributes:
 *   data-frame-animation             marks the mount point
 *   data-src-pattern="images/ezgif-frame-{n}.jpg"   {n} = zero-padded to 3
 *   data-start="1"                    first frame index
 *   data-total="211"                  how many frames in the sequence
 *
 * Behaviour:
 *   1. The static fallback graphic is visible immediately — never a blank slot.
 *   2. All frames start loading right away (matching the simple preload
 *      loop pattern), frame 0 is drawn onto the canvas the moment it's ready.
 *   3. Once frame 0 has loaded, scrolling maps to a frame index and redraws
 *      the canvas — no rAF loop is needed since drawing is scroll-driven.
 *   4. If frame 0 fails to load (no real sequence present), the component
 *      stays on the static fallback and never attaches scroll behaviour.
 *   5. prefers-reduced-motion skips the sequence entirely.
 */
(function () {
  function pad(n) { return String(n).padStart(3, '0'); }

  function mount(root) {
    const canvas = root.querySelector('canvas');
    const fallback = root.querySelector('.bottle-fallback');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const START = parseInt(root.dataset.start || '1', 10);
    const TOTAL = parseInt(root.dataset.total || '0', 10);
    const pattern = root.dataset.srcPattern || 'images/ezgif-frame-{n}.jpg';
    const scrollScope = root.closest('.hero-scroll') || root.closest('.hero') || root;

    function showFallback() { if (canvas) canvas.style.display = 'none'; if (fallback) fallback.style.display = 'block'; }
    function showCanvas() { if (canvas) canvas.style.display = 'block'; if (fallback) fallback.style.display = 'none'; }

    if (!pattern || !TOTAL || !ctx || reduceMotion) { showFallback(); return; }

    const frames = [];
    let loaded = 0;
    let firstFrameFailed = false;
    let currentFrame = -1;

    function sizeCanvas() {
      const rect = root.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * devicePixelRatio);
      canvas.height = Math.max(1, rect.height * devicePixelRatio);
    }

    function drawFrame(i) {
      const img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      sizeCanvas();
      const cw = canvas.width, ch = canvas.height;
      // Cover-fit so the frame always fills the banner completely.
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      currentFrame = i;
    }

    // Preload the whole sequence up front (small JPEGs; matches the
    // brief's original preload loop), drawing frame 0 the instant it's ready.
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.src = pattern.replace('{n}', pad(START + i));
      img.onload = () => {
        loaded++;
        if (i === 0) { showCanvas(); drawFrame(0); attachScroll(); }
      };
      img.onerror = () => {
        loaded++;
        if (i === 0) { firstFrameFailed = true; showFallback(); }
      };
      frames.push(img);
    }

    let scrollAttached = false;
    function attachScroll() {
      if (scrollAttached || firstFrameFailed) return;
      scrollAttached = true;

      function frameForScroll() {
        const scopeH = scrollScope.offsetHeight || window.innerHeight;
        const scrollable = scopeH - window.innerHeight;
        let progress;
        if (scrollable > 0) {
          // Tall wrapper (e.g. a sticky-pinned hero): map the distance
          // scrolled through the wrapper's own extra height to progress.
          const top = scrollScope.getBoundingClientRect().top;
          progress = Math.min(1, Math.max(0, -top / scrollable));
        } else {
          // No extra scroll room to pin against — fall back to a simple
          // scroll-from-top mapping over the element's own height.
          progress = Math.min(1, Math.max(0, window.scrollY / scopeH));
        }
        return Math.min(TOTAL - 1, Math.floor(progress * TOTAL));
      }

      function onScroll() {
        const next = frameForScroll();
        // Draw the nearest already-loaded frame at or before the target,
        // so scrubbing stays smooth even if later frames are still loading.
        let target = next;
        while (target > 0 && !(frames[target] && frames[target].complete && frames[target].naturalWidth)) {
          target--;
        }
        if (target !== currentFrame) drawFrame(target);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => drawFrame(currentFrame === -1 ? 0 : currentFrame), { passive: true });
      onScroll();
    }
  }

  function mountAll() {
    document.querySelectorAll('[data-frame-animation]').forEach(mount);
  }

  window.ProductFrameAnimation = { mountAll };
})();
