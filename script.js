const $=(s,scope=document)=>scope.querySelector(s);const $$=(s,scope=document)=>[...scope.querySelectorAll(s)];
$$('[data-image]').forEach(el => {
  const src = el.dataset.image;

  if (src) {
    el.style.backgroundImage = `url("${src}")`;
  }
});

window.addEventListener('load',()=>setTimeout(()=>$('.page-loader')?.classList.add('is-hidden'),220));


const header = $('[data-header]');
const topbar = $('[data-topbar]');

const updateHeader = () => {
  const isScrolled = scrollY > 35;

  header?.classList.toggle('is-scrolled', isScrolled);
  topbar?.classList.toggle('is-scrolled', isScrolled);
};

updateHeader();

addEventListener('scroll', updateHeader, {
  passive: true
});




const menuButton=$('[data-menu-button]'),mobileMenu=$('[data-mobile-menu]');function toggleMenu(force){const open=force??!mobileMenu.classList.contains('is-open');mobileMenu.classList.toggle('is-open',open);mobileMenu.setAttribute('aria-hidden',String(!open));menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)}menuButton?.addEventListener('click',()=>toggleMenu());$$('a',mobileMenu).forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));


const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.20,
    rootMargin: '0px 0px -100px'
  }
);

$$(
  '.reveal, .reveal-from-right, .reveal-from-left, .reveal-from-bottom'
).forEach(element => {
  revealObserver.observe(element);
});

/* ========================================
   SCROLL IMAGE ZOOM
======================================== */

const scrollZoomImages = $$('[data-image]');

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const zoomStates = scrollZoomImages.map(element => ({
  element,
  currentScale: 1,
  targetScale: 1,
  currentY: 0,
  targetY: 0
}));

let zoomAnimationFrame = null;

function calculateImageZoom() {
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  zoomStates.forEach(state => {
    const rect = state.element.getBoundingClientRect();
    const imageCenter = rect.top + rect.height / 2;

    /*
     * 0 όταν η εικόνα είναι μακριά από το κέντρο.
     * 1 όταν το κέντρο της εικόνας συμπίπτει με
     * το κέντρο της οθόνης.
     */
    const distanceFromCenter = Math.abs(imageCenter - viewportCenter);
    const activeDistance = viewportHeight * 0.75;

    const proximity = Math.max(
      0,
      1 - distanceFromCenter / activeDistance
    );

    /*
     * Smooth easing.
     */
    const easedProximity =
      proximity * proximity * (3 - 2 * proximity);

    /*
     * Μέγιστο zoom: 10%.
     * Άλλαξε το 0.10 σε 0.06 για πιο διακριτικό zoom
     * ή σε 0.15 για πιο έντονο.
     */
    state.targetScale = 1 + easedProximity * 0.10;

    /*
     * Κρατάμε και ένα πολύ διακριτικό parallax μόνο
     * στα στοιχεία που έχουν data-parallax.
     */
    if (state.element.hasAttribute('data-parallax')) {
      const normalizedPosition =
        (imageCenter - viewportCenter) / viewportHeight;

      state.targetY = normalizedPosition * -28;
    } else {
      state.targetY = 0;
    }
  });

  startZoomAnimation();
}

function startZoomAnimation() {
  if (zoomAnimationFrame !== null) return;

  function animate() {
    let animationIsActive = false;

    zoomStates.forEach(state => {
      /*
       * Lerp για ομαλή κίνηση.
       * Μικρότερη τιμή = πιο αργό/κινηματογραφικό.
       */
      state.currentScale +=
        (state.targetScale - state.currentScale) * 0.09;

      state.currentY +=
        (state.targetY - state.currentY) * 0.09;

      if (
        Math.abs(state.targetScale - state.currentScale) > 0.0001 ||
        Math.abs(state.targetY - state.currentY) > 0.01
      ) {
        animationIsActive = true;
      }

      /*
       * Χρησιμοποιούμε τις ανεξάρτητες CSS ιδιότητες
       * scale και translate, ώστε να μη χαλάσουν τα
       * transforms των reveal animations.
       */
      state.element.style.scale = state.currentScale.toFixed(4);
      state.element.style.translate =
        `0 ${state.currentY.toFixed(2)}px`;
    });

    if (animationIsActive) {
      zoomAnimationFrame = requestAnimationFrame(animate);
    } else {
      zoomAnimationFrame = null;
    }
  }

  zoomAnimationFrame = requestAnimationFrame(animate);
}

if (!prefersReducedMotion) {
  window.addEventListener('scroll', calculateImageZoom, {
    passive: true
  });

  window.addEventListener('resize', calculateImageZoom);

  calculateImageZoom();
}

$$('[data-accordion] .accordion-item button').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.accordion-item'),accordion=button.closest('[data-accordion]');$$('.accordion-item',accordion).forEach(other=>{const shouldOpen=other===item?!other.classList.contains('is-open'):false;other.classList.toggle('is-open',shouldOpen);$('button',other).setAttribute('aria-expanded',String(shouldOpen))})}));

const countObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const progress = Math.min(
          (currentTime - startTime) / duration,
          1
        );

        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easedProgress);

        element.textContent =
          currentValue.toLocaleString('el-GR') + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent =
            target.toLocaleString('el-GR') + suffix;
        }
      }

      requestAnimationFrame(updateCount);
      countObserver.unobserve(element);
    });
  },
  {
    threshold: 0.7
  }
);

$$('[data-count]').forEach(element => {
  countObserver.observe(element);
});


const yearElement = $('[data-year]');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}



/* ========================================
   ABOUT BACKGROUND SCROLL ZOOM
======================================== */

const aboutSection = $('.about');

if (aboutSection && !prefersReducedMotion) {
  let currentAboutScale = 1;
  let targetAboutScale = 1;
  let aboutAnimationFrame = null;

  function calculateAboutZoom() {
    const rect = aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const sectionCenter = rect.top + rect.height / 2;

    const distanceFromCenter = Math.abs(
      sectionCenter - viewportCenter
    );

    /*
     * Όσο το section πλησιάζει το κέντρο της οθόνης,
     * η τιμή πλησιάζει το 1.
     */
    const activeDistance =
      viewportHeight / 2 + rect.height / 2;

    const proximity = Math.max(
      0,
      Math.min(1, 1 - distanceFromCenter / activeDistance)
    );

    /*
     * Ομαλό easing.
     */
    const easedProximity =
      proximity * proximity * (3 - 2 * proximity);

    /*
     * Από scale 1 μέχρι scale 1.12.
     * Άλλαξε το 0.12 για πιο έντονο ή διακριτικό zoom.
     */
    targetAboutScale = 1 + easedProximity * 0.12;

    startAboutZoomAnimation();
  }

  function startAboutZoomAnimation() {
    if (aboutAnimationFrame !== null) return;

    function animateAboutZoom() {
      currentAboutScale +=
        (targetAboutScale - currentAboutScale) * 0.08;

      aboutSection.style.setProperty(
        '--about-image-scale',
        currentAboutScale.toFixed(4)
      );

      if (
        Math.abs(targetAboutScale - currentAboutScale) >
        0.0001
      ) {
        aboutAnimationFrame =
          requestAnimationFrame(animateAboutZoom);
      } else {
        aboutAnimationFrame = null;
      }
    }

    aboutAnimationFrame =
      requestAnimationFrame(animateAboutZoom);
  }

  window.addEventListener('scroll', calculateAboutZoom, {
    passive: true
  });

  window.addEventListener('resize', calculateAboutZoom);

  calculateAboutZoom();
}



/* ========================================
   COOKIE CONSENT
======================================== */

const COOKIE_CONSENT_KEY = 'materiaHubCookieConsent';

const cookieBanner = $('[data-cookie-consent]');
const acceptCookiesButton = $('[data-cookie-accept]');
const rejectCookiesButton = $('[data-cookie-reject]');
const cookieSettingsButtons = $$('[data-cookie-settings]');

function getCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (error) {
    console.warn('Could not read cookie preferences:', error);
    return null;
  }
}

function saveCookieConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (error) {
    console.warn('Could not save cookie preferences:', error);
  }
}

function showCookieBanner() {
  if (!cookieBanner) return;

  cookieBanner.hidden = false;
  cookieBanner.classList.remove('is-leaving');
  cookieBanner.classList.add('is-entering');

  requestAnimationFrame(() => {
    cookieBanner.classList.remove('is-entering');
    cookieBanner.classList.add('is-visible');
  });

  acceptCookiesButton?.focus();
}

function hideCookieBanner() {
  if (!cookieBanner) return;

  cookieBanner.classList.remove('is-visible');
  cookieBanner.classList.add('is-leaving');

  window.setTimeout(() => {
    cookieBanner.hidden = true;
    cookieBanner.classList.remove('is-leaving');
  }, 350);
}

function enableAnalyticsCookies() {
  /*
   * Βάλε εδώ τα προαιρετικά scripts.
   *
   * Παράδειγμα:
   * loadGoogleAnalytics();
   * loadMetaPixel();
   *
   * Μην τα φορτώνεις απευθείας μέσα στο HTML.
   */
}

function disableAnalyticsCookies() {
  /*
   * Εδώ μπορείς να διαγράφεις analytics cookies,
   * σε περίπτωση που ο χρήστης αλλάξει την επιλογή του.
   */
}

function applyCookieConsent(consent) {
  if (consent === 'accepted') {
    enableAnalyticsCookies();
  }

  if (consent === 'rejected') {
    disableAnalyticsCookies();
  }
}

function setCookieConsent(consent) {
  saveCookieConsent(consent);
  applyCookieConsent(consent);
  hideCookieBanner();

  window.dispatchEvent(
    new CustomEvent('cookieConsentChanged', {
      detail: { consent }
    })
  );
}

acceptCookiesButton?.addEventListener('click', () => {
  setCookieConsent('accepted');
});

rejectCookiesButton?.addEventListener('click', () => {
  setCookieConsent('rejected');
});

cookieSettingsButtons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    showCookieBanner();
  });
});

document.addEventListener('keydown', event => {
  if (
    event.key === 'Escape' &&
    cookieBanner &&
    !cookieBanner.hidden
  ) {
    hideCookieBanner();
  }
});

const savedCookieConsent = getCookieConsent();

if (savedCookieConsent) {
  applyCookieConsent(savedCookieConsent);
} else {
  window.addEventListener('load', () => {
    window.setTimeout(showCookieBanner, 500);
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const typingText = document.getElementById('hero-typing-text');

  if (!typingText) return;

  const phrases = [
    "architecture.",
    "architects.",
    "spaces.",
    "projects.",
    "design."
  ];

  let currentPhraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeHeroText() {
    const currentPhrase = phrases[currentPhraseIndex];

    if (!isDeleting) {
      charIndex++;
      typingText.textContent = currentPhrase.substring(0, charIndex);

      // Μόλις γραφτεί όλη η λέξη
      if (charIndex === currentPhrase.length) {
        isDeleting = true;

        // Περιμένει πριν αρχίσει να σβήνει
        setTimeout(typeHeroText, 1200);
        return;
      }

    } else {
      charIndex--;
      typingText.textContent = currentPhrase.substring(0, charIndex);

      // Μόλις σβηστεί όλη η λέξη
      if (charIndex === 0) {
        isDeleting = false;

        // Πηγαίνει στην επόμενη λέξη
        currentPhraseIndex =
          (currentPhraseIndex + 1) % phrases.length;

        // Μικρή παύση πριν αρχίσει η επόμενη
        setTimeout(typeHeroText, 400);
        return;
      }
    }

    const speed = isDeleting ? 35 : 60;
    setTimeout(typeHeroText, speed);
  }

  typingText.textContent = '';

  setTimeout(typeHeroText, 800);
});







/* ========================================
   HOMEPAGE OFFER SHOWCASE TABS
======================================== */

document.addEventListener('DOMContentLoaded', () => {

  const showcase =
    document.querySelector('[data-offer-showcase]');

  if (!showcase) return;


  const tabs = [
    ...showcase.querySelectorAll(
      '[data-offer-tab]'
    )
  ];


  const panels = [
    ...showcase.querySelectorAll(
      '[data-offer-panel]'
    )
  ];


  function activateOffer(
    key,
    moveFocus = false
  ) {

    tabs.forEach(tab => {

      const active =
        tab.dataset.offerTab === key;


      tab.classList.toggle(
        'is-active',
        active
      );


      tab.setAttribute(
        'aria-selected',
        String(active)
      );


      tab.tabIndex =
        active ? 0 : -1;


      if (
        active &&
        moveFocus
      ) {
        tab.focus();
      }

    });


    panels.forEach(panel => {

      const active =
        panel.dataset.offerPanel === key;


      panel.classList.toggle(
        'is-active',
        active
      );


      panel.hidden = !active;

    });

  }



  tabs.forEach(
    (tab, index) => {

      /* CLICK */

      tab.addEventListener(
        'click',
        () => {

          activateOffer(
            tab.dataset.offerTab
          );

        }
      );


      /* KEYBOARD */

      tab.addEventListener(
        'keydown',
        event => {

          const allowedKeys = [
            'ArrowDown',
            'ArrowRight',
            'ArrowUp',
            'ArrowLeft',
            'Home',
            'End'
          ];


          if (
            !allowedKeys.includes(
              event.key
            )
          ) {
            return;
          }


          event.preventDefault();


          let nextIndex = index;


          if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowRight'
          ) {

            nextIndex =
              (index + 1) %
              tabs.length;

          }


          if (
            event.key === 'ArrowUp' ||
            event.key === 'ArrowLeft'
          ) {

            nextIndex =
              (
                index -
                1 +
                tabs.length
              ) %
              tabs.length;

          }


          if (
            event.key === 'Home'
          ) {
            nextIndex = 0;
          }


          if (
            event.key === 'End'
          ) {
            nextIndex =
              tabs.length - 1;
          }


          activateOffer(
            tabs[nextIndex]
              .dataset
              .offerTab,
            true
          );

        }
      );

    }
  );

});
