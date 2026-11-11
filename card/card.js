/* =========================================================
   MATERIA HUB — EVA DIGITAL BUSINESS CARD
   ========================================================= */

const CONFIG = {

  name: 'Eva Kritikopoulou',

  role: 'Commercial Director / Interior Architect',

  /* Personal mobile */
  phone: '+306932901148',
  phoneDisplay: '+30 693 2901 148',

  /* Office phone */
  officePhone: '+302106232650',
  officePhoneDisplay: '+30 210 6232 650',

  /* Email */
  email: 'info@materiahub.gr',

  /* Website */
  website: 'https://www.materiahub.gr/',



  /* WhatsApp */
  whatsapp: '306932901148',

  /* LinkedIn */
  linkedin:
    'https://gr.linkedin.com/in/eva-kritikopoulou-b397a965',

  /* Images */
  photo:
    '/images/eva.webp',

  cover:
    '/images/architect.webp',

  /* Contact file */
  vcard:
    'contact.vcf'
};


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector) =>
  document.querySelector(selector);


function setText(selector, value) {

  const element = $(selector);

  if (
    element &&
    value
  ) {
    element.textContent = value;
  }

}


function setHref(selector, value) {

  const element = $(selector);

  if (
    element &&
    value
  ) {
    element.href = value;
  }

}


/* =========================================================
   IMAGES
   ========================================================= */

function setupImage(
  selector,
  source,
  alt = ''
) {

  const image =
    $(selector);

  if (!image) {
    return;
  }

  image.src =
    source;

  if (alt) {
    image.alt =
      alt;
  }

  image.addEventListener(
    'error',
    () => {

      image.classList.add(
        'is-missing'
      );

    },
    {
      once: true
    }
  );

}


/* =========================================================
   INITIALISE CARD
   ========================================================= */

function initCard() {


  /* Identity */

  setText(
    '#cardName',
    CONFIG.name
  );

  setText(
    '#cardRole',
    CONFIG.role
  );


  /* Personal phone */

  setHref(
    '#callAction',
    `tel:${CONFIG.phone}`
  );


  /* SMS */

  setHref(
    '#smsAction',
    `sms:${CONFIG.phone}`
  );




  /* Email */

  setHref(
    '#emailAction',
    `mailto:${CONFIG.email}`
  );


  /* Website */

  setHref(
    '#websiteAction',
    CONFIG.website
  );


  /* Maps */

  setHref(
    '#mapAction',
    CONFIG.maps
  );

  setText(
    '#addressLabel',
    CONFIG.address
  );


  /* Contact */

  setHref(
    '#saveAction',
    CONFIG.vcard
  );


  /* WhatsApp */

  const whatsapp =
    $('#whatsappAction');

  if (whatsapp) {

    if (
      CONFIG.whatsapp
    ) {

      whatsapp.href =
        `https://wa.me/${CONFIG.whatsapp}`;

      whatsapp.hidden =
        false;

    } else {

      whatsapp.hidden =
        true;

    }

  }


  /* LinkedIn */

  const linkedin =
    $('#linkedinAction');

  if (linkedin) {

    if (
      CONFIG.linkedin
    ) {

      linkedin.href =
        CONFIG.linkedin;

      linkedin.hidden =
        false;

    } else {

      linkedin.hidden =
        true;

    }

  }


  /* Images */

  setupImage(
    '#profilePhoto',
    CONFIG.photo,
    CONFIG.name
  );

  setupImage(
    '#coverPhoto',
    CONFIG.cover
  );


  /* Share */

  const shareButton =
    $('#shareAction');

  if (
    shareButton
  ) {

    shareButton.addEventListener(
      'click',
      shareCard
    );

  }

}


/* =========================================================
   SHARE
   ========================================================= */

async function shareCard() {

  const shareData = {

    title:
      `${CONFIG.name} | Materia Hub`,

    text:
      `${CONFIG.name}
${CONFIG.role}
Materia Hub`,

    url:
      window.location.href

  };


  try {

    if (
      navigator.share
    ) {

      await navigator.share(
        shareData
      );

      return;

    }

    await copyCardLink();

  } catch (error) {

    if (
      error?.name !==
      'AbortError'
    ) {

      await copyCardLink();

    }

  }

}


/* =========================================================
   COPY LINK FALLBACK
   ========================================================= */

async function copyCardLink() {

  try {

    await navigator.clipboard.writeText(
      window.location.href
    );

    showToast(
      'Το link της κάρτας αντιγράφηκε.'
    );

  } catch (error) {

    const textarea =
      document.createElement(
        'textarea'
      );

    textarea.value =
      window.location.href;

    textarea.setAttribute(
      'readonly',
      ''
    );

    textarea.style.position =
      'fixed';

    textarea.style.left =
      '-9999px';

    textarea.style.opacity =
      '0';

    document.body.appendChild(
      textarea
    );

    textarea.select();

    document.execCommand(
      'copy'
    );

    textarea.remove();

    showToast(
      'Το link της κάρτας αντιγράφηκε.'
    );

  }

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(message) {

  const toast =
    $('#toast');

  if (
    !toast
  ) {
    return;
  }

  toast.textContent =
    message;

  toast.classList.add(
    'is-visible'
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          'is-visible'
        );

      },
      2200
    );

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  initCard
);
