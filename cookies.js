/* Materia Hub - Cookie consent + Google Analytics 4
   -------------------------------------------------
   1. Αντικατάστησε το G-XXXXXXXXXX με το πραγματικό GA4 Measurement ID.
   2. Πρόσθεσε πριν από το </body> σε κάθε σελίδα:
      <script defer src="cookies.js"></script>
   3. Μην προσθέσεις ξεχωριστό Google Analytics script στο <head>.
*/

(() => {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  const STORAGE_KEY = 'materia_cookie_consent';
  const STORAGE_VERSION = 1;
  const MAX_AGE_DAYS = 365;

  let analyticsLoaded = false;

  function readChoice() {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);

      if (!rawValue) {
        return null;
      }

      const savedValue = JSON.parse(rawValue);
      const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

      const hasInvalidShape =
        typeof savedValue !== 'object' ||
        savedValue === null ||
        typeof savedValue.timestamp !== 'number' ||
        typeof savedValue.analytics !== 'boolean';

      if (hasInvalidShape) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      const hasExpired =
        Date.now() - savedValue.timestamp > maxAge;

      const hasWrongVersion =
        savedValue.version !== STORAGE_VERSION;

      if (hasExpired || hasWrongVersion) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return savedValue.analytics;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function saveChoice(analyticsAllowed) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: STORAGE_VERSION,
          analytics: Boolean(analyticsAllowed),
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.warn(
        'Δεν ήταν δυνατή η αποθήκευση των προτιμήσεων cookies.',
        error
      );
    }
  }

  function hasValidMeasurementId() {
    return (
      /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) &&
      GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
    );
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];

    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
  }

  function updateAnalyticsConsent(isGranted) {
    ensureGtag();

    window.gtag('consent', 'update', {
      analytics_storage: isGranted
        ? 'granted'
        : 'denied',

      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  function loadAnalytics() {
    if (
      analyticsLoaded ||
      !hasValidMeasurementId()
    ) {
      return;
    }

    analyticsLoaded = true;

    ensureGtag();

    /*
     * Το tag δεν φορτώνεται πριν από συγκατάθεση.
     * Αρχικά δηλώνουμε denied και μετά granted,
     * πριν από την αρχικοποίηση του GA4.
     */
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    updateAnalyticsConsent(true);

    window.gtag('js', new Date());

    window.gtag(
      'config',
      GA_MEASUREMENT_ID,
      {
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      }
    );

    const analyticsScript =
      document.createElement('script');

    analyticsScript.async = true;

    analyticsScript.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_MEASUREMENT_ID);

    analyticsScript.onerror = () => {
      analyticsLoaded = false;

      console.warn(
        'Δεν ήταν δυνατή η φόρτωση του Google Analytics.'
      );
    };

    document.head.appendChild(
      analyticsScript
    );
  }

  function removeAnalyticsCookies() {
    const cookies =
      document.cookie.split(';');

    const hostname =
      window.location.hostname;

    const hostnameParts =
      hostname.split('.');

    const domains = new Set([
      '',
      hostname,
      `.${hostname}`
    ]);

    if (hostnameParts.length >= 2) {
      domains.add(
        `.${hostnameParts.slice(-2).join('.')}`
      );
    }

    cookies.forEach((cookie) => {
      const cookieName =
        cookie.split('=')[0].trim();

      const isGoogleAnalyticsCookie =
        cookieName === '_ga' ||
        cookieName.startsWith('_ga_');

      if (!isGoogleAnalyticsCookie) {
        return;
      }

      domains.forEach((domain) => {
        const domainAttribute = domain
          ? `; domain=${domain}`
          : '';

        document.cookie =
          `${cookieName}=; ` +
          `Max-Age=0; ` +
          `path=/` +
          `${domainAttribute}; ` +
          `SameSite=Lax`;

        document.cookie =
          `${cookieName}=; ` +
          `expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
          `path=/` +
          `${domainAttribute}; ` +
          `SameSite=Lax`;
      });
    });
  }

  function grantAnalytics() {
    saveChoice(true);

    if (analyticsLoaded) {
      updateAnalyticsConsent(true);
    } else {
      loadAnalytics();
    }
  }

  function denyAnalytics() {
    saveChoice(false);

    /*
     * Αν το GA4 είχε φορτωθεί από προηγούμενη αποδοχή,
     * ενημερώνεται άμεσα ότι η συγκατάθεση ανακλήθηκε.
     */
    if (
      typeof window.gtag === 'function'
    ) {
      updateAnalyticsConsent(false);
    }

    removeAnalyticsCookies();
  }

  const bannerStyles = `
    .mh-cookie-banner {
      position: fixed;
      z-index: 9999;
      left: 20px;
      right: 20px;
      bottom: 20px;
      max-width: 720px;
      margin: auto;
      padding: 24px;
      color: #ffffff;
      background: #101112;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 4px solid #8c131b;
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
      font-family: Manrope, Arial, sans-serif;
    }

    .mh-cookie-banner h2 {
      margin: 0 0 10px;
      font-family: Montserrat, Arial, sans-serif;
      font-size: 22px;
      font-weight: 600;
    }

    .mh-cookie-banner p {
      margin: 0;
      color: rgba(255, 255, 255, 0.72);
      font-size: 14px;
      line-height: 1.7;
    }

    .mh-cookie-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }

    .mh-cookie-actions button,
    .mh-cookie-actions a {
      min-height: 42px;
      padding: 11px 16px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      font-family: Manrope, Arial, sans-serif;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    .mh-cookie-accept {
      color: #ffffff;
      background: #8c131b;
      border-color: #8c131b !important;
    }

    .mh-cookie-reject {
      color: #ffffff;
      background: transparent;
    }

    .mh-cookie-info {
      display: inline-flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.76);
    }

    @media (max-width: 600px) {
      .mh-cookie-banner {
        left: 10px;
        right: 10px;
        bottom: 10px;
        padding: 20px;
      }

      .mh-cookie-actions > * {
        width: 100%;
        justify-content: center;
        text-align: center;
      }
    }
  `;

  function createBanner() {
    const existingBanner =
      document.querySelector(
        '.mh-cookie-banner'
      );

    if (existingBanner) {
      return;
    }

    if (
      !document.getElementById(
        'mh-cookie-style'
      )
    ) {
      const styleElement =
        document.createElement('style');

      styleElement.id =
        'mh-cookie-style';

      styleElement.textContent =
        bannerStyles;

      document.head.appendChild(
        styleElement
      );
    }

    const banner =
      document.createElement('section');

    banner.className =
      'mh-cookie-banner';

    banner.setAttribute(
      'role',
      'dialog'
    );

    banner.setAttribute(
      'aria-modal',
      'true'
    );

    banner.setAttribute(
      'aria-labelledby',
      'mh-cookie-title'
    );

    banner.setAttribute(
      'aria-describedby',
      'mh-cookie-description'
    );

    banner.innerHTML = `
      <h2 id="mh-cookie-title">
        Ρυθμίσεις cookies
      </h2>

      <p id="mh-cookie-description">
        Χρησιμοποιούμε απαραίτητα μέσα αποθήκευσης και,
        μόνο με τη συγκατάθεσή σας, Google Analytics 4
        για στατιστικά επισκεψιμότητας.
      </p>

      <div class="mh-cookie-actions">
        <button
          class="mh-cookie-accept"
          type="button"
        >
          Αποδοχή στατιστικών
        </button>

        <button
          class="mh-cookie-reject"
          type="button"
        >
          Μόνο απαραίτητα
        </button>

        <a
          class="mh-cookie-info"
          href="cookie-policy.html"
        >
          Πολιτική Cookies
        </a>
      </div>
    `;

    document.body.appendChild(
      banner
    );

    const acceptButton =
      banner.querySelector(
        '.mh-cookie-accept'
      );

    const rejectButton =
      banner.querySelector(
        '.mh-cookie-reject'
      );

    acceptButton.addEventListener(
      'click',
      () => {
        grantAnalytics();
        banner.remove();
      }
    );

    rejectButton.addEventListener(
      'click',
      () => {
        denyAnalytics();
        banner.remove();
      }
    );

    acceptButton.focus();
  }

  function openSettings() {
    /*
     * Δεν διαγράφουμε αμέσως την προηγούμενη επιλογή.
     * Η επιλογή αλλάζει μόνο όταν ο χρήστης πατήσει
     * ένα από τα δύο κουμπιά.
     */
    createBanner();
  }

  document.addEventListener(
    'click',
    (event) => {
      const settingsButton =
        event.target.closest(
          '[data-cookie-settings]'
        );

      if (!settingsButton) {
        return;
      }

      event.preventDefault();
      openSettings();
    }
  );

  const savedChoice = readChoice();

  if (savedChoice === true) {
    loadAnalytics();
  } else if (savedChoice === false) {
    removeAnalyticsCookies();
  } else if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      createBanner,
      { once: true }
    );
  } else {
    createBanner();
  }

  window.MateriaCookieConsent = {
    openSettings
  };
})();
