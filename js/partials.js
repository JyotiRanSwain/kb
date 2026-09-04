/* Shared header + footer, injected into every page so markup stays in one place. */
(function(){
  const NAV = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'products.html', label: 'Products' },
    { href: 'quality.html', label: 'Quality' },
    { href: 'manufacturing.html', label: 'Manufacturing' },
    { href: 'distribution.html', label: 'Distribution' },
    { href: 'gallery.html', label: 'Gallery' },
    { href: 'contact.html', label: 'Contact' }
  ];

  function dropMark(){
    return '<svg class="drop" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3C16 3 8 13.5 8 20a8 8 0 0 0 16 0c0-6.5-8-17-8-17Z" fill="currentColor" opacity="0.95"/><path d="M12.5 20.5c0 2 1.5 3.5 3.2 3.7" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/></svg>';
  }

  // Uses images/logo.png if present; silently falls back to the inline drop mark otherwise.
  function logoImg(){
    return `<span class="logo-slot">${dropMark()}</span>`;
  }

  function headerHTML(current){
    const links = NAV.map(n => `<a href="${n.href}" class="${current===n.href?'active':''}">${n.label}</a>`).join('');
    return `
    <div class="container">
      <a href="index.html" class="brand">${logoImg()}<span>Kaberi Beverages</span></a>
      <nav class="nav-links">${links}</nav>
      <div class="header-actions">
        <a href="enquiry.html" class="btn btn-primary">Enquire Now</a>
      </div>
      <button class="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-nav">
      ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      <div class="header-actions">
        <a href="become-distributor.html" class="btn btn-ghost">Become a Distributor</a>
        <a href="enquiry.html" class="btn btn-primary">Enquire Now</a>
      </div>
    </div>`;
  }

  function footerHTML(){
    return `
    <svg class="footer-wave" viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 30 C150 0 350 55 600 28 C850 2 1050 45 1200 20 L1200 60 L0 60 Z"></path>
    </svg>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand">
            <span class="brand-row">${logoImg()}<span class="brand-name">Kaberi Beverages</span></span>
            <span class="brand-suffix">PVT. LTD.</span>
          </a>
          <p>Pure Water. Pure Trust. Delivering quality packaged drinking water with care, consistency and reliability since 2015.</p>
          <div class="social-row" style="margin-top:18px;">
            <a href="#" aria-label="Facebook">F</a>
            <a href="#" aria-label="Instagram">I</a>
            <a href="#" aria-label="LinkedIn">L</a>
            <a href="#" aria-label="Twitter">T</a>
          </div>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="quality.html">Quality</a></li>
            <li><a href="manufacturing.html">Manufacturing</a></li>
            <li><a href="gallery.html">Gallery</a></li>
          </ul>
        </div>
        <div>
          <h5>Business</h5>
          <ul>
            <li><a href="become-distributor.html">Become a Distributor</a></li>
            <li><a href="enquiry.html">Bulk Enquiry</a></li>
            <li><a href="distribution.html">Distribution</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h5>Get in touch</h5>
          <ul class="footer-touch">
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Kolkata, West Bengal, India</span>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:09123373088">091233 73088</a>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/></svg>
              <a href="mailto:info@kaberibeverages.com">info@kaberibeverages.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="year"></span> Kaberi Beverages Pvt. Ltd. All rights reserved.</span>
        <span>Privacy Policy &nbsp;&middot;&nbsp; Terms &amp; Conditions</span>
      </div>
      <p class="powered-by">Powered by <a href="https://powercloud.in/" target="_blank" rel="noopener">PowerCloud</a></p>
    </div>`;
  }

  function swapLogos(){
    // Try images/logo.png in every logo slot; on success, replace the inline drop mark.
    document.querySelectorAll('.logo-slot').forEach((slot) => {
      const test = new Image();
      test.onload = () => { slot.innerHTML = '<img src="images/logo.png" alt="Kaberi Beverages logo" class="logo-mark">'; };
      test.onerror = () => { /* keep the inline drop mark */ };
      test.src = 'images/logo.png';
    });
  }

  window.KaberiPartials = {
    mount(current){
      const header = document.getElementById('site-header');
      const footer = document.getElementById('site-footer');
      if(header){ header.innerHTML = headerHTML(current); }
      if(footer){ footer.innerHTML = footerHTML(); }
      const yearEl = document.getElementById('year');
      if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
      swapLogos();
    }
  };
})();
