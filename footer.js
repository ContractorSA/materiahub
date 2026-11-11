const footerContainer = document.querySelector("#site-footer");

if (footerContainer) {
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

  const languageRoot =
    currentLanguage === "en"
      ? "/en/"
      : currentLanguage === "pt"
        ? "/pt/"
        : "/";

  const translations = {
    el: {
      home: "Materia Hub - Αρχική",

      navigation: "Πλοήγηση",
      company: "Η εταιρεία",
      solutions: "Λύσεις",
      projects: "Έργα",

      support: "Υποστήριξη",
      specifications: "Προδιαγραφές",
      samples: "Δείγματα",
      valueEngineering: "Value engineering",

      contact: "Επικοινωνία",
      country: "Ελλάδα",

      websiteBy: "Website by",

      privacy: "Πολιτική Απορρήτου",
      terms: "Όροι Χρήσης",
      cookies: "Cookies",
      backToTop: "Επιστροφή στην κορυφή ↑",

      legal:
        "Materia Hub S.A. • Αρ. Γ.Ε.ΜΗ.: 197351701000 • Έδρα: Αθήνα, Ελλάδα"
    },

    en: {
      home: "Materia Hub - Home",

      navigation: "Navigation",
      company: "Company",
      solutions: "Solutions",
      projects: "Projects",

      support: "Support",
      specifications: "Specifications",
      samples: "Samples",
      valueEngineering: "Value engineering",

      contact: "Contact",
      country: "Greece",

      websiteBy: "Website by",

      privacy: "Privacy Policy",
      terms: "Terms of Use",
      cookies: "Cookies",
      backToTop: "Back to top ↑",

      legal:
        "Materia Hub S.A. • G.E.MI. No.: 123456789000 • Registered office: Athens, Greece"
    },

    pt: {
      home: "Materia Hub - Início",

      navigation: "Navegação",
      company: "Empresa",
      solutions: "Soluções",
      projects: "Projetos",

      support: "Apoio",
      specifications: "Especificações",
      samples: "Amostras",
      valueEngineering: "Engenharia de valor",

      contact: "Contacto",
      country: "Grécia",

      websiteBy: "Website por",

      privacy: "Política de Privacidade",
      terms: "Termos de Utilização",
      cookies: "Cookies",
      backToTop: "Voltar ao topo ↑",

      legal:
        "Materia Hub S.A. • N.º G.E.MI.: 123456789000 • Sede: Atenas, Grécia"
    }
  };

  const t = translations[currentLanguage];

  const privacyLink =
    `${languageRoot}privacy-policy.html`;

  const termsLink =
    `${languageRoot}terms-of-use.html`;

  const cookieLink =
    `${languageRoot}cookie-policy.html`;

  footerContainer.innerHTML = `
    <footer class="site-footer">

      <div class="container footer-top">

        <a
          class="brand footer-brand"
          href="${languageRoot}#top"
          aria-label="${t.home}"
        >
          <img
            class="brand-logo footer-logo"
            src="/images/materia-hub-footer-logo.png"
            alt="Materia Hub"
          >
        </a>


        <div class="footer-columns">

          <div>
            <h3>${t.navigation}</h3>

            <a href="${languageRoot}#about">
              ${t.company}
            </a>

            <a href="${languageRoot}#solutions">
              ${t.solutions}
            </a>

            <a href="${languageRoot}#project">
              ${t.projects}
            </a>
          </div>


          <div>
            <h3>${t.support}</h3>

            <a href="${languageRoot}#support">
              ${t.specifications}
            </a>

            <a href="${languageRoot}#support">
              ${t.samples}
            </a>

            <a href="${languageRoot}#support">
              ${t.valueEngineering}
            </a>
          </div>


          <div>
            <h3>${t.contact}</h3>

            <a href="tel:+302106232650">
              210 6232650
            </a>

            <a href="mailto:info@materiahub.gr">
              info@materiahub.gr
            </a>

            <p>${t.country}</p>
          </div>

        </div>

      </div>


      <div class="container footer-bottom">

        <div class="footer-bottom-left">

          <span>
            © <span data-year></span> Materia Hub
          </span>

          <span class="footer-credit">
            ${t.websiteBy}
            <a href="mailto:panoskopi@yahoo.gr">
              Panagiotis Kopitsas
            </a>
          </span>

        </div>


        <div class="footer-bottom-right">

          <a href="${privacyLink}">
            ${t.privacy}
          </a>

          <a href="${termsLink}">
            ${t.terms}
          </a>

          <a
            href="${cookieLink}"
            id="cookieSettings"
          >
            ${t.cookies}
          </a>

          <a href="#top">
            ${t.backToTop}
          </a>

        </div>

      </div>


      <div class="container footer-legal">

        <p>
          ${t.legal}
        </p>

      </div>

    </footer>
  `;


  const yearElement =
    footerContainer.querySelector("[data-year]");

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }
}


/* =========================================================
   MATERIA HUB CHATBOT LOADER
========================================================= */

(() => {
  "use strict";

  const CHATBOT_VERSION = "9";


  /* ---------------------------------------------------------
     CHATBOT LANGUAGE
  --------------------------------------------------------- */

  function getChatbotLanguage() {
    const pathname =
      window.location.pathname;

    const isEnglish =
      pathname === "/en" ||
      pathname === "/en/" ||
      pathname.startsWith("/en/");

    const isPortuguese =
      pathname === "/pt" ||
      pathname === "/pt/" ||
      pathname.startsWith("/pt/");

    if (isEnglish) {
      return "en";
    }

    if (isPortuguese) {
      return "pt";
    }

    return "el";
  }


  /* ---------------------------------------------------------
     KNOWLEDGE BASE FILE
  --------------------------------------------------------- */

  function getChatbotDataFile() {
    const language =
      getChatbotLanguage();

    switch (language) {

      case "en":
        return "/chatbot-data-en.js";

      case "pt":
        return "/chatbot-data-pt.js";

      default:
        return "/chatbot-data.js";

    }
  }


  /* ---------------------------------------------------------
     CSS
  --------------------------------------------------------- */

  function loadChatbotCSS() {

    if (
      document.querySelector(
        "#mh-chatbot-css"
      )
    ) {
      return;
    }


    const link =
      document.createElement("link");

    link.id =
      "mh-chatbot-css";

    link.rel =
      "stylesheet";

    link.href =
      `/chatbot.css?v=${CHATBOT_VERSION}`;

    document.head.appendChild(
      link
    );
  }


  /* ---------------------------------------------------------
     SCRIPT LOADER
  --------------------------------------------------------- */

  function loadScript(src, id) {

    return new Promise(
      (resolve, reject) => {

        const existing =
          document.getElementById(id);


        if (existing) {
          existing.remove();
        }


        const script =
          document.createElement("script");

        script.id =
          id;

        script.src =
          `${src}?v=${CHATBOT_VERSION}`;

        script.async =
          false;


        script.onload = () => {

          console.log(
            `[Materia Chatbot] Loaded: ${src}`
          );

          resolve();
        };


        script.onerror = error => {

          console.error(
            `[Materia Chatbot] Failed to load: ${src}`,
            error
          );

          reject(
            new Error(
              `Failed to load ${src}`
            )
          );

        };


        document.body.appendChild(
          script
        );

      }
    );
  }


  /* ---------------------------------------------------------
     START
  --------------------------------------------------------- */

  async function startMateriaChatbot() {

    const language =
      getChatbotLanguage();

    const chatbotDataFile =
      getChatbotDataFile();


    console.log(
      "[Materia Chatbot] Loader started"
    );

    console.log(
      "[Materia Chatbot] Language:",
      language
    );

    console.log(
      "[Materia Chatbot] Data file:",
      chatbotDataFile
    );


    loadChatbotCSS();


    try {

      /* ---------------------------------------
         1. KNOWLEDGE BASE
      --------------------------------------- */

  window.MATERIA_CHATBOT_DATA =
  undefined;


/* ---------------------------------------
   LOAD KNOWLEDGE BASE
   If it fails, chatbot still starts
--------------------------------------- */

try {

  await loadScript(
    chatbotDataFile,
    "mh-chatbot-data-script"
  );

  console.log(
    "[Materia Chatbot] Knowledge base:",
    Array.isArray(
      window.MATERIA_CHATBOT_DATA
    )
      ? window.MATERIA_CHATBOT_DATA.length
      : 0,
    "entries"
  );

} catch (dataError) {

  console.warn(
    "[Materia Chatbot] Knowledge base unavailable. Continuing without it.",
    dataError
  );

  window.MATERIA_CHATBOT_DATA = [];

}


      /* ---------------------------------------
         2. CHATBOT
      --------------------------------------- */

      const existingChatbot =
        document.querySelector(
          ".mh-chatbot"
        );


      if (existingChatbot) {
        existingChatbot.remove();
      }


      await loadScript(
        "/chatbot.js",
        "mh-chatbot-main-script"
      );


      /* ---------------------------------------
         3. CHECK
      --------------------------------------- */

      window.setTimeout(
        () => {

          const chatbot =
            document.querySelector(
              ".mh-chatbot"
            );


          if (chatbot) {

            console.log(
              `[Materia Chatbot] ✓ Ready (${language.toUpperCase()})`
            );

          } else {

            console.error(
              "[Materia Chatbot] chatbot.js loaded but UI was not created."
            );

          }

        },
        100
      );


    } catch (error) {

      console.error(
        "[Materia Chatbot] Startup error:",
        error
      );

    }

  }


  /* ---------------------------------------------------------
     DOM READY
  --------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startMateriaChatbot,
      {
        once: true
      }
    );

  } else {

    startMateriaChatbot();

  }

})();
