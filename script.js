// WireWise — script.js
// Interactions, animations, dark mode, theme palettes, spark canvas, 3D tilt, FAQ, counter

document.addEventListener('DOMContentLoaded', function () {

  const html = document.documentElement;

  // ── Dark Mode ─────────────────────────────────────────
  const darkBtns = document.querySelectorAll('[data-theme-toggle]');
  const stored = localStorage.getItem('wirewise-theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  }
  darkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      html.classList.toggle('dark');
      localStorage.setItem('wirewise-theme', html.classList.contains('dark') ? 'dark' : 'light');
      updateThemeIcons();
    });
  });
  function updateThemeIcons() {
    const isDark = html.classList.contains('dark');
    document.querySelectorAll('[data-moon-icon]').forEach(el => el.style.display = isDark ? 'none' : 'block');
    document.querySelectorAll('[data-sun-icon]').forEach(el => el.style.display = isDark ? 'block' : 'none');
  }
  updateThemeIcons();

  // ── Theme Color Accent ────────────────────────────────
  const storedColor = localStorage.getItem('wirewise-color-theme') || 'amber';
  setColorTheme(storedColor);

  function setColorTheme(color) {
    html.setAttribute('data-theme-color', color);
    localStorage.setItem('wirewise-color-theme', color);
    document.querySelectorAll('.palette-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.color === color);
    });
    if (window.__updateSparkColor) window.__updateSparkColor();
  }

  // Toggle palette dropdown
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#palette-toggle-btn');
    const dropdown = document.getElementById('palette-dropdown');
    const isOption = e.target.closest('.palette-option');

    if (toggleBtn) {
      if (dropdown) dropdown.classList.toggle('open');
      return;
    }
    if (isOption) {
      const color = isOption.dataset.color;
      if (color) setColorTheme(color);
      if (dropdown) dropdown.classList.remove('open');
      return;
    }
    if (dropdown && !e.target.closest('.palette-dropdown-wrap')) {
      dropdown.classList.remove('open');
    }
  });

  // ── RTL Layout & Persistence ──────────────────────────
  const savedDir = localStorage.getItem('wirewise-dir');
  if (savedDir) {
    html.setAttribute('dir', savedDir);
  }

  document.addEventListener('click', (e) => {
    const rtlBtn = e.target.closest('[data-rtl-toggle]');
    if (rtlBtn) {
      const isRtl = html.getAttribute('dir') === 'rtl';
      const newDir = isRtl ? 'ltr' : 'rtl';
      html.setAttribute('dir', newDir);
      localStorage.setItem('wirewise-dir', newDir);
    }
  });

  // ── Navbar scroll effect ──────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }


  // ── Back to Top ───────────────────────────────────────
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 350);
    }, { passive: true });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Hero Image Slider (3 Images, 5 Seconds) ───────────
  function initImageSlider({
    sliderId,
    slideClass = '.hero-slide',
    dotSelector = '.slider-dot',
    prevBtnId,
    nextBtnId,
    controlsSelector = '.hero-slider-controls'
  }) {
    const sliderContainer = document.getElementById(sliderId);
    if (!sliderContainer) return;
    const slides = sliderContainer.querySelectorAll(slideClass);
    if (!slides.length) return;
    const parentContainer = sliderContainer.closest('section') || sliderContainer;
    const dots = parentContainer.querySelectorAll(dotSelector);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const controls = parentContainer.querySelector(controlsSelector);

    let currentIndex = 0;
    const totalSlides = slides.length;
    const INTERVAL_TIME = 5000; // 5-second transition
    let slideTimer = null;

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;

      // Toggle slide visibility with smooth crossfade
      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', !isActive);
      });

      // Update dots and animate 5s progress bar
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive);

        const progress = dot.querySelector('.slider-dot-progress');
        if (progress) {
          progress.style.animation = 'none';
          if (isActive) {
            void progress.offsetWidth; // force reflow
            progress.style.animation = `dot-progress-5s ${INTERVAL_TIME}ms linear forwards`;
          }
        }
      });
    }

    function startTimer() {
      stopTimer();
      slideTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, INTERVAL_TIME);
      if (controls) controls.classList.remove('paused');
    }

    function stopTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
      if (controls) controls.classList.add('paused');
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        startTimer();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          startTimer();
        }
      });
    });

    if (controls) {
      controls.addEventListener('mouseenter', stopTimer);
      controls.addEventListener('mouseleave', startTimer);
    }

    parentContainer.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
        startTimer();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
        startTimer();
      }
    });

    let touchStartX = 0;
    parentContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    parentContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
        startTimer();
      }
    }, { passive: true });

    // Initialize first slide and start 5s countdown
    goToSlide(0);
    startTimer();
  }

  // Initialize Hero Slider (index.html)
  initImageSlider({
    sliderId: 'hero-slider',
    slideClass: '.hero-slide',
    dotSelector: '.hero-slider-dots .slider-dot',
    prevBtnId: 'hero-slide-prev',
    nextBtnId: 'hero-slide-next',
    controlsSelector: '.hero-slider-controls'
  });

  // Initialize Hero 2 Slider (home2.html)
  initImageSlider({
    sliderId: 'hero2-slider',
    slideClass: '.hero2-slide',
    dotSelector: '#hero2-slider-dots .slider-dot, .hero2-slider-dots .slider-dot, .hero-slider-dots .slider-dot',
    prevBtnId: 'hero2-slide-prev',
    nextBtnId: 'hero2-slide-next',
    controlsSelector: '.hero2-slider-controls'
  });

  // ── Mobile hamburger ──────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on nav link click
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Active nav link ───────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 3D Card Tilt & Specular Cursor Spotlight ───────────
  const tiltCards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .response-metric, .team-card, .feature-highlight .fh-img, .contact-image-card');
  tiltCards.forEach(card => {
    card.classList.add('tilt-card');
    if (!card.querySelector('.spotlight-overlay')) {
      const spot = document.createElement('div');
      spot.className = 'spotlight-overlay';
      card.appendChild(spot);
    }
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5; // subtle 5.5 deg max
      const rotateY = ((x - centerX) / centerX) * 5.5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Interactive Electric Spark Particle Canvas ─────────
  const sparkCanvas = document.getElementById('hero-spark-canvas');
  if (sparkCanvas) {
    const ctx = sparkCanvas.getContext('2d');
    let animationFrameId;
    let width = 0, height = 0;
    let mouseX = -9999, mouseY = -9999;
    let isCanvasVisible = true;

    function getThemeRGB() {
      const style = getComputedStyle(document.documentElement);
      const rgbStr = style.getPropertyValue('--primary-rgb').trim();
      if (rgbStr) {
        const parts = rgbStr.split(',').map(n => parseInt(n.trim(), 10));
        if (parts.length === 3 && !parts.some(isNaN)) return parts;
      }
      return [245, 158, 11]; // default Volt Amber
    }

    let currentRGB = getThemeRGB();
    window.__updateSparkColor = function () {
      currentRGB = getThemeRGB();
    };

    function resizeCanvas() {
      const parent = sparkCanvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = sparkCanvas.width = rect.width || window.innerWidth;
      height = sparkCanvas.height = rect.height || window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Track mouse in hero container
    const heroSection = sparkCanvas.closest('section') || sparkCanvas.parentElement;
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = sparkCanvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }, { passive: true });
      heroSection.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
      }, { passive: true });
    }

    // Generate spark particles
    const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 30), 45);
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 1.1,
        vy: (Math.random() - 0.7) * 1.3, // float gently upwards
        radius: Math.random() * 2.2 + 1.2,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulse: Math.random() * Math.PI
      });
    }

    function drawSparks() {
      if (!isCanvasVisible || width <= 0 || height <= 0) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Cursor magnetic interaction
        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 130 && distMouse > 1) {
          p.x -= (dxMouse / distMouse) * 1.4;
          p.y -= (dyMouse / distMouse) * 1.4;
        }

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${currentRGB[0]}, ${currentRGB[1]}, ${currentRGB[2]}, ${alpha * 0.35})`;
        ctx.fill();

        // Core bright spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.fill();

        // Connect nearby sparks with subtle electric arc lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const lineAlpha = (1 - dist / 90) * 0.32 * alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            // Slight lightning jitter
            if (dist > 45 && Math.random() < 0.12) {
              const midX = (p.x + p2.x) / 2 + (Math.random() - 0.5) * 6;
              const midY = (p.y + p2.y) / 2 + (Math.random() - 0.5) * 6;
              ctx.lineTo(midX, midY);
            }
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${currentRGB[0]}, ${currentRGB[1]}, ${currentRGB[2]}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawSparks);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isCanvasVisible = entry.isIntersecting;
          if (isCanvasVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(drawSparks);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(sparkCanvas);
    } else {
      drawSparks();
    }
  }

  // ── Scroll reveal ─────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── Counter animation ─────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ── FAQ Accordion ─────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Password toggle ───────────────────────────────────
  document.querySelectorAll('.toggle-password, .password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-wrapper');
      const input = wrapper ? wrapper.querySelector('input') : null;
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      const eyeOpen = btn.querySelector('[data-eye-open]');
      const eyeOff = btn.querySelector('[data-eye-off]');
      if (eyeOpen) eyeOpen.style.display = isPass ? 'none' : 'block';
      if (eyeOff) eyeOff.style.display = isPass ? 'block' : 'none';
      btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
    });
  });

  // ── Countdown (coming soon) ────────────────────────────
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);
  function updateCountdown() {
    const now = new Date();
    const diff = launchDate - now;
    if (diff <= 0) return;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    const s = document.getElementById('cd-secs');
    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(mins).padStart(2, '0');
    if (s) s.textContent = String(secs).padStart(2, '0');
  }
  if (document.getElementById('cd-days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ── Form submission ───────────────────────────────────
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '✓ Sent!';
          btn.style.background = 'var(--accent-green)';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
          }, 2500);
        }, 1200);
      }
    });
  });

  // ── Smart Electrical Load & Panel Simulator ───────────
  function initLoadCalculator() {
    const calcSection = document.getElementById('load-calculator');
    if (!calcSection) return;

    const pillBtns = calcSection.querySelectorAll('.calc-pill-btn');
    const panelBtns = calcSection.querySelectorAll('.calc-panel-btn');
    const applianceItems = calcSection.querySelectorAll('.calc-appliance-item');

    const totalAmpsEl = document.getElementById('calc-total-amps');
    const kwValEl = document.getElementById('calc-kw-val');
    const panelSizeDisplay = document.getElementById('calc-panel-size-display');
    const necLimitEl = document.getElementById('calc-nec-limit');
    const utilizationPctEl = document.getElementById('calc-utilization-pct');
    const radialBar = document.getElementById('calc-radial-bar');
    const barFill = document.getElementById('calc-bar-fill');
    const headroomText = document.getElementById('calc-headroom-text');
    const statusBadge = document.getElementById('calc-status-badge');
    const statusText = document.getElementById('calc-status-text');
    const diagCard = document.getElementById('calc-diagnostic-box');
    const diagIcon = document.getElementById('calc-diag-icon');
    const diagTitle = document.getElementById('calc-diag-title');
    const diagDesc = document.getElementById('calc-diag-desc');
    const bookBtn = document.getElementById('calc-book-assessment');

    const circumference = 2 * Math.PI * 68; // ~427.26
    if (radialBar) {
      radialBar.style.strokeDasharray = `${circumference} ${circumference}`;
    }

    let baseAmps = 50; // medium default
    let panelCapacity = 100; // 100A default

    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pillBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        baseAmps = parseInt(btn.dataset.baseAmps, 10) || 50;
        recalculate();
      });
    });

    panelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        panelBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        panelCapacity = parseInt(btn.dataset.panel, 10) || 100;
        recalculate();
      });
    });

    applianceItems.forEach(item => {
      item.addEventListener('click', () => {
        const isActive = item.classList.toggle('active');
        item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        recalculate();
      });
    });

    function recalculate() {
      let applianceSum = 0;
      applianceItems.forEach(item => {
        if (item.classList.contains('active')) {
          const val = parseInt(item.dataset.loadAmps, 10) || 0;
          applianceSum += val;
        }
      });

      const totalAmps = Math.max(15, baseAmps + applianceSum);
      const totalKw = ((totalAmps * 240) / 1000).toFixed(1);
      const safeNecLimit = Math.round(panelCapacity * 0.8);
      const utilization = Math.round((totalAmps / panelCapacity) * 100);
      const headroom = panelCapacity - totalAmps;

      if (totalAmpsEl) totalAmpsEl.textContent = totalAmps;
      if (kwValEl) kwValEl.textContent = `~${totalKw} kW Peak Demand`;
      if (panelSizeDisplay) panelSizeDisplay.textContent = panelCapacity;
      if (necLimitEl) necLimitEl.textContent = `${safeNecLimit}A Safe Continuous Limit (80%)`;
      if (utilizationPctEl) utilizationPctEl.textContent = `${utilization}%`;

      if (barFill) {
        barFill.style.width = `${Math.min(100, utilization)}%`;
      }

      if (radialBar) {
        const gaugeRatio = Math.min(1.2, utilization / 100);
        const offset = circumference - (Math.min(1, gaugeRatio) * circumference);
        radialBar.style.strokeDashoffset = offset;
      }

      statusBadge.classList.remove('safe', 'warning', 'danger');
      diagCard.classList.remove('safe', 'warning', 'danger');

      if (utilization > 95) {
        statusBadge.classList.add('danger');
        diagCard.classList.add('danger');
        if (statusText) statusText.textContent = 'OVERLOAD RISK DETECTED';
        if (headroomText) headroomText.textContent = `Headroom: Overloaded by ${Math.abs(headroom)}A`;
        if (radialBar) radialBar.style.stroke = 'var(--accent-red)';
        if (barFill) barFill.style.backgroundColor = 'var(--accent-red)';

        if (diagIcon) {
          diagIcon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        }
        if (diagTitle) diagTitle.textContent = `Panel Upgrade Urgently Recommended (${panelCapacity}A Exceeded)`;
        if (diagDesc) diagDesc.textContent = `Your projected demand (${totalAmps}A) exceeds your panel's rated capacity of ${panelCapacity}A. Breakers will trip frequently and high heat load creates safety hazards. Upgrading to a 200A or 400A smart breaker panel is strongly advised.`;
        if (bookBtn) {
          bookBtn.textContent = `Schedule 200A Panel Assessment →`;
          bookBtn.href = `contact.html?service=panel-upgrade&load=${totalAmps}A`;
        }
      } else if (utilization >= 75) {
        statusBadge.classList.add('warning');
        diagCard.classList.add('warning');
        if (statusText) statusText.textContent = 'HIGH LOAD · NEAR 80% LIMIT';
        if (headroomText) headroomText.textContent = `Headroom: Only ${headroom}A Remaining`;
        if (radialBar) radialBar.style.stroke = 'var(--primary)';
        if (barFill) barFill.style.backgroundColor = 'var(--primary)';

        if (diagIcon) {
          diagIcon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        }
        if (diagTitle) diagTitle.textContent = `Approaching Continuous NEC Safety Threshold (${utilization}%)`;
        if (diagDesc) diagDesc.textContent = `Your home operates near the 80% continuous threshold (${safeNecLimit}A). Adding another major continuous appliance (like an EV charger or induction stove) will require a 200A service upgrade.`;
        if (bookBtn) {
          bookBtn.textContent = `Book Free Panel Capacity Check →`;
          bookBtn.href = `contact.html?service=panel-check&load=${totalAmps}A`;
        }
      } else {
        statusBadge.classList.add('safe');
        diagCard.classList.add('safe');
        if (statusText) statusText.textContent = 'SAFE CAPACITY · HEALTHY';
        if (headroomText) headroomText.textContent = `Headroom: ${headroom}A Available`;
        if (radialBar) radialBar.style.stroke = 'var(--accent-green)';
        if (barFill) barFill.style.backgroundColor = 'var(--accent-green)';

        if (diagIcon) {
          diagIcon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
        }
        if (diagTitle) diagTitle.textContent = `Panel Capacity Healthy (${utilization}% Utilized)`;
        if (diagDesc) diagDesc.textContent = `Your ${panelCapacity}A panel has ample headroom (${headroom}A free) to safely handle your current configuration. We recommend adding whole-home surge protection to guard sensitive smart electronics.`;
        if (bookBtn) {
          bookBtn.textContent = `Explore Whole-Home Protection →`;
          bookBtn.href = `contact.html?service=surge-protection&load=${totalAmps}A`;
        }
      }
    }

    recalculate();
  }

  initLoadCalculator();

});
