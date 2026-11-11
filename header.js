(() => {
  "use strict";

  const headerContainer = document.getElementById("site-header");

  if (!headerContainer) {
    console.warn(
      'header.js: Δεν βρέθηκε το στοιχείο <div id="site-header"></div>.'
    );
    return;
  }

  /* ========================================
     CURRENT LANGUAGE / PAGE
  ======================================== */

  const pathname = window.location.pathname;

  const isEnglish =
    pathname === "/en" ||
    pathname === "/en/" ||
    pathname.startsWith("/en/");

  const isPortuguese =
    pathname === "/pt" ||
    pathname === "/pt/" ||
    pathname.startsWith("/pt/");

  const currentLanguage =
    isEnglish
      ? "en"
      : isPortuguese
        ? "pt"
        : "el";

  const pathEndsWithSlash =
    pathname.endsWith("/");

  /*
   * Θεωρούμε ως homepage:
   *
   * /
   * /index.html
   * /en/
   * /en
   * /en/index.html
   * /pt/
   * /pt
   * /pt/index.html
   */

  const isLanguageRoot =
    pathname === "/" ||
    pathname === "/en" ||
    pathname === "/en/" ||
    pathname === "/pt" ||
    pathname === "/pt/";

  const currentFile =
    isLanguageRoot || pathEndsWithSlash
      ? "index.html"
      : pathname
          .split("/")
          .pop()
          .toLowerCase();

  const isHomePage =
    isLanguageRoot ||
    currentFile === "" ||
    currentFile === "index.html" ||
    currentFile === "index.htm";

  /*
   * Ελληνική αρχική:
   * /
   *
   * Αγγλική αρχική:
   * /en/
   *
   * Πορτογαλική αρχική:
   * /pt/
   */

  const languageRoot =
    currentLanguage === "en"
      ? "/en/"
      : currentLanguage === "pt"
        ? "/pt/"
        : "/";

  /* ========================================
     NAVIGATION LINKS
  ======================================== */

  const homeLink =
    isHomePage
      ? "#top"
      : `${languageRoot}#top`;

  const aboutLink =
    isHomePage
      ? "#about"
      : `${languageRoot}#about`;

  const solutionsLink =
    `${languageRoot}solutions.html`;

  const projectLink =
    isHomePage
      ? "#project"
      : `${languageRoot}#project`;

  const podsLink =
    `${languageRoot}pods.html`;

  const contactLink =
    isHomePage
      ? "#contact"
      : `${languageRoot}#contact`;

  const floorVisualizerLink =
    `${languageRoot}floorvisualizer.html`;

  const designersLink =
    `${languageRoot}designers.html`;

  /* ========================================
     LANGUAGE SWITCH LINKS
  ======================================== */

  /*
   * Κρατάμε το ίδιο filename όταν αλλάζει
   * η γλώσσα.
   *
   * Παράδειγμα:
   *
   * /pods.html
   * /en/pods.html
   * /pt/pods.html
   */

  const pageFile =
    isHomePage
      ? ""
      : currentFile;

  const urlExtras =
    `${window.location.search}${window.location.hash}`;

  const greekLanguageLink =
    `/${pageFile}${urlExtras}`;

  const englishLanguageLink =
    `/en/${pageFile}${urlExtras}`;

  const portugueseLanguageLink =
    `/pt/${pageFile}${urlExtras}`;

  /* ========================================
     LANGUAGE DATA
  ======================================== */

  const languageData = {
    el: {
      code: "EL",
      flag: "/images/flag-gr.svg"
    },

    en: {
      code: "EN",
      flag: "/images/flag-gb.svg"
    },

    pt: {
      code: "PT",
      flag: "/images/flag-pt.svg"
    }
  };

  const currentLanguageData =
    languageData[currentLanguage];

  /* ========================================
     TRANSLATED HEADER LABELS
  ======================================== */

  const translations = {
    el: {
      home: "Materia Hub - Αρχική",
      navigation: "Κύρια πλοήγηση",
      mobileNavigation: "Πλοήγηση κινητού",
      company: "Η εταιρεία",
      solutions: "Δάπεδα",
      designers: "DESIGNERS",
      pods: "PODS",
      projects: "Έργα",
      visualizer: "Floor Visualizer",
      contact: "Επικοινωνία",
      menu: "MENU",
      openMenu: "Άνοιγμα μενού",
      changeLanguage: "Αλλαγή γλώσσας"
    },

    en: {
      home: "Materia Hub - Home",
      navigation: "Main navigation",
      mobileNavigation: "Mobile navigation",
      company: "Company",
      solutions: "Flooring",
      designers: "DESIGNERS",
      pods: "Pods",
      projects: "Projects",
      visualizer: "Floor Visualizer",
      contact: "Contact",
      menu: "MENU",
      openMenu: "Open menu",
      changeLanguage: "Change language"
    },

    pt: {
      home: "Materia Hub - Início",
      navigation: "Navegação principal",
      mobileNavigation: "Navegação móvel",
      company: "Empresa",
      solutions: "Pavimentos",
      designers: "DESIGNERS",
      pods: "Pods",
      projects: "Projetos",
      visualizer: "Visualizador de Pavimentos",
      contact: "Contacto",
      menu: "MENU",
      openMenu: "Abrir menu",
      changeLanguage: "Alterar idioma"
    }
  };

  const labels =
    translations[currentLanguage];

  /* ========================================
     HEADER HTML
  ======================================== */

  headerContainer.innerHTML = `

<div class="company-topbar" data-topbar>

  <div class="company-topbar-inner">




    <span
      class="company-topbar-separator"
      aria-hidden="true"
    ></span>


    <a
      class="company-topbar-item"
      href="tel:+302106232650"
      aria-label="Τηλέφωνο +30 210 6232650"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M7.2 3.5 4.8 5.9c-.7.7-.8 1.8-.3 2.7 2.3 4.5 6.4 8.6 10.9 10.9.9.5 2 .4 2.7-.3l2.4-2.4c.5-.5.6-1.3.2-1.9l-2-3c-.4-.6-1.2-.8-1.8-.5l-2.4 1.2a1.3 1.3 0 0 1-1.5-.2l-1.4-1.4-1.4-1.4A1.3 1.3 0 0 1 10 8.1l1.2-2.4c.3-.6.1-1.4-.5-1.8l-3-2c-.6-.4-1.4-.3-1.9.2Z"></path>
      </svg>

      <span>+30 210 6232650</span>
    </a>


    <span
      class="company-topbar-separator"
      aria-hidden="true"
    ></span>


    <a
      class="company-topbar-item"
      href="mailto:info@materiahub.gr"
      aria-label="Email info@materiahub.gr"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="1"
        ></rect>

        <path d="m4 7 8 6 8-6"></path>
      </svg>

      <span>info@materiahub.gr</span>
    </a>

  </div>

</div>


<header class="site-header" data-header>

  <a
    class="brand"
    href="${homeLink}"
    aria-label="${labels.home}"
  >
    <img
      src="/images/materiahublogo.png"
      alt="Materia Hub Logo"
      class="brand-logo"
    >
  </a>


  <nav
    class="desktop-nav"
    aria-label="${labels.navigation}"
  >

    <a href="${aboutLink}">
      ${labels.company}
    </a>

    <a href="${solutionsLink}">
      ${labels.solutions}
    </a>

    <a href="${designersLink}">
      ${labels.designers}
    </a>

    <a href="${podsLink}">
      ${labels.pods}
    </a>

    <a href="${projectLink}">
      ${labels.projects}
    </a>

    <a href="${floorVisualizerLink}">
      ${labels.visualizer}
    </a>

  </nav>


  <div class="header-actions">

    <a
      class="text-link"
      href="${contactLink}"
    >
      ${labels.contact}
    </a>


    <!-- LANGUAGE SWITCHER -->

    <details class="language-switcher">

      <summary
        class="language-current"
        aria-label="${labels.changeLanguage}"
      >

        <img
          class="language-flag-img"
          src="${currentLanguageData.flag}"
          alt=""
          aria-hidden="true"
        >

        <span class="language-code">
          ${currentLanguageData.code}
        </span>

        <span
          class="language-chevron"
          aria-hidden="true"
        ></span>

      </summary>


      <div class="language-menu">

        <a
          href="${greekLanguageLink}"
          lang="el"
          ${currentLanguage === "el" ? 'aria-current="page"' : ""}
        >
          <img
            class="language-flag-img"
            src="/images/flag-gr.svg"
            alt=""
            aria-hidden="true"
          >

          <span>Ελληνικά</span>
        </a>


        <a
          href="${englishLanguageLink}"
          lang="en"
          ${currentLanguage === "en" ? 'aria-current="page"' : ""}
        >
          <img
            class="language-flag-img"
            src="/images/flag-gb.svg"
            alt=""
            aria-hidden="true"
          >

          <span>English</span>
        </a>


        <a
          href="${portugueseLanguageLink}"
          lang="pt-PT"
          ${currentLanguage === "pt" ? 'aria-current="page"' : ""}
        >
          <img
            class="language-flag-img"
            src="/images/flag-pt.svg"
            alt=""
            aria-hidden="true"
          >

          <span>Português</span>
        </a>

      </div>

    </details>


    <button
      class="menu-button"
      type="button"
      aria-expanded="false"
      aria-controls="mobile-menu"
      data-menu-button
    >
      <span></span>
      <span></span>

      <span class="sr-only">
        ${labels.openMenu}
      </span>
    </button>

  </div>

</header>


<aside
  class="mobile-menu"
  id="mobile-menu"
  aria-hidden="true"
  data-mobile-menu
>

  <div class="mobile-menu-inner">

    <p class="eyebrow">
      ${labels.menu}
    </p>

    <nav aria-label="${labels.mobileNavigation}">

      <a href="${aboutLink}">
        ${labels.company}
      </a>

      <a href="${solutionsLink}">
        ${labels.solutions}
      </a>

      <a href="${designersLink}">
        ${labels.designers}
      </a>

      <a href="${podsLink}">
        ${labels.pods}
      </a>

      <a href="${projectLink}">
        ${labels.projects}
      </a>

      <a href="${floorVisualizerLink}">
        ${labels.visualizer}
      </a>

      <a href="${contactLink}">
        ${labels.contact}
      </a>

    </nav>

  </div>

</aside>
  `;


  /* ========================================
     CLOSE LANGUAGE MENU
  ======================================== */

  const languageSwitcher =
    headerContainer.querySelector(
      ".language-switcher"
    );

  /*
   * Κλείνει όταν πατήσεις οπουδήποτε
   * έξω από το language selector.
   */

  document.addEventListener(
    "click",
    event => {
      if (
        languageSwitcher &&
        !languageSwitcher.contains(event.target)
      ) {
        languageSwitcher.removeAttribute("open");
      }
    }
  );

  /*
   * Κλείνει και με Escape.
   */

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        languageSwitcher
      ) {
        languageSwitcher.removeAttribute("open");
      }
    }
  );

})();
