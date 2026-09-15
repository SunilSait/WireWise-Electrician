// WireWise — components.js
// Shared navbar and footer injected into every page

(function () {
  // ── Early State Restore (Theme, Color Accent & RTL) ───
  try {
    const savedDir = localStorage.getItem('wirewise-dir');
    if (savedDir) {
      document.documentElement.setAttribute('dir', savedDir);
    }
    const savedTheme = localStorage.getItem('wirewise-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    const savedColor = localStorage.getItem('wirewise-color-theme');
    if (savedColor) {
      document.documentElement.setAttribute('data-theme-color', savedColor);
    }
  } catch (e) {}

  // ── SVG Logo Mark ─────────────────────────────────────
  const logoSVG = `<svg class="logo-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="var(--primary)"/>
    <path d="M22 8 L14 20 H20 L17 32 L28 18 H22 L26 8 Z" fill="white"/>
  </svg>`;

  // ── Navbar HTML ───────────────────────────────────────
  const navbarHTML = `
  <nav class="navbar" id="main-navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-logo" aria-label="WireWise Home">
        ${logoSVG}
        <span class="logo-text">Wire<span>Wise</span></span>
      </a>

      <ul class="navbar-nav" role="navigation" aria-label="Main navigation">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="home2.html" class="nav-link">Home 2</a></li>
        <li><a href="services.html" class="nav-link">Services</a></li>
        <li><a href="pricing.html" class="nav-link">Pricing</a></li>
        <li><a href="emergency.html" class="nav-link">Emergency</a></li>
        <li><a href="contact.html" class="nav-link">Contact</a></li>
      </ul>

      <div class="navbar-actions">
        <!-- RTL toggle -->
        <button class="icon-btn" data-rtl-toggle aria-label="Toggle RTL layout" title="Toggle RTL">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"/>
          </svg>
        </button>
        <!-- Dark mode toggle -->
        <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode" title="Toggle theme">
          <svg data-moon-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg data-sun-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
        <a href="login.html" class="btn btn-primary btn-sm">Login</a>
        <!-- Hamburger -->
        <button class="hamburger" id="hamburger-btn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Navigation Drawer Overlay (Reference Implementation) -->
  <div class="mobile-drawer-overlay" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="mobile-drawer-header">
      <a href="index.html" class="navbar-logo" aria-label="WireWise Home">
        ${logoSVG}
        <span class="logo-text">Wire<span>Wise</span></span>
      </a>
      <button class="mobile-drawer-close" id="mobile-drawer-close" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="mobile-drawer-body">
      <a href="index.html" class="mobile-nav-link">Home</a>
      <a href="home2.html" class="mobile-nav-link">Home 2</a>
      <a href="services.html" class="mobile-nav-link">Services</a>
      <a href="pricing.html" class="mobile-nav-link">Pricing</a>
      <a href="emergency.html" class="mobile-nav-link">Emergency</a>
      <a href="contact.html" class="mobile-nav-link">Contact</a>
    </div>

    <div class="mobile-drawer-footer">
      <a href="login.html" class="btn btn-primary btn-full">Login</a>
      <div class="mobile-drawer-controls">
        <button class="icon-btn" data-rtl-toggle aria-label="Toggle RTL layout" title="Toggle RTL">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"/>
          </svg>
        </button>
        <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode" title="Toggle theme">
          <svg data-moon-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg data-sun-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
      </div>
    </div>
  </div>`;

  // ── Footer HTML ───────────────────────────────────────
  const footerHTML = `
  <footer class="footer" id="main-footer">
    <div class="footer-inner">
      <div class="footer-brand footer-col">
        <a href="index.html" class="navbar-logo" style="margin-bottom:0.5rem">
          ${logoSVG}
          <span class="logo-text">Wire<span>Wise</span></span>
        </a>
        <p class="footer-tagline">Your trusted residential electricians. Licensed, insured, and available 24/7 for all your home wiring and electrical needs.</p>
        <div class="footer-social">
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="#" aria-label="Twitter / X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-col">
        <h5>Services</h5>
        <ul>
          <li><a href="services.html">Home Wiring</a></li>
          <li><a href="services.html">Circuit Breaker</a></li>
          <li><a href="services.html">Lighting Fitting</a></li>
          <li><a href="services.html">Fan Installation</a></li>
          <li><a href="services.html">Panel Upgrades</a></li>
          <li><a href="services.html">Switchboard Repair</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="home2.html">Home 2</a></li>
          <li><a href="pricing.html">Pricing Guide</a></li>
          <li><a href="emergency.html">Emergency Service</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="coming-soon.html">Coming Soon</a></li>
          <li><a href="404.html">404 Page</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Contact</h5>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 5.18 5.18l1-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>+1 (800) 555-WIRE</span>
        </div>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>info@wirewise.com</span>
        </div>
        <div class="footer-contact-item">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>123 Main Street, New York, NY 10001</span>
        </div>
        <div class="footer-contact-item" style="margin-top:0.25rem">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Mon–Sat: 8am–8pm | Emergency: 24/7</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© <span id="footer-year">2026</span> WireWise Electrical Services. All rights reserved.</span>
      <div class="footer-bottom-links">
        <a href="coming-soon.html">Privacy Policy</a>
        <a href="coming-soon.html">Terms of Service</a>
        <a href="404.html">Sitemap</a>
        <a href="login.html">Login</a>
      </div>
    </div>
  </footer>`;

  // ── Inject on DOM ready ───────────────────────────────
  const navContainer = document.getElementById('navbar-container');
  if (navContainer) navContainer.innerHTML = navbarHTML;

  // ── Mobile Drawer Controller ──────────────────────────
  function initMobileDrawer() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');
    if (!drawer) return;

    // Highlight active nav link in mobile drawer
    let path = window.location.pathname.split('/').pop() || 'index.html';
    if (!path || path === '/') path = 'index.html';
    drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    function openDrawer() {
      drawer.classList.add('open');
      if (hamburgerBtn) {
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (drawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    drawer.querySelectorAll('.mobile-nav-link, .mobile-drawer-footer a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  initMobileDrawer();

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) footerContainer.innerHTML = footerHTML;

  // Update footer year
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();


  // Inject back to top button
  if (!document.getElementById('back-to-top')) {
    const btt = document.createElement('button');
    btt.className = 'back-to-top-btn';
    btt.id = 'back-to-top';
    btt.setAttribute('aria-label', 'Back to top');
    btt.setAttribute('title', 'Back to top');
    btt.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    document.body.appendChild(btt);
  }

})();

