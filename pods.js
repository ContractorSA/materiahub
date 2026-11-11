(() => {
  const sections = [...document.querySelectorAll('[data-pod-section]')];
  const links = [...document.querySelectorAll('[data-pod-link]')];

  if (!sections.length || !links.length) return;

  const setActive = id => {
    links.forEach(link => {
      const active = link.dataset.podLink === id;

      link.classList.toggle('is-active', active);

      if (active) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: [0, 0.1, 0.25, 0.5]
    }
  );

  sections.forEach(section => {
    observer.observe(section);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      setActive(link.dataset.podLink);
    });
  });
})();


/* =========================================================
   PRE-OWNED PODS CAROUSEL
========================================================= */

(() => {

  const carousel =
    document.querySelector('[data-preowned-carousel]');

  if (!carousel) return;


  const slides = [
    ...carousel.querySelectorAll('[data-preowned-slide]')
  ];

  const previousButton =
    carousel.querySelector('[data-preowned-prev]');

  const nextButton =
    carousel.querySelector('[data-preowned-next]');

  const dotsContainer =
    carousel.querySelector('[data-preowned-dots]');


  if (slides.length < 2) return;


  let activeIndex = 1;

  let autoplayTimer = null;

  const autoplayDelay = 4500;


  const stage = carousel.querySelector('.pods-preowned__stage');

  // Fit every photo within the available stage without cropping or squaring it.
  function sizeSlidesToOriginalRatio() {
    if (!stage) return;

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    if (!stageWidth || !stageHeight) return;

    const maxWidthRatio = window.innerWidth <= 700 ? .78 :
      window.innerWidth <= 1050 ? .47 : .36;
    const maxWidth = stageWidth * maxWidthRatio;
    const maxHeight = stageHeight * .88;

    slides.forEach(slide => {
      const image = slide.querySelector('img');
      if (!image?.naturalWidth || !image?.naturalHeight) return;

      const scale = Math.min(
        maxWidth / image.naturalWidth,
        maxHeight / image.naturalHeight
      );

      slide.style.width = `${image.naturalWidth * scale}px`;
      slide.style.height = `${image.naturalHeight * scale}px`;
    });
  }

  slides.forEach(slide => {
    const image = slide.querySelector('img');
    if (!image) return;
    if (image.complete && image.naturalWidth) {
      // Cached images already have their intrinsic dimensions.
      sizeSlidesToOriginalRatio();
    } else {
      image.addEventListener('load', sizeSlidesToOriginalRatio);
    }
  });

  window.addEventListener('resize', sizeSlidesToOriginalRatio);
  sizeSlidesToOriginalRatio();


  /* =========================
     CREATE DOTS
  ========================= */

  const dots = slides.map((slide, index) => {

    const dot = document.createElement('button');

    dot.type = 'button';

    dot.className =
      'pods-preowned__dot';

    dot.setAttribute(
      'aria-label',
      `Προβολή εικόνας ${index + 1}`
    );

    dot.addEventListener('click', () => {

      activeIndex = index;

      updateCarousel();

      restartAutoplay();

    });


    dotsContainer?.appendChild(dot);

    return dot;

  });


  /* =========================
     UPDATE SLIDES
  ========================= */

  function updateCarousel() {

    const total = slides.length;

    const leftIndex =
      (activeIndex - 1 + total) % total;

    const rightIndex =
      (activeIndex + 1) % total;


    slides.forEach((slide, index) => {

      slide.classList.remove(
        'is-left',
        'is-active',
        'is-right'
      );


      if (index === activeIndex) {

        slide.classList.add('is-active');

        slide.setAttribute(
          'aria-current',
          'true'
        );

      } else {

        slide.removeAttribute(
          'aria-current'
        );

      }


      if (index === leftIndex) {
        slide.classList.add('is-left');
      }


      if (index === rightIndex) {
        slide.classList.add('is-right');
      }

    });


    dots.forEach((dot, index) => {

      dot.classList.toggle(
        'is-active',
        index === activeIndex
      );

    });

  }


  /* =========================
     NEXT
  ========================= */

  function nextSlide() {

    activeIndex =
      (activeIndex + 1) % slides.length;

    updateCarousel();

  }


  /* =========================
     PREVIOUS
  ========================= */

  function previousSlide() {

    activeIndex =
      (
        activeIndex -
        1 +
        slides.length
      ) % slides.length;

    updateCarousel();

  }


  /* =========================
     BUTTONS
  ========================= */

  nextButton?.addEventListener(
    'click',
    () => {

      nextSlide();

      restartAutoplay();

    }
  );


  previousButton?.addEventListener(
    'click',
    () => {

      previousSlide();

      restartAutoplay();

    }
  );


  /* =========================
     CLICK SIDE IMAGE
  ========================= */

  slides.forEach((slide, index) => {

    slide.addEventListener('click', () => {

      if (index === activeIndex) return;

      activeIndex = index;

      updateCarousel();

      restartAutoplay();

    });

  });


  /* =========================
     KEYBOARD
  ========================= */

  carousel.addEventListener(
    'keydown',
    event => {

      if (event.key === 'ArrowRight') {

        nextSlide();

        restartAutoplay();

      }


      if (event.key === 'ArrowLeft') {

        previousSlide();

        restartAutoplay();

      }

    }
  );


  /* =========================
     AUTOPLAY
  ========================= */

  function startAutoplay() {

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }


    stopAutoplay();


    autoplayTimer =
      window.setInterval(
        nextSlide,
        autoplayDelay
      );

  }


  function stopAutoplay() {

    if (!autoplayTimer) return;


    window.clearInterval(
      autoplayTimer
    );


    autoplayTimer = null;

  }


  function restartAutoplay() {

    stopAutoplay();

    startAutoplay();

  }


  /* Pause when user interacts */

  carousel.addEventListener(
    'mouseenter',
    stopAutoplay
  );


  carousel.addEventListener(
    'mouseleave',
    startAutoplay
  );


  carousel.addEventListener(
    'focusin',
    stopAutoplay
  );


  carousel.addEventListener(
    'focusout',
    startAutoplay
  );


  /* =========================
     INITIAL STATE
  ========================= */

  updateCarousel();

  startAutoplay();

})();
