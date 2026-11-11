/* =========================================================
   MATERIA HUB CHATBOT
   Rule-based B2B product & specification assistant
   ---------------------------------------------------------
   - No dependencies
   - Uses the existing .mh-chatbot-* CSS classes
   - Supports EL / EN / PT based on pathname
   - Uses window.MATERIA_CHATBOT_DATA when available
   - Guided decision tree + free-text fallback
   - Product links + Project Enquiry / phone / email CTAs
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const CONFIG = {
    phoneDisplay: "+30 210 6232650",
    phoneHref: "tel:+302106232650",
    email: "info@materiahub.gr",
    maxRecommendations: 3,
    debug: false
  };

  const PRODUCT_URLS = {
    lvt: "https://www.forbo.com/flooring/en-gl/products/luxury-vinyl-tiles/cn7qf2",
    acoustic: "https://www.forbo.com/flooring/en-gl/products/acoustic-flooring/cknwc5",
    flotex: "https://www.forbo.com/flooring/en-gl/products/flotex-flocked-flooring/cv1uvf",
    entrance: "https://www.forbo.com/flooring/en-gl/products/entrance-flooring-systems/c7fkpg",
    carpet: "https://www.forbo.com/flooring/en-gl/products/carpet-tiles/cs1lhi",
    linoleum: "https://www.forbo.com/flooring/en-gl/products/linoleum/cmlack",
    safety: "https://www.forbo.com/flooring/en-gl/products/safety-flooring/cmpexr",
    custom: "https://www.forbo.com/flooring/en-gl/products/custom-bespoke-design/cfl973",
    rail: "https://www.forbo.com/transport/en/transport-floor-coverings/rail-floor-coverings/cevsmz"
  };

  const PRODUCT_ORDER = [
    "lvt",
    "acoustic",
    "flotex",
    "entrance",
    "carpet",
    "linoleum",
    "safety",
    "custom",
    "rail"
  ];

  /* =========================================================
     LANGUAGE
  ========================================================= */

  function getLanguage() {
    const pathname = window.location.pathname;

    if (
      pathname === "/en" ||
      pathname === "/en/" ||
      pathname.startsWith("/en/")
    ) {
      return "en";
    }

    if (
      pathname === "/pt" ||
      pathname === "/pt/" ||
      pathname.startsWith("/pt/")
    ) {
      return "pt";
    }

    return "el";
  }

  function getLanguageRoot(language) {
    if (language === "en") return "/en/";
    if (language === "pt") return "/pt/";
    return "/";
  }

  const lang = getLanguage();
  const languageRoot = getLanguageRoot(lang);

  /* =========================================================
     COPY
  ========================================================= */

  const COPY = {
    el: {
      launcher: "ΡΩΤΗΣΤΕ ΜΑΣ",
      eyebrow: "MATERIA HUB",
      heading: "Σύμβουλος έργου",
      online: "ONLINE",
      close: "Κλείσιμο chatbot",
      inputPlaceholder: "Γράψτε την ερώτησή σας...",
      send: "Αποστολή",
      footer: "ΕΝΔΕΙΚΤΙΚΗ ΚΑΘΟΔΗΓΗΣΗ · Η ΤΕΛΙΚΗ ΠΡΟΔΙΑΓΡΑΦΗ ΓΙΝΕΤΑΙ ΑΠΟ ΤΗ MATERIA HUB",

      welcome:
        "Γεια σας! Μπορώ να σας βοηθήσω να βρείτε την κατάλληλη λύση δαπέδου για το έργο σας. Μπορείτε να ακολουθήσετε τη σύντομη καθοδήγηση ή να μου γράψετε τι ακριβώς χρειάζεστε.",

      homePrompt: "Πώς θέλετε να ξεκινήσουμε;",
      home: "Αρχικό μενού",
      back: "Πίσω",
      restart: "Νέα αναζήτηση",

      homeActions: {
        guided: "Βρες λύση για τον χώρο μου",
        products: "Δείτε όλα τα προϊόντα",
        acoustic: "Χρειάζομαι ακουστικό δάπεδο",
        safety: "Χρειάζομαι αντιολισθητικό δάπεδο",
        sustainable: "Ψάχνω βιώσιμη λύση",
        technical: "Προδιαγραφές / BIM / EPD",
        samples: "Θέλω δείγμα υλικού",
        contact: "Μίλησε με σύμβουλο"
      },

      spacesQuestion: "Για τι είδους χώρο πρόκειται;",
      spaces: {
        office: "Γραφεία",
        banking: "Τράπεζα / χρηματοοικονομικός χώρος",
        healthcare: "Healthcare / νοσοκομείο",
        education: "Σχολείο / εκπαίδευση",
        hospitality: "Ξενοδοχείο / hospitality",
        retail: "Κατάστημα / retail",
        public: "Δημόσιο κτίριο",
        transport: "Μεταφορές / rail",
        other: "Άλλος επαγγελματικός χώρος"
      },

      needQuestion: "Ποια είναι η βασική απαίτηση του έργου;",
      needs: {
        acoustic: "Ακουστική άνεση",
        safety: "Αντιολισθητικότητα / ασφάλεια",
        highTraffic: "Υψηλή κυκλοφορία / αντοχή",
        quickInstall: "Γρήγορη εγκατάσταση / μικρό downtime",
        sustainable: "Βιωσιμότητα / φυσικά υλικά",
        design: "Design / αισθητική",
        easyClean: "Εύκολος καθαρισμός / συντήρηση",
        entrance: "Λύση για είσοδο κτιρίου",
        custom: "Custom σχέδιο / logo",
        notSure: "Δεν είμαι σίγουρος"
      },

      aestheticQuestion: "Τι αισθητική ή αίσθηση προτιμάτε;",
      aesthetics: {
        woodStone: "Ξύλο / πέτρα / concrete look",
        textile: "Textile / carpet αίσθηση",
        natural: "Φυσικό / linoleum",
        custom: "Custom σχέδιο / branding",
        neutral: "Δεν έχω προτίμηση"
      },

      acousticQuestion: "Τι προτιμάτε για την ακουστική λύση;",
      acousticChoices: {
        max: "Μέγιστη ηχομείωση",
        woodStone: "LVT / ξύλο ή πέτρα",
        textile: "Textile / carpet",
        natural: "Φυσικό linoleum",
        noPreference: "Δεν έχω προτίμηση"
      },

      safetyQuestion: "Σε τι περιβάλλον χρειάζεται η αντιολισθητικότητα;",
      safetyChoices: {
        general: "Διάδρομοι / κοινόχρηστοι χώροι",
        spills: "Κουζίνα / έντονα spills",
        wetroom: "Wetroom / μπάνιο / αποδυτήρια",
        pool: "Πισίνα / spa / barefoot area",
        unknown: "Δεν είμαι σίγουρος"
      },

      stageQuestion: "Πρόκειται για νέο έργο ή ανακαίνιση;",
      stages: {
        new: "Νέο έργο",
        renovation: "Renovation / ανακαίνιση",
        live: "Αντικατάσταση με τον χώρο σε λειτουργία",
        unknown: "Δεν έχει αποφασιστεί"
      },

      sizeQuestion: "Πόσο μεγάλο είναι περίπου το έργο;",
      sizes: {
        small: "Έως 100 m²",
        medium: "100–500 m²",
        large: "500–1.000 m²",
        xlarge: "Πάνω από 1.000 m²",
        unknown: "Δεν γνωρίζω ακόμη"
      },

      recommendationIntro:
        "Με βάση τις απαντήσεις σας, θα ξεκινούσα από τις παρακάτω λύσεις:",

      recommendationDisclaimer:
        "Η πρόταση είναι ενδεικτική. Για τελική προδιαγραφή πρέπει να ελεγχθούν το υπόστρωμα, η χρήση, η κυκλοφορία, οι τεχνικές απαιτήσεις και ο τρόπος εφαρμογής.",

      highIntent:
        "Για έργο αυτής της κλίμακας αξίζει να το δει τεχνικός σύμβουλος ώστε να γίνει σωστή προδιαγραφή και επιλογή συστήματος.",

      productsPrompt: "Επιλέξτε κατηγορία προϊόντος:",
      productOpen: "Δείτε τα προϊόντα ↗",
      askSample: "Ζητήστε δείγμα",
      projectForm: "Στείλτε στοιχεία έργου",
      call: "Καλέστε μας",
      email: "Στείλτε email",
      guideMe: "Βοήθησέ με να επιλέξω",

      technicalMessage:
        "Η Materia Hub υποστηρίζει τεχνικές προδιαγραφές, λεπτομέρειες εφαρμογής, μελέτες και BIM, καθώς και EPD / documentation για έργα με απαιτήσεις βιωσιμότητας. Μπορούμε επίσης να βοηθήσουμε με value engineering και installation support.",

      technicalQuestion: "Τι χρειάζεστε;",

      technicalActions: {
        specification: "Τεχνική προδιαγραφή / BIM",
        sustainability: "EPD / BREEAM / LEED",
        value: "Value engineering",
        installation: "Installation support"
      },

      samplesMessage:
        "Μπορούμε να υποστηρίξουμε το έργο σας με δείγματα και mock-ups ώστε να αξιολογήσετε υφή, χρώμα και απόδοση πριν από την τελική επιλογή.",

      contactMessage:
        `Μπορείτε να μιλήσετε απευθείας με τη Materia Hub στο ${CONFIG.phoneDisplay}, να στείλετε email στο ${CONFIG.email} ή να χρησιμοποιήσετε τη φόρμα Project Enquiry.`,

      productSelected: "Επιλέξατε",

      railDirect:
        "Για rail projects υπάρχει εξειδικευμένο portfolio με συστήματα για σιδηροδρομικές εφαρμογές. Η συγκεκριμένη κατηγορία απαιτεί πάντα τεχνικό έλεγχο και επιβεβαίωση της κατάλληλης πιστοποίησης για το έργο.",

      freeTextFallback:
        "Δεν είμαι βέβαιος ότι κατάλαβα ακριβώς την απαίτηση. Μπορείτε να επιλέξετε μία από τις παρακάτω διαδρομές ή να μου γράψετε π.χ. «δάπεδο για γραφείο με ακουστική άνεση».",

      kbPrefix: "Βρήκα την παρακάτω πληροφορία:",

      noInput:
        "Γράψτε μια ερώτηση ή επιλέξτε μία από τις διαθέσιμες επιλογές."
    },

    en: {
      launcher: "ASK US",
      eyebrow: "MATERIA HUB",
      heading: "Project advisor",
      online: "ONLINE",
      close: "Close chatbot",
      inputPlaceholder: "Type your question...",
      send: "Send",
      footer: "INDICATIVE GUIDANCE · FINAL SPECIFICATION BY MATERIA HUB",

      welcome:
        "Hello! I can help you find a suitable flooring solution for your project. Follow the short guided path or type what you need.",

      homePrompt: "How would you like to start?",
      home: "Main menu",
      back: "Back",
      restart: "New search",

      homeActions: {
        guided: "Find a solution for my space",
        products: "Browse all products",
        acoustic: "I need acoustic flooring",
        safety: "I need slip-resistant flooring",
        sustainable: "I need a sustainable solution",
        technical: "Specifications / BIM / EPD",
        samples: "Request a material sample",
        contact: "Talk to an advisor"
      },

      spacesQuestion: "What type of space is the project for?",

      spaces: {
        office: "Offices",
        banking: "Banking / financial space",
        healthcare: "Healthcare / hospital",
        education: "School / education",
        hospitality: "Hotel / hospitality",
        retail: "Retail",
        public: "Public building",
        transport: "Transport / rail",
        other: "Other commercial space"
      },

      needQuestion: "What is the main project requirement?",

      needs: {
        acoustic: "Acoustic comfort",
        safety: "Slip resistance / safety",
        highTraffic: "High traffic / durability",
        quickInstall: "Fast installation / low downtime",
        sustainable: "Sustainability / natural materials",
        design: "Design / aesthetics",
        easyClean: "Easy cleaning / maintenance",
        entrance: "Building entrance solution",
        custom: "Custom design / logo",
        notSure: "I'm not sure"
      },

      aestheticQuestion: "Which look or feel do you prefer?",

      aesthetics: {
        woodStone: "Wood / stone / concrete look",
        textile: "Textile / carpet feel",
        natural: "Natural / linoleum",
        custom: "Custom design / branding",
        neutral: "No preference"
      },

      acousticQuestion:
        "What do you prefer for the acoustic solution?",

      acousticChoices: {
        max: "Maximum impact sound reduction",
        woodStone: "LVT / wood or stone look",
        textile: "Textile / carpet",
        natural: "Natural linoleum",
        noPreference: "No preference"
      },

      safetyQuestion: "Where is slip resistance required?",

      safetyChoices: {
        general: "Corridors / common areas",
        spills: "Kitchen / frequent spills",
        wetroom: "Wetroom / bathroom / changing room",
        pool: "Pool / spa / barefoot area",
        unknown: "I'm not sure"
      },

      stageQuestion: "Is this a new project or a renovation?",

      stages: {
        new: "New project",
        renovation: "Renovation",
        live: "Replacement while the space remains operational",
        unknown: "Not decided yet"
      },

      sizeQuestion: "Approximately how large is the project?",

      sizes: {
        small: "Up to 100 m²",
        medium: "100–500 m²",
        large: "500–1,000 m²",
        xlarge: "Over 1,000 m²",
        unknown: "Not known yet"
      },

      recommendationIntro:
        "Based on your answers, I would start with these solutions:",

      recommendationDisclaimer:
        "This is indicative guidance. Final specification should consider the subfloor, use, traffic, technical requirements and installation method.",

      highIntent:
        "For a project of this scale, a technical advisor should review the requirements and confirm the appropriate system specification.",

      productsPrompt: "Choose a product category:",
      productOpen: "View products ↗",
      askSample: "Request a sample",
      projectForm: "Send project details",
      call: "Call us",
      email: "Send email",
      guideMe: "Help me choose",

      technicalMessage:
        "Materia Hub supports technical specifications, application details, design studies and BIM, as well as EPD / documentation for projects with sustainability requirements. Value engineering and installation support are also available.",

      technicalQuestion: "What do you need?",

      technicalActions: {
        specification: "Technical specification / BIM",
        sustainability: "EPD / BREEAM / LEED",
        value: "Value engineering",
        installation: "Installation support"
      },

      samplesMessage:
        "We can support your project with samples and mock-ups so the design team can assess texture, colour and performance before final selection.",

      contactMessage:
        `You can contact Materia Hub directly on ${CONFIG.phoneDisplay}, email ${CONFIG.email}, or use the Project Enquiry form.`,

      productSelected: "Selected",

      railDirect:
        "For rail projects there is a dedicated portfolio for railway applications. This category should always be reviewed technically so the correct certification and system can be confirmed for the project.",

      freeTextFallback:
        "I'm not certain I understood the requirement. Choose one of the paths below, or type something like “flooring for an office with acoustic comfort”.",

      kbPrefix: "I found the following information:",

      noInput:
        "Type a question or choose one of the available options."
    },

    pt: {
      launcher: "PERGUNTE-NOS",
      eyebrow: "MATERIA HUB",
      heading: "Consultor de projeto",
      online: "ONLINE",
      close: "Fechar chatbot",
      inputPlaceholder: "Escreva a sua pergunta...",
      send: "Enviar",
      footer: "ORIENTAÇÃO INDICATIVA · ESPECIFICAÇÃO FINAL PELA MATERIA HUB",

      welcome:
        "Olá! Posso ajudar a encontrar uma solução de pavimento adequada ao seu projeto. Siga o percurso guiado ou escreva o que procura.",

      homePrompt: "Como pretende começar?",
      home: "Menu principal",
      back: "Voltar",
      restart: "Nova pesquisa",

      homeActions: {
        guided: "Encontrar solução para o meu espaço",
        products: "Ver todos os produtos",
        acoustic: "Preciso de pavimento acústico",
        safety: "Preciso de pavimento antiderrapante",
        sustainable: "Procuro uma solução sustentável",
        technical: "Especificações / BIM / EPD",
        samples: "Pedir amostra de material",
        contact: "Falar com um consultor"
      },

      spacesQuestion: "Para que tipo de espaço é o projeto?",

      spaces: {
        office: "Escritórios",
        banking: "Banco / espaço financeiro",
        healthcare: "Saúde / hospital",
        education: "Escola / educação",
        hospitality: "Hotel / hospitality",
        retail: "Retalho",
        public: "Edifício público",
        transport: "Transportes / ferroviário",
        other: "Outro espaço comercial"
      },

      needQuestion: "Qual é o principal requisito do projeto?",

      needs: {
        acoustic: "Conforto acústico",
        safety: "Antiderrapante / segurança",
        highTraffic: "Tráfego intenso / durabilidade",
        quickInstall: "Instalação rápida / pouco downtime",
        sustainable: "Sustentabilidade / materiais naturais",
        design: "Design / estética",
        easyClean: "Limpeza / manutenção fácil",
        entrance: "Solução para entrada do edifício",
        custom: "Design personalizado / logótipo",
        notSure: "Não tenho a certeza"
      },

      aestheticQuestion: "Que estética ou sensação prefere?",

      aesthetics: {
        woodStone: "Madeira / pedra / betão",
        textile: "Sensação têxtil / alcatifa",
        natural: "Natural / linóleo",
        custom: "Design personalizado / branding",
        neutral: "Sem preferência"
      },

      acousticQuestion:
        "O que prefere para a solução acústica?",

      acousticChoices: {
        max: "Máxima redução de ruído de impacto",
        woodStone: "LVT / madeira ou pedra",
        textile: "Têxtil / alcatifa",
        natural: "Linóleo natural",
        noPreference: "Sem preferência"
      },

      safetyQuestion:
        "Onde é necessária a resistência ao deslizamento?",

      safetyChoices: {
        general: "Corredores / áreas comuns",
        spills: "Cozinha / derrames frequentes",
        wetroom: "Zona húmida / casa de banho / balneário",
        pool: "Piscina / spa / área descalça",
        unknown: "Não tenho a certeza"
      },

      stageQuestion:
        "É um projeto novo ou uma renovação?",

      stages: {
        new: "Projeto novo",
        renovation: "Renovação",
        live: "Substituição com o espaço em funcionamento",
        unknown: "Ainda não decidido"
      },

      sizeQuestion:
        "Qual é aproximadamente a dimensão do projeto?",

      sizes: {
        small: "Até 100 m²",
        medium: "100–500 m²",
        large: "500–1.000 m²",
        xlarge: "Mais de 1.000 m²",
        unknown: "Ainda não sei"
      },

      recommendationIntro:
        "Com base nas respostas, começaria por estas soluções:",

      recommendationDisclaimer:
        "Esta orientação é indicativa. A especificação final deve considerar suporte, utilização, tráfego, requisitos técnicos e método de instalação.",

      highIntent:
        "Para um projeto desta dimensão, recomenda-se a análise por um consultor técnico para confirmar a especificação adequada.",

      productsPrompt: "Escolha uma categoria de produto:",
      productOpen: "Ver produtos ↗",
      askSample: "Pedir amostra",
      projectForm: "Enviar dados do projeto",
      call: "Ligar",
      email: "Enviar email",
      guideMe: "Ajude-me a escolher",

      technicalMessage:
        "A Materia Hub apoia especificações técnicas, detalhes de aplicação, estudos e BIM, assim como EPD / documentação para projetos com requisitos de sustentabilidade. Também disponibiliza value engineering e apoio à instalação.",

      technicalQuestion: "O que necessita?",

      technicalActions: {
        specification: "Especificação técnica / BIM",
        sustainability: "EPD / BREEAM / LEED",
        value: "Value engineering",
        installation: "Apoio à instalação"
      },

      samplesMessage:
        "Podemos apoiar o projeto com amostras e mock-ups para avaliar textura, cor e desempenho antes da seleção final.",

      contactMessage:
        `Pode contactar diretamente a Materia Hub através do ${CONFIG.phoneDisplay}, por email para ${CONFIG.email}, ou pelo formulário Project Enquiry.`,

      productSelected: "Selecionado",

      railDirect:
        "Para projetos ferroviários existe um portefólio dedicado. Esta categoria deve ser sempre validada tecnicamente para confirmar a certificação e o sistema adequados ao projeto.",

      freeTextFallback:
        "Não tenho a certeza de ter entendido o requisito. Escolha um dos percursos abaixo ou escreva, por exemplo, “pavimento para escritório com conforto acústico”.",

      kbPrefix: "Encontrei a seguinte informação:",

      noInput:
        "Escreva uma pergunta ou escolha uma das opções disponíveis."
    }
  };

  const t = COPY[lang] || COPY.el;

  /* =========================================================
     PRODUCTS
  ========================================================= */

  const PRODUCTS = {
    lvt: {
      title: "Luxury Vinyl Tiles (Allura)",
      url: PRODUCT_URLS.lvt,
      descriptions: {
        el:
          "LVT για επαγγελματικούς χώρους με μεγάλη ελευθερία design. Υπάρχουν fully-adhered, loose-lay, click/puzzle και acoustic επιλογές, όπως Allura Decibel.",

        en:
          "Commercial LVT with broad design freedom. The range includes fully-adhered, loose-lay, click/puzzle and acoustic options such as Allura Decibel.",

        pt:
          "LVT comercial com ampla liberdade de design. Inclui opções coladas, loose-lay, click/puzzle e acústicas, como Allura Decibel."
      }
    },

    acoustic: {
      title: "Acoustic Flooring",
      url: PRODUCT_URLS.acoustic,
      descriptions: {
        el:
          "Ακουστικά vinyl και linoleum με μείωση impact sound έως 19 dB. Περιλαμβάνει Sarlon, Modul'up 19 dB χωρίς κόλλα, acoustic Marmoleum και Allura Decibel.",

        en:
          "Acoustic vinyl and linoleum with impact sound reduction up to 19 dB, including Sarlon, adhesive-free Modul'up 19 dB, acoustic Marmoleum and Allura Decibel.",

        pt:
          "Vinil e linóleo acústicos com redução de ruído de impacto até 19 dB, incluindo Sarlon, Modul'up 19 dB sem adesivo, Marmoleum acústico e Allura Decibel."
      }
    },

    flotex: {
      title: "Flotex Flooring",
      url: PRODUCT_URLS.flotex,
      descriptions: {
        el:
          "Υψηλής απόδοσης flocked/textile δάπεδο που συνδυάζει άνεση και design με αντοχή και εύκολη συντήρηση. Διατίθεται και σε custom σχέδια.",

        en:
          "High-performance flocked/textile flooring combining comfort and design with durability and easy maintenance, with custom design possibilities.",

        pt:
          "Pavimento flocado/têxtil de alto desempenho que combina conforto e design com durabilidade e manutenção simples, incluindo opções personalizadas."
      }
    },

    entrance: {
      title: "Entrance Flooring Systems",
      url: PRODUCT_URLS.entrance,
      descriptions: {
        el:
          "Συστήματα εισόδου για συγκράτηση βρωμιάς και υγρασίας, προστασία των εσωτερικών δαπέδων και μείωση κινδύνου ολίσθησης. Περιλαμβάνει λύσεις Coral και Nuway.",

        en:
          "Entrance systems designed to stop dirt and moisture, protect interior flooring and help reduce slip risk, including Coral and Nuway solutions.",

        pt:
          "Sistemas de entrada para reter sujidade e humidade, proteger os pavimentos interiores e ajudar a reduzir o risco de escorregamento, incluindo Coral e Nuway."
      }
    },

    carpet: {
      title: "Carpet Tiles (Tessera)",
      url: PRODUCT_URLS.carpet,
      descriptions: {
        el:
          "Αρθρωτές carpet tiles για επαγγελματικούς χώρους, με έμφαση σε άνεση, ακουστική, συντήρηση και δημιουργικό σχεδιασμό.",

        en:
          "Modular carpet tiles for commercial spaces, focused on comfort, acoustics, maintenance and creative design.",

        pt:
          "Placas de alcatifa modulares para espaços comerciais, com foco em conforto, acústica, manutenção e design criativo."
      }
    },

    linoleum: {
      title: "Linoleum / Marmoleum",
      url: PRODUCT_URLS.linoleum,
      descriptions: {
        el:
          "Λύσεις Marmoleum με φυσικά χαρακτηριστικά και μεγάλη γκάμα αισθητικής και τεχνικών εκδόσεων, όπως acoustic, R10 και FR.",

        en:
          "Marmoleum solutions with natural characteristics and a broad range of design and technical options, including acoustic, R10 and FR versions.",

        pt:
          "Soluções Marmoleum com características naturais e ampla gama estética e técnica, incluindo versões acústicas, R10 e FR."
      }
    },

    safety: {
      title: "Safety Flooring",
      url: PRODUCT_URLS.safety,
      descriptions: {
        el:
          "Αντιολισθητικά δάπεδα για διαφορετικά επίπεδα κινδύνου: Surestep R10, Safestep R11/R12 και ειδικές λύσεις Wetroom.",

        en:
          "Slip-resistant flooring for different risk levels: Surestep R10, Safestep R11/R12 and dedicated Wetroom solutions.",

        pt:
          "Pavimentos antiderrapantes para diferentes níveis de risco: Surestep R10, Safestep R11/R12 e soluções específicas Wetroom."
      }
    },

    custom: {
      title: "Custom & Bespoke Design",
      url: PRODUCT_URLS.custom,
      descriptions: {
        el:
          "Εξατομικευμένα δάπεδα με custom γραφικά, logos και σχεδιαστικές εφαρμογές για έργα όπου το branding ή η ιδιαίτερη αισθητική είναι βασική απαίτηση.",

        en:
          "Bespoke flooring with custom graphics, logos and design applications for projects where branding or a unique visual identity is important.",

        pt:
          "Pavimentos personalizados com gráficos, logótipos e aplicações especiais para projetos em que o branding ou a identidade visual são importantes."
      }
    },

    rail: {
      title: "Rail Floor Coverings",
      url: PRODUCT_URLS.rail,
      descriptions: {
        el:
          "Εξειδικευμένο portfolio για rail εφαρμογές. Η Forbo αναφέρει πιστοποίηση κατά EN 45545-2 με ελάχιστη κλάση HL2 για τη συγκεκριμένη κατηγορία.",

        en:
          "Dedicated portfolio for rail applications. Forbo states certification to EN 45545-2 with a minimum HL2 rating for this category.",

        pt:
          "Portefólio dedicado a aplicações ferroviárias. A Forbo indica certificação EN 45545-2 com classificação mínima HL2 para esta categoria."
      }
    }
  };

  /* =========================================================
     STATE
  ========================================================= */

  const state = {
    flow: "home",
    answers: {},
    lastRecommendations: [],
    lastProduct: null
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  function log(...args) {
    if (CONFIG.debug) {
      console.log("[Materia Chatbot]", ...args);
    }
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase("el")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9α-ωάέήίόύώϊϋΐΰ\s]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(value) {
    return normalizeText(value)
      .split(" ")
      .filter(token => token.length > 1);
  }

  function localizedProductDescription(productKey) {
    const product = PRODUCTS[productKey];

    if (!product) {
      return "";
    }

    return (
      product.descriptions[lang] ||
      product.descriptions.en ||
      ""
    );
  }

  function setAnswer(key, value) {
    state.answers[key] = value;
  }

  function resetState() {
    state.flow = "home";
    state.answers = {};
    state.lastRecommendations = [];
    state.lastProduct = null;
  }

  function getProjectContextText() {
    const parts = [];

    if (
      state.answers.space &&
      t.spaces[state.answers.space]
    ) {
      parts.push(
        t.spaces[state.answers.space]
      );
    }

    if (
      state.answers.need &&
      t.needs[state.answers.need]
    ) {
      parts.push(
        t.needs[state.answers.need]
      );
    }

    if (
      state.answers.aesthetic &&
      t.aesthetics[state.answers.aesthetic]
    ) {
      parts.push(
        t.aesthetics[state.answers.aesthetic]
      );
    }

    if (
      state.answers.stage &&
      t.stages[state.answers.stage]
    ) {
      parts.push(
        t.stages[state.answers.stage]
      );
    }

    if (
      state.answers.size &&
      t.sizes[state.answers.size]
    ) {
      parts.push(
        t.sizes[state.answers.size]
      );
    }

    return parts.join(" · ");
  }

  function track(
    eventName,
    details = {}
  ) {
    const payload = {
      event: "materia_chatbot",
      chatbot_event: eventName,
      language: lang,
      ...details
    };

    try {
      window.dispatchEvent(
        new CustomEvent(
          "mh:chatbot",
          {
            detail: payload
          }
        )
      );
    } catch (error) {
      log(
        "CustomEvent unavailable",
        error
      );
    }

    if (
      Array.isArray(
        window.dataLayer
      )
    ) {
      window.dataLayer.push(
        payload
      );
    }
  }

  function externalOpen(url) {
    if (!url) {
      return;
    }

    track(
      "external_link",
      {
        url
      }
    );

    const newWindow =
      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    if (newWindow) {
      try {
        newWindow.opener = null;
      } catch (error) {
        log(error);
      }
    }
  }

  function navigateToProjectForm() {
    track(
      "project_enquiry_cta",
      {
        context:
          getProjectContextText(),

        recommendations:
          state.lastRecommendations.join(",")
      }
    );

    const currentPath =
      window.location.pathname.replace(
        /\/+$/,
        "/"
      );

    const targetPath =
      languageRoot.replace(
        /\/+$/,
        "/"
      );

    if (
      currentPath === targetPath
    ) {
      const projectSection =
        document.querySelector(
          "#project"
        );

      closeChatbot();

      if (projectSection) {
        projectSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        return;
      }
    }

    window.location.href =
      `${languageRoot}#project`;
  }

  function callMateria() {
    track(
      "phone_cta",
      {
        context:
          getProjectContextText()
      }
    );

    window.location.href =
      CONFIG.phoneHref;
  }

  function emailMateria() {
    track(
      "email_cta",
      {
        context:
          getProjectContextText()
      }
    );

    const subject =
      encodeURIComponent(
        lang === "el"
          ? "Ερώτημα έργου - Materia Hub"
          : lang === "pt"
            ? "Pedido de projeto - Materia Hub"
            : "Project enquiry - Materia Hub"
      );

    const context =
      getProjectContextText();

    const body =
      encodeURIComponent(
        context
          ? `${context}\n\n`
          : ""
      );

    window.location.href =
      `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  }

  /* =========================================================
     UI CREATION
  ========================================================= */

  const existing =
    document.querySelector(
      ".mh-chatbot"
    );

  if (existing) {
    existing.remove();
  }

  const root =
    document.createElement(
      "div"
    );

  root.className =
    "mh-chatbot";

  root.innerHTML = `
    <button
      class="mh-chatbot-launcher"
      type="button"
      aria-label="${escapeHTML(t.heading)}"
      aria-expanded="false"
      aria-controls="mh-chatbot-panel"
    >
      <span
        class="mh-chatbot-launcher-icon"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24">
          <path d="M4 5.75h16v10.5H9l-5 3.5v-14Z"></path>
          <path d="M8 10h8"></path>
          <path d="M8 13h5"></path>
        </svg>
      </span>

      <span
        class="mh-chatbot-launcher-label"
      >
        ${escapeHTML(t.launcher)}
      </span>
    </button>

    <section
      class="mh-chatbot-panel"
      id="mh-chatbot-panel"
      role="dialog"
      aria-modal="false"
      aria-label="${escapeHTML(t.heading)}"
    >

      <header
        class="mh-chatbot-header"
      >

        <div
          class="mh-chatbot-heading"
        >

          <span
            class="mh-chatbot-eyebrow"
          >
            ${escapeHTML(t.eyebrow)}
          </span>

          <strong>
            ${escapeHTML(t.heading)}
          </strong>

          <span
            class="mh-chatbot-status"
          >
            <i aria-hidden="true"></i>
            ${escapeHTML(t.online)}
          </span>

        </div>

        <button
          class="mh-chatbot-close"
          type="button"
          aria-label="${escapeHTML(t.close)}"
        >
          ×
        </button>

      </header>

      <div
        class="mh-chatbot-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      ></div>

      <div
        class="mh-chatbot-suggestions"
        hidden
      ></div>

      <div
        class="mh-chatbot-quick-actions"
      ></div>

      <form
        class="mh-chatbot-form"
      >

        <textarea
          class="mh-chatbot-input"
          rows="1"
          maxlength="700"
          placeholder="${escapeHTML(t.inputPlaceholder)}"
          aria-label="${escapeHTML(t.inputPlaceholder)}"
        ></textarea>

        <button
          class="mh-chatbot-send"
          type="submit"
          aria-label="${escapeHTML(t.send)}"
          title="${escapeHTML(t.send)}"
        >
          ↗
        </button>

      </form>

      <div
        class="mh-chatbot-footer"
      >
        ${escapeHTML(t.footer)}
      </div>

    </section>
  `;

  document.body.appendChild(
    root
  );

  const launcher =
    root.querySelector(
      ".mh-chatbot-launcher"
    );

  const panel =
    root.querySelector(
      ".mh-chatbot-panel"
    );

  const closeButton =
    root.querySelector(
      ".mh-chatbot-close"
    );

  const messages =
    root.querySelector(
      ".mh-chatbot-messages"
    );

  const actionsContainer =
    root.querySelector(
      ".mh-chatbot-quick-actions"
    );

  const suggestionsContainer =
    root.querySelector(
      ".mh-chatbot-suggestions"
    );

  const form =
    root.querySelector(
      ".mh-chatbot-form"
    );

  const input =
    root.querySelector(
      ".mh-chatbot-input"
    );

  let hasWelcomed = false;

  let actionRegistry =
    new Map();

  let suggestionRegistry =
    new Map();

  let actionId = 0;

  /* =========================================================
     UI HELPERS
  ========================================================= */

  function scrollMessages() {
    window.requestAnimationFrame(
      () => {
        messages.scrollTop =
          messages.scrollHeight;
      }
    );
  }

  function addMessage(
    content,
    type = "bot",
    options = {}
  ) {
    const wrapper =
      document.createElement(
        "div"
      );

    wrapper.className =
      `mh-chatbot-message mh-chatbot-message--${type}`;

    const bubble =
      document.createElement(
        "div"
      );

    bubble.className =
      "mh-chatbot-message-bubble";

    if (
      options.html === true
    ) {
      bubble.innerHTML =
        content;
    } else {
      bubble.textContent =
        content;
    }

    wrapper.appendChild(
      bubble
    );

    messages.appendChild(
      wrapper
    );

    scrollMessages();

    return wrapper;
  }

  function addBotMessage(
    content,
    options = {}
  ) {
    return addMessage(
      content,
      "bot",
      options
    );
  }

  function addUserMessage(
    content
  ) {
    return addMessage(
      content,
      "user"
    );
  }

  function clearActions() {
    actionsContainer.innerHTML =
      "";

    actionRegistry =
      new Map();
  }

  function clearSuggestions() {
    suggestionsContainer.innerHTML =
      "";

    suggestionsContainer.hidden =
      true;

    suggestionRegistry =
      new Map();
  }

  function registerAction(
    handler
  ) {
    actionId += 1;

    const id =
      `mh-action-${actionId}`;

    actionRegistry.set(
      id,
      handler
    );

    return id;
  }

  function setActions(
    actions
  ) {
    clearActions();

    actions.forEach(
      action => {
        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.textContent =
          action.label;

        const id =
          registerAction(
            () => {
              track(
                "quick_action",
                {
                  label:
                    action.label,

                  key:
                    action.key || ""
                }
              );

              if (
                action.userMessage !== false
              ) {
                addUserMessage(
                  action.userText ||
                  action.label
                );
              }

              if (
                typeof action.onClick ===
                "function"
              ) {
                action.onClick();
              }
            }
          );

        button.dataset.actionId =
          id;

        actionsContainer.appendChild(
          button
        );
      }
    );
  }

  function setSuggestions(
    suggestions
  ) {
    clearSuggestions();

    if (
      !suggestions.length
    ) {
      return;
    }

    suggestionsContainer.hidden =
      false;

    suggestions.forEach(
      suggestion => {
        actionId += 1;

        const id =
          `mh-suggestion-${actionId}`;

        suggestionRegistry.set(
          id,
          suggestion.onClick
        );

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "mh-chatbot-suggestion";

        button.textContent =
          suggestion.label;

        button.dataset.suggestionId =
          id;

        suggestionsContainer.appendChild(
          button
        );
      }
    );
  }

  function autoResizeInput() {
    input.style.height =
      "auto";

    input.style.height =
      `${Math.min(
        input.scrollHeight,
        120
      )}px`;
  }

  function openChatbot() {
    root.classList.add(
      "is-open"
    );

    launcher.setAttribute(
      "aria-expanded",
      "true"
    );

    track(
      "open"
    );

    if (
      !hasWelcomed
    ) {
      hasWelcomed =
        true;

      showHome(
        true
      );
    }

    window.setTimeout(
      () => input.focus(),
      120
    );
  }

  function closeChatbot() {
    root.classList.remove(
      "is-open"
    );

    launcher.setAttribute(
      "aria-expanded",
      "false"
    );

    track(
      "close"
    );

    launcher.focus();
  }

  /* =========================================================
     HOME / NAVIGATION
  ========================================================= */

  function homeActions() {
    return [
      {
        key: "guided",
        label:
          t.homeActions.guided,
        onClick:
          startGuidedFlow
      },

      {
        key: "products",
        label:
          t.homeActions.products,
        onClick:
          showProductMenu
      },

      {
        key:
          "acoustic_shortcut",

        label:
          t.homeActions.acoustic,

        onClick:
          () =>
            startGuidedWithNeed(
              "acoustic"
            )
      },

      {
        key:
          "safety_shortcut",

        label:
          t.homeActions.safety,

        onClick:
          () =>
            startGuidedWithNeed(
              "safety"
            )
      },

      {
        key:
          "sustainable_shortcut",

        label:
          t.homeActions.sustainable,

        onClick:
          () =>
            startGuidedWithNeed(
              "sustainable"
            )
      },

      {
        key: "technical",
        label:
          t.homeActions.technical,
        onClick:
          showTechnicalMenu
      },

      {
        key: "samples",
        label:
          t.homeActions.samples,
        onClick:
          showSamples
      },

      {
        key: "contact",
        label:
          t.homeActions.contact,
        onClick:
          showContact
      }
    ];
  }

  function showHome(
    includeWelcome = false
  ) {
    clearSuggestions();

    resetState();

    if (
      includeWelcome
    ) {
      addBotMessage(
        t.welcome
      );
    }

    addBotMessage(
      t.homePrompt
    );

    setActions(
      homeActions()
    );
  }

  function startGuidedFlow() {
    clearSuggestions();

    state.flow =
      "guided";

    state.answers =
      {};

    state.lastRecommendations =
      [];

    askSpace();
  }

  function startGuidedWithNeed(
    need
  ) {
    clearSuggestions();

    state.flow =
      "guided";

    state.answers = {
      need
    };

    state.lastRecommendations =
      [];

    askSpace();
  }

  function addHomeAction(
    actions
  ) {
    return [
      ...actions,

      {
        key: "home",
        label: t.home,
        userMessage: false,
        onClick:
          () =>
            showHome(false)
      }
    ];
  }

  /* =========================================================
     GUIDED FLOW
  ========================================================= */

  function askSpace() {
    addBotMessage(
      t.spacesQuestion
    );

    const spaceActions =
      Object.entries(
        t.spaces
      ).map(
        ([key, label]) => ({
          key:
            `space_${key}`,

          label,

          onClick:
            () =>
              handleSpace(
                key
              )
        })
      );

    setActions(
      addHomeAction(
        spaceActions
      )
    );
  }

  function handleSpace(
    space
  ) {
    setAnswer(
      "space",
      space
    );

    if (
      space === "transport"
    ) {
      state.lastRecommendations =
        ["rail"];

      addBotMessage(
        t.railDirect
      );

      showProductResult(
        "rail",
        {
          includeSelectedPrefix:
            false
        }
      );

      return;
    }

    if (
      state.answers.need
    ) {
      continueAfterNeed(
        state.answers.need
      );

      return;
    }

    askNeed();
  }

  function getNeedKeysForSpace(
    space
  ) {
    const common = [
      "acoustic",
      "safety",
      "highTraffic",
      "quickInstall",
      "sustainable",
      "design",
      "easyClean",
      "entrance",
      "custom",
      "notSure"
    ];

    const preferred = {
      office: [
        "acoustic",
        "design",
        "quickInstall",
        "sustainable",
        "highTraffic",
        "easyClean",
        "custom",
        "notSure"
      ],

      banking: [
        "design",
        "acoustic",
        "highTraffic",
        "quickInstall",
        "sustainable",
        "custom",
        "notSure"
      ],

      healthcare: [
        "safety",
        "easyClean",
        "acoustic",
        "sustainable",
        "highTraffic",
        "quickInstall",
        "notSure"
      ],

      education: [
        "acoustic",
        "highTraffic",
        "sustainable",
        "safety",
        "easyClean",
        "design",
        "notSure"
      ],

      hospitality: [
        "design",
        "acoustic",
        "custom",
        "highTraffic",
        "entrance",
        "safety",
        "easyClean",
        "notSure"
      ],

      retail: [
        "design",
        "highTraffic",
        "quickInstall",
        "entrance",
        "easyClean",
        "custom",
        "notSure"
      ],

      public: [
        "highTraffic",
        "safety",
        "acoustic",
        "sustainable",
        "entrance",
        "easyClean",
        "notSure"
      ],

      other:
        common
    };

    return (
      preferred[space] ||
      common
    );
  }

  function askNeed() {
    addBotMessage(
      t.needQuestion
    );

    const needKeys =
      getNeedKeysForSpace(
        state.answers.space
      );

    const needActions =
      needKeys.map(
        key => ({
          key:
            `need_${key}`,

          label:
            t.needs[key],

          onClick:
            () =>
              handleNeed(
                key
              )
        })
      );

    setActions(
      addHomeAction(
        needActions
      )
    );
  }

  function handleNeed(
    need
  ) {
    setAnswer(
      "need",
      need
    );

    continueAfterNeed(
      need
    );
  }

  function continueAfterNeed(
    need
  ) {
    if (
      need === "acoustic"
    ) {
      askAcousticPreference();
      return;
    }

    if (
      need === "safety"
    ) {
      askSafetyContext();
      return;
    }

    if (
      [
        "design",
        "easyClean",
        "highTraffic",
        "quickInstall",
        "custom",
        "notSure"
      ].includes(need)
    ) {
      askAesthetic();
      return;
    }

    askStage();
  }

  function askAesthetic() {
    addBotMessage(
      t.aestheticQuestion
    );

    const actions =
      Object.entries(
        t.aesthetics
      ).map(
        ([key, label]) => ({
          key:
            `aesthetic_${key}`,

          label,

          onClick:
            () => {
              setAnswer(
                "aesthetic",
                key
              );

              askStage();
            }
        })
      );

    setActions(
      addHomeAction(
        actions
      )
    );
  }

  function askAcousticPreference() {
    addBotMessage(
      t.acousticQuestion
    );

    const actions =
      Object.entries(
        t.acousticChoices
      ).map(
        ([key, label]) => ({
          key:
            `acoustic_${key}`,

          label,

          onClick:
            () => {
              setAnswer(
                "acousticPreference",
                key
              );

              if (
                key === "woodStone"
              ) {
                setAnswer(
                  "aesthetic",
                  "woodStone"
                );
              }

              if (
                key === "textile"
              ) {
                setAnswer(
                  "aesthetic",
                  "textile"
                );
              }

              if (
                key === "natural"
              ) {
                setAnswer(
                  "aesthetic",
                  "natural"
                );
              }

              askStage();
            }
        })
      );

    setActions(
      addHomeAction(
        actions
      )
    );
  }

  function askSafetyContext() {
    addBotMessage(
      t.safetyQuestion
    );

    const actions =
      Object.entries(
        t.safetyChoices
      ).map(
        ([key, label]) => ({
          key:
            `safety_${key}`,

          label,

          onClick:
            () => {
              setAnswer(
                "safetyContext",
                key
              );

              askStage();
            }
        })
      );

    setActions(
      addHomeAction(
        actions
      )
    );
  }

  function askStage() {
    addBotMessage(
      t.stageQuestion
    );

    const actions =
      Object.entries(
        t.stages
      ).map(
        ([key, label]) => ({
          key:
            `stage_${key}`,

          label,

          onClick:
            () => {
              setAnswer(
                "stage",
                key
              );

              askSize();
            }
        })
      );

    setActions(
      addHomeAction(
        actions
      )
    );
  }

  function askSize() {
    addBotMessage(
      t.sizeQuestion
    );

    const actions =
      Object.entries(
        t.sizes
      ).map(
        ([key, label]) => ({
          key:
            `size_${key}`,

          label,

          onClick:
            () => {
              setAnswer(
                "size",
                key
              );

              showRecommendations();
            }
        })
      );

    setActions(
      addHomeAction(
        actions
      )
    );
  }

  /* =========================================================
     RECOMMENDATION ENGINE
  ========================================================= */

  function createEmptyScores() {
    return PRODUCT_ORDER.reduce(
      (scores, key) => {
        scores[key] = 0;
        return scores;
      },
      {}
    );
  }

  function addScore(
    scores,
    key,
    amount
  ) {
    if (
      Object.prototype
        .hasOwnProperty.call(
          scores,
          key
        )
    ) {
      scores[key] +=
        amount;
    }
  }

  function scoreBySpace(
    scores,
    space
  ) {
    const matrix = {
      office: {
        acoustic: 7,
        carpet: 6,
        lvt: 6,
        flotex: 4,
        linoleum: 4
      },

      banking: {
        lvt: 7,
        carpet: 5,
        acoustic: 5,
        flotex: 4,
        linoleum: 3
      },

      healthcare: {
        safety: 8,
        acoustic: 6,
        linoleum: 6,
        flotex: 4,
        lvt: 3
      },

      education: {
        acoustic: 8,
        linoleum: 6,
        flotex: 5,
        safety: 4,
        carpet: 4,
        lvt: 3
      },

      hospitality: {
        lvt: 7,
        flotex: 7,
        carpet: 6,
        custom: 5,
        entrance: 4,
        acoustic: 4
      },

      retail: {
        lvt: 8,
        flotex: 5,
        entrance: 5,
        custom: 4,
        safety: 3,
        carpet: 3
      },

      public: {
        safety: 6,
        acoustic: 6,
        linoleum: 6,
        entrance: 5,
        flotex: 4,
        lvt: 4
      },

      transport: {
        rail: 20
      },

      other: {
        lvt: 3,
        acoustic: 3,
        linoleum: 3,
        flotex: 3,
        carpet: 3
      }
    };

    Object.entries(
      matrix[space] ||
      matrix.other
    ).forEach(
      ([key, amount]) => {
        addScore(
          scores,
          key,
          amount
        );
      }
    );
  }

  function scoreByNeed(
    scores,
    need
  ) {
    const matrix = {
      acoustic: {
        acoustic: 18,
        lvt: 6,
        carpet: 5,
        flotex: 5,
        linoleum: 5
      },

      safety: {
        safety: 24
      },

      highTraffic: {
        lvt: 9,
        flotex: 9,
        carpet: 6,
        safety: 5,
        linoleum: 5,
        entrance: 4
      },

      quickInstall: {
        acoustic: 9,
        lvt: 9,
        carpet: 3,
        linoleum: 2
      },

      sustainable: {
        linoleum: 18,
        lvt: 4,
        carpet: 3,
        flotex: 3
      },

      design: {
        lvt: 12,
        flotex: 8,
        carpet: 8,
        custom: 7,
        linoleum: 4
      },

      easyClean: {
        lvt: 10,
        flotex: 8,
        linoleum: 7,
        safety: 6
      },

      entrance: {
        entrance: 24
      },

      custom: {
        custom: 24,
        flotex: 6
      },

      notSure: {
        lvt: 3,
        acoustic: 3,
        linoleum: 3,
        flotex: 3,
        carpet: 3
      }
    };

    Object.entries(
      matrix[need] || {}
    ).forEach(
      ([key, amount]) => {
        addScore(
          scores,
          key,
          amount
        );
      }
    );
  }

  function scoreByAesthetic(
    scores,
    aesthetic
  ) {
    const matrix = {
      woodStone: {
        lvt: 15,
        acoustic: 5
      },

      textile: {
        flotex: 13,
        carpet: 13,
        acoustic: 3
      },

      natural: {
        linoleum: 16,
        acoustic: 4
      },

      custom: {
        custom: 16,
        flotex: 6
      },

      neutral: {}
    };

    Object.entries(
      matrix[aesthetic] || {}
    ).forEach(
      ([key, amount]) => {
        addScore(
          scores,
          key,
          amount
        );
      }
    );
  }

  function scoreByAcousticPreference(
    scores,
    preference
  ) {
    const matrix = {
      max: {
        acoustic: 14
      },

      woodStone: {
        lvt: 10,
        acoustic: 7
      },

      textile: {
        carpet: 9,
        flotex: 9,
        acoustic: 4
      },

      natural: {
        linoleum: 10,
        acoustic: 7
      },

      noPreference: {
        acoustic: 8
      }
    };

    Object.entries(
      matrix[preference] || {}
    ).forEach(
      ([key, amount]) => {
        addScore(
          scores,
          key,
          amount
        );
      }
    );
  }

  function scoreBySafetyContext(
    scores,
    context
  ) {
    addScore(
      scores,
      "safety",
      10
    );

    if (
      context === "general"
    ) {
      addScore(
        scores,
        "safety",
        5
      );
    }

    if (
      context === "spills"
    ) {
      addScore(
        scores,
        "safety",
        8
      );
    }

    if (
      context === "wetroom"
    ) {
      addScore(
        scores,
        "safety",
        10
      );
    }

    if (
      context === "pool"
    ) {
      addScore(
        scores,
        "safety",
        10
      );
    }
  }

  function scoreByStage(
    scores,
    stage
  ) {
    if (
      stage === "renovation"
    ) {
      addScore(
        scores,
        "acoustic",
        5
      );

      addScore(
        scores,
        "lvt",
        5
      );

      addScore(
        scores,
        "carpet",
        2
      );
    }

    if (
      stage === "live"
    ) {
      addScore(
        scores,
        "acoustic",
        7
      );

      addScore(
        scores,
        "lvt",
        7
      );

      addScore(
        scores,
        "carpet",
        2
      );
    }
  }

  function buildRecommendations() {
    const scores =
      createEmptyScores();

    scoreBySpace(
      scores,
      state.answers.space
    );

    scoreByNeed(
      scores,
      state.answers.need
    );

    scoreByAesthetic(
      scores,
      state.answers.aesthetic
    );

    scoreByAcousticPreference(
      scores,
      state.answers.acousticPreference
    );

    scoreBySafetyContext(
      scores,
      state.answers.safetyContext
    );

    scoreByStage(
      scores,
      state.answers.stage
    );

    if (
      state.answers.need ===
        "entrance"
    ) {
      scores.entrance += 30;
    }

    if (
      state.answers.need ===
        "custom"
    ) {
      scores.custom += 30;
    }

    if (
      state.answers.space !==
        "transport"
    ) {
      scores.rail = -100;
    }

    const sorted =
      PRODUCT_ORDER
        .map(
          key => ({
            key,
            score:
              scores[key]
          })
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    const picked = [];

    sorted.forEach(
      item => {
        if (
          item.score <= 0 ||
          picked.length >=
            CONFIG.maxRecommendations
        ) {
          return;
        }

        if (
          item.key === "custom" &&
          state.answers.need !==
            "custom" &&
          state.answers.aesthetic !==
            "custom"
        ) {
          return;
        }

        if (
          item.key === "entrance" &&
          state.answers.need !==
            "entrance" &&
          item.score < 8
        ) {
          return;
        }

        picked.push(
          item.key
        );
      }
    );

    if (
      !picked.length
    ) {
      picked.push(
        "lvt",
        "acoustic",
        "linoleum"
      );
    }

    return picked.slice(
      0,
      CONFIG.maxRecommendations
    );
  }

  function recommendationNote(
    productKey
  ) {
    const need =
      state.answers.need;

    const stage =
      state.answers.stage;

    const safetyContext =
      state.answers.safetyContext;

    if (
      productKey === "acoustic" &&
      (
        stage === "renovation" ||
        stage === "live"
      )
    ) {
      if (
        lang === "el"
      ) {
        return "Για renovation ή περιορισμένο downtime, εξετάστε ειδικά το Modul'up 19 dB, που είναι loose-lay και εγκαθίσταται χωρίς κόλλα.";
      }

      if (
        lang === "pt"
      ) {
        return "Para renovação ou pouco downtime, vale a pena avaliar o Modul'up 19 dB, um sistema loose-lay instalado sem adesivo.";
      }

      return "For renovation or limited downtime, consider Modul'up 19 dB in particular: it is loose-lay and installed without adhesive.";
    }

    if (
      productKey === "lvt" &&
      (
        stage === "renovation" ||
        stage === "live"
      )
    ) {
      if (
        lang === "el"
      ) {
        return "Στη σειρά Allura υπάρχουν loose-lay, click και puzzle λύσεις που μπορούν να είναι ιδιαίτερα χρήσιμες όταν το downtime είναι κρίσιμο.";
      }

      if (
        lang === "pt"
      ) {
        return "A gama Allura inclui soluções loose-lay, click e puzzle que podem ser úteis quando o downtime é crítico.";
      }

      return "The Allura range includes loose-lay, click and puzzle solutions that can be useful when downtime is critical.";
    }

    if (
      productKey === "safety"
    ) {
      if (
        safetyContext ===
          "spills"
      ) {
        return (
          lang === "el"
            ? "Για συνθήκες με συχνά spills, οι σειρές Safestep R11/R12 είναι οι λύσεις που πρέπει να εξεταστούν τεχνικά."
            : lang === "pt"
              ? "Para zonas com derrames frequentes, as gamas Safestep R11/R12 devem ser avaliadas tecnicamente."
              : "For frequent-spill environments, Safestep R11/R12 ranges should be technically assessed."
        );
      }

      if (
        safetyContext ===
          "wetroom" ||
        safetyContext ===
          "pool"
      ) {
        return (
          lang === "el"
            ? "Για wetrooms ή barefoot εφαρμογές, εξετάστε τις ειδικές Wetroom safety λύσεις."
            : lang === "pt"
              ? "Para zonas húmidas ou aplicações barefoot, avalie as soluções específicas Wetroom."
              : "For wetrooms or barefoot applications, consider the dedicated Wetroom safety solutions."
        );
      }

      return (
        lang === "el"
          ? "Για γενικούς χώρους αυξημένου slip risk, η Surestep R10 είναι βασικό σημείο εκκίνησης· για υψηλότερο κίνδυνο υπάρχουν Safestep R11/R12."
          : lang === "pt"
            ? "Para zonas gerais com maior risco de escorregamento, Surestep R10 é um bom ponto de partida; para risco superior existem Safestep R11/R12."
            : "For general increased slip risk, Surestep R10 is a key starting point; Safestep R11/R12 address higher-risk conditions."
      );
    }

    if (
      productKey === "lvt" &&
      need === "acoustic"
    ) {
      return (
        lang === "el"
          ? "Αν θέλετε wood/stone αισθητική μαζί με ακουστική απόδοση, δείτε ειδικά το Allura Decibel."
          : lang === "pt"
            ? "Se pretende estética madeira/pedra com desempenho acústico, veja especialmente Allura Decibel."
            : "If you want a wood/stone look with acoustic performance, look specifically at Allura Decibel."
      );
    }

    return "";
  }

  function showRecommendations() {
    clearSuggestions();

    const recommendations =
      buildRecommendations();

    state.lastRecommendations =
      recommendations;

    const items =
      recommendations.map(
        (key, index) => {
          const product =
            PRODUCTS[key];

          const note =
            recommendationNote(
              key
            );

          return `
            <strong>
              ${index + 1}. ${escapeHTML(product.title)}
            </strong>
            <br>

            ${escapeHTML(
              localizedProductDescription(key)
            )}

            ${
              note
                ? `
                  <br>
                  <em>
                    ${escapeHTML(note)}
                  </em>
                `
                : ""
            }
          `;
        }
      );

    addBotMessage(
      `
        ${escapeHTML(t.recommendationIntro)}
        <br><br>

        ${items.join("<br><br>")}

        <br><br>

        ${escapeHTML(t.recommendationDisclaimer)}
      `,
      {
        html: true
      }
    );

    if (
      [
        "large",
        "xlarge"
      ].includes(
        state.answers.size
      )
    ) {
      addBotMessage(
        t.highIntent
      );
    }

    track(
      "recommendation",
      {
        space:
          state.answers.space ||
          "",

        need:
          state.answers.need ||
          "",

        stage:
          state.answers.stage ||
          "",

        size:
          state.answers.size ||
          "",

        products:
          recommendations.join(",")
      }
    );

    const productActions =
      recommendations.map(
        key => ({
          key:
            `open_${key}`,

          label:
            `${PRODUCTS[key].title} ↗`,

          userMessage:
            false,

          onClick:
            () =>
              externalOpen(
                PRODUCTS[key].url
              )
        })
      );

    setActions([
      ...productActions,

      {
        key: "sample",
        label:
          t.askSample,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "form",
        label:
          t.projectForm,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "call",
        label:
          t.call,
        userMessage:
          false,
        onClick:
          callMateria
      },

      {
        key: "restart",
        label:
          t.restart,
        userMessage:
          false,
        onClick:
          startGuidedFlow
      },

      {
        key: "home",
        label:
          t.home,
        userMessage:
          false,
        onClick:
          () =>
            showHome(false)
      }
    ]);
  }

  /* =========================================================
     PRODUCT BROWSER
  ========================================================= */

  function showProductMenu() {
    clearSuggestions();

    state.flow =
      "products";

    addBotMessage(
      t.productsPrompt
    );

    const productActions =
      PRODUCT_ORDER.map(
        key => ({
          key:
            `product_${key}`,

          label:
            PRODUCTS[key].title,

          onClick:
            () =>
              showProductResult(
                key
              )
        })
      );

    setActions(
      addHomeAction(
        productActions
      )
    );
  }

  function showProductResult(
    productKey,
    options = {}
  ) {
    const product =
      PRODUCTS[productKey];

    if (
      !product
    ) {
      return;
    }

    clearSuggestions();

    state.lastProduct =
      productKey;

    state.lastRecommendations =
      [productKey];

    const prefix =
      options.includeSelectedPrefix ===
        false
        ? ""
        : `
          <strong>
            ${escapeHTML(t.productSelected)}:
            ${escapeHTML(product.title)}
          </strong>
          <br><br>
        `;

    addBotMessage(
      `
        ${prefix}
        ${escapeHTML(
          localizedProductDescription(
            productKey
          )
        )}
      `,
      {
        html: true
      }
    );

    setActions([
      {
        key:
          `open_${productKey}`,

        label:
          t.productOpen,

        userMessage:
          false,

        onClick:
          () =>
            externalOpen(
              product.url
            )
      },

      {
        key: "guide",
        label:
          t.guideMe,
        userMessage:
          false,
        onClick:
          startGuidedFlow
      },

      {
        key: "sample",
        label:
          t.askSample,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "form",
        label:
          t.projectForm,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "call",
        label:
          t.call,
        userMessage:
          false,
        onClick:
          callMateria
      },

      {
        key: "products",
        label:
          t.homeActions.products,
        userMessage:
          false,
        onClick:
          showProductMenu
      },

      {
        key: "home",
        label:
          t.home,
        userMessage:
          false,
        onClick:
          () =>
            showHome(false)
      }
    ]);
  }

  /* =========================================================
     TECHNICAL / SAMPLES / CONTACT
  ========================================================= */

  function showTechnicalMenu() {
    clearSuggestions();

    state.flow =
      "technical";

    addBotMessage(
      t.technicalMessage
    );

    addBotMessage(
      t.technicalQuestion
    );

    const actions =
      Object.entries(
        t.technicalActions
      ).map(
        ([key, label]) => ({
          key:
            `technical_${key}`,

          label,

          onClick:
            () =>
              showTechnicalResult(
                key,
                label
              )
        })
      );

    setActions(
      addHomeAction(
        actions
      )
    );
  }

  function showTechnicalResult(
    key,
    label
  ) {
    const messagesByLanguage = {
      el: {
        specification:
          "Για τεχνική προδιαγραφή ή BIM, στείλτε μας τα βασικά στοιχεία του έργου, τη χρήση του χώρου και τυχόν απαιτήσεις της μελέτης ώστε να προταθεί κατάλληλο σύστημα.",

        sustainability:
          "Για EPD, BREEAM ή LEED requirements, η τελική επιλογή πρέπει να συνδεθεί με τις απαιτήσεις του συγκεκριμένου έργου και το documentation του αντίστοιχου προϊόντος.",

        value:
          "Στο value engineering εξετάζονται εναλλακτικές λύσεις που ισορροπούν τεχνική απόδοση, αισθητική και συνολικό κόστος κύκλου ζωής.",

        installation:
          "Η Materia Hub μπορεί να υποστηρίξει τον συντονισμό εφαρμογής, τεχνικές λεπτομέρειες και installation support για το έργο."
      },

      en: {
        specification:
          "For technical specification or BIM support, send the key project details, space use and any design requirements so an appropriate system can be proposed.",

        sustainability:
          "For EPD, BREEAM or LEED requirements, the final selection should be matched to the specific project criteria and the documentation of the selected product.",

        value:
          "Value engineering considers alternatives that balance technical performance, aesthetics and total lifecycle cost.",

        installation:
          "Materia Hub can support application coordination, technical details and installation support for the project."
      },

      pt: {
        specification:
          "Para especificação técnica ou apoio BIM, envie os principais dados do projeto, a utilização do espaço e os requisitos de projeto para que seja proposto um sistema adequado.",

        sustainability:
          "Para requisitos EPD, BREEAM ou LEED, a seleção final deve ser compatibilizada com os critérios do projeto e a documentação do produto escolhido.",

        value:
          "O value engineering avalia alternativas que equilibram desempenho técnico, estética e custo total do ciclo de vida.",

        installation:
          "A Materia Hub pode apoiar a coordenação da aplicação, detalhes técnicos e instalação do projeto."
      }
    };

    const message =
      (
        messagesByLanguage[lang] ||
        messagesByLanguage.en
      )[key];

    addBotMessage(
      message ||
      label
    );

    setActions([
      {
        key: "form",
        label:
          t.projectForm,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "call",
        label:
          t.call,
        userMessage:
          false,
        onClick:
          callMateria
      },

      {
        key: "email",
        label:
          t.email,
        userMessage:
          false,
        onClick:
          emailMateria
      },

      {
        key: "technical",
        label:
          t.back,
        userMessage:
          false,
        onClick:
          showTechnicalMenu
      },

      {
        key: "home",
        label:
          t.home,
        userMessage:
          false,
        onClick:
          () =>
            showHome(false)
      }
    ]);
  }

  function showSamples() {
    clearSuggestions();

    state.flow =
      "samples";

    addBotMessage(
      t.samplesMessage
    );

    setActions([
      {
        key: "form",
        label:
          t.projectForm,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "products",
        label:
          t.homeActions.products,
        userMessage:
          false,
        onClick:
          showProductMenu
      },

      {
        key: "call",
        label:
          t.call,
        userMessage:
          false,
        onClick:
          callMateria
      },

      {
        key: "email",
        label:
          t.email,
        userMessage:
          false,
        onClick:
          emailMateria
      },

      {
        key: "home",
        label:
          t.home,
        userMessage:
          false,
        onClick:
          () =>
            showHome(false)
      }
    ]);
  }

  function showContact() {
    clearSuggestions();

    state.flow =
      "contact";

    addBotMessage(
      t.contactMessage
    );

    setActions([
      {
        key: "call",

        label:
          `${t.call}: ${CONFIG.phoneDisplay}`,

        userMessage:
          false,

        onClick:
          callMateria
      },

      {
        key: "form",
        label:
          t.projectForm,
        userMessage:
          false,
        onClick:
          navigateToProjectForm
      },

      {
        key: "email",

        label:
          `${t.email}: ${CONFIG.email}`,

        userMessage:
          false,

        onClick:
          emailMateria
      },

      {
        key: "home",
        label:
          t.home,
        userMessage:
          false,
        onClick:
          () =>
            showHome(false)
      }
    ]);
  }

  /* =========================================================
     FREE TEXT INTENT MATCHING
  ========================================================= */

  const INTENTS = [
    {
      key: "acoustic",
      product: "acoustic",

      terms: [
        "acoustic",
        "acoustics",
        "sound",
        "noise",
        "quiet",
        "db",
        "decibel",
        "ακουστικ",
        "ηχο",
        "θορυβ",
        "ντεσιμπελ",
        "acustic",
        "ruido",
        "som"
      ]
    },

    {
      key: "safety",
      product: "safety",

      terms: [
        "safety",
        "slip",
        "antislip",
        "anti slip",
        "r10",
        "r11",
        "r12",
        "wetroom",
        "wet room",
        "pool",
        "spa",
        "αντιολισ",
        "ολισθη",
        "ασφαλ",
        "πισινα",
        "μπανιο",
        "υγρ",
        "antiderrap",
        "escorreg",
        "piscina",
        "zona humida"
      ]
    },

    {
      key: "lvt",
      product: "lvt",

      terms: [
        "lvt",
        "allura",
        "vinyl tile",
        "luxury vinyl",
        "wood look",
        "stone look",
        "click",
        "dryback",
        "βινυλ",
        "ξυλο",
        "πετρα",
        "πλακακι vinyl",
        "vinil",
        "madeira",
        "pedra"
      ]
    },

    {
      key: "flotex",
      product: "flotex",

      terms: [
        "flotex",
        "flocked",
        "textile washable",
        "υφαντο",
        "flocado"
      ]
    },

    {
      key: "entrance",
      product: "entrance",

      terms: [
        "entrance",
        "entry",
        "matting",
        "coral",
        "nuway",
        "dirt",
        "moisture",
        "εισοδο",
        "πατακι",
        "βρωμια",
        "υγρασια",
        "entrada",
        "sujidade",
        "humidade"
      ]
    },

    {
      key: "carpet",
      product: "carpet",

      terms: [
        "carpet",
        "carpet tile",
        "tessera",
        "softbac",
        "μοκετα",
        "μοκέτα",
        "χαλι",
        "alcatifa",
        "carpete"
      ]
    },

    {
      key: "linoleum",
      product: "linoleum",

      terms: [
        "linoleum",
        "marmoleum",
        "natural floor",
        "natural material",
        "sustainable",
        "sustainability",
        "λινολεουμ",
        "μαρμολεουμ",
        "φυσικο υλικο",
        "βιωσιμο",
        "βιωσιμη",
        "βιωσιμοτητα",
        "linoleo",
        "natural",
        "sustentavel",
        "sustentabilidade"
      ]
    },

    {
      key: "custom",
      product: "custom",

      terms: [
        "custom",
        "bespoke",
        "logo",
        "branding",
        "print",
        "graphic",
        "λογοτυπο",
        "σχεδιο",
        "εκτυπωση",
        "εξατομικ",
        "personalizado",
        "logotipo",
        "grafico"
      ]
    },

    {
      key: "rail",
      product: "rail",

      terms: [
        "rail",
        "railway",
        "train",
        "metro",
        "tram",
        "45545",
        "hl2",
        "σιδηροδρο",
        "τρενο",
        "μετρο",
        "τραμ",
        "ferrovi",
        "comboio"
      ]
    },

    {
      key: "samples",
      action: "samples",

      terms: [
        "sample",
        "samples",
        "mockup",
        "mock up",
        "δειγμα",
        "δείγμα",
        "δειγματα",
        "δείγματα",
        "amostra",
        "amostras"
      ]
    },

    {
      key: "technical",
      action: "technical",

      terms: [
        "bim",
        "spec",
        "specification",
        "technical",
        "epd",
        "breeam",
        "leed",
        "value engineering",
        "installation support",
        "προδιαγραφ",
        "τεχνικ",
        "μελετη",
        "μελέτη",
        "εφαρμογ",
        "especific",
        "tecnic",
        "instalacao"
      ]
    },

    {
      key: "contact",
      action: "contact",

      terms: [
        "contact",
        "phone",
        "telephone",
        "call",
        "email",
        "advisor",
        "consultant",
        "επικοινων",
        "τηλεφων",
        "καλεσ",
        "συμβουλο",
        "contacto",
        "telefone",
        "ligar",
        "consultor"
      ]
    }
  ];

  function scoreIntent(
    text,
    intent
  ) {
    const normalized =
      normalizeText(
        text
      );

    let score = 0;

    intent.terms.forEach(
      term => {
        const normalizedTerm =
          normalizeText(
            term
          );

        if (
          !normalizedTerm
        ) {
          return;
        }

        if (
          normalized.includes(
            normalizedTerm
          )
        ) {
          score +=
            normalizedTerm.includes(" ")
              ? 5
              : 3;
        }
      }
    );

    return score;
  }

  function findIntent(
    text
  ) {
    const ranked =
      INTENTS
        .map(
          intent => ({
            intent,

            score:
              scoreIntent(
                text,
                intent
              )
          })
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    if (
      !ranked.length ||
      ranked[0].score < 3
    ) {
      return null;
    }

    return ranked[0].intent;
  }

  function handleIntent(
    intent
  ) {
    if (
      !intent
    ) {
      return false;
    }

    track(
      "free_text_intent",
      {
        intent:
          intent.key
      }
    );

    if (
      intent.product
    ) {
      showProductResult(
        intent.product,
        {
          includeSelectedPrefix:
            false
        }
      );

      return true;
    }

    if (
      intent.action ===
        "samples"
    ) {
      showSamples();
      return true;
    }

    if (
      intent.action ===
        "technical"
    ) {
      showTechnicalMenu();
      return true;
    }

    if (
      intent.action ===
        "contact"
    ) {
      showContact();
      return true;
    }

    return false;
  }

  /* =========================================================
     OPTIONAL EXTERNAL KNOWLEDGE BASE
     Flexible parser for window.MATERIA_CHATBOT_DATA
  ========================================================= */

  function getKnowledgeBase() {
    return Array.isArray(
      window.MATERIA_CHATBOT_DATA
    )
      ? window.MATERIA_CHATBOT_DATA
      : [];
  }

  function flattenStrings(
    value,
    bucket = [],
    depth = 0
  ) {
    if (
      depth > 4 ||
      value == null
    ) {
      return bucket;
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      bucket.push(
        String(value)
      );

      return bucket;
    }

    if (
      Array.isArray(value)
    ) {
      value
        .slice(
          0,
          30
        )
        .forEach(
          item =>
            flattenStrings(
              item,
              bucket,
              depth + 1
            )
        );

      return bucket;
    }

    if (
      typeof value === "object"
    ) {
      Object.entries(
        value
      ).forEach(
        ([key, item]) => {
          if (
            /url|href|image|icon|id/i.test(
              key
            )
          ) {
            return;
          }

          flattenStrings(
            item,
            bucket,
            depth + 1
          );
        }
      );
    }

    return bucket;
  }

  function extractKnowledgeAnswer(
    entry
  ) {
    if (
      !entry ||
      typeof entry !== "object"
    ) {
      return "";
    }

    const preferredKeys = [
      "answer",
      "response",
      "reply",
      "content",
      "description",
      "text",
      "body"
    ];

    for (
      const key of preferredKeys
    ) {
      if (
        typeof entry[key] ===
          "string" &&
        entry[key].trim()
      ) {
        return entry[key].trim();
      }
    }

    return "";
  }

  function extractKnowledgeTitle(
    entry
  ) {
    if (
      !entry ||
      typeof entry !== "object"
    ) {
      return "";
    }

    const preferredKeys = [
      "question",
      "title",
      "name",
      "label",
      "topic"
    ];

    for (
      const key of preferredKeys
    ) {
      if (
        typeof entry[key] ===
          "string" &&
        entry[key].trim()
      ) {
        return entry[key].trim();
      }
    }

    return "";
  }

  function extractKnowledgeURL(
    entry
  ) {
    if (
      !entry ||
      typeof entry !== "object"
    ) {
      return "";
    }

    const directKeys = [
      "url",
      "href",
      "link"
    ];

    for (
      const key of directKeys
    ) {
      if (
        typeof entry[key] ===
          "string" &&
        /^https?:\/\//i.test(
          entry[key]
        )
      ) {
        return entry[key];
      }
    }

    if (
      Array.isArray(
        entry.links
      )
    ) {
      const first =
        entry.links.find(
          item => {
            if (
              typeof item ===
                "string"
            ) {
              return /^https?:\/\//i.test(
                item
              );
            }

            return (
              item &&
              typeof item.url ===
                "string" &&
              /^https?:\/\//i.test(
                item.url
              )
            );
          }
        );

      if (
        typeof first ===
          "string"
      ) {
        return first;
      }

      if (
        first &&
        first.url
      ) {
        return first.url;
      }
    }

    return "";
  }

  function searchKnowledgeBase(
    query
  ) {
    const kb =
      getKnowledgeBase();

    if (
      !kb.length
    ) {
      return [];
    }

    const queryTokens =
      tokens(
        query
      );

    const normalizedQuery =
      normalizeText(
        query
      );

    if (
      !queryTokens.length
    ) {
      return [];
    }

    return kb
      .map(
        (
          entry,
          index
        ) => {
          const strings =
            flattenStrings(
              entry
            );

          const haystack =
            normalizeText(
              strings.join(" ")
            );

          let score = 0;

          queryTokens.forEach(
            token => {
              if (
                haystack.includes(
                  token
                )
              ) {
                score +=
                  token.length >= 5
                    ? 3
                    : 1;
              }
            }
          );

          if (
            normalizedQuery.length >=
              5 &&
            haystack.includes(
              normalizedQuery
            )
          ) {
            score += 8;
          }

          return {
            entry,
            index,
            score,

            title:
              extractKnowledgeTitle(
                entry
              ),

            answer:
              extractKnowledgeAnswer(
                entry
              ),

            url:
              extractKnowledgeURL(
                entry
              )
          };
        }
      )
      .filter(
        result =>
          result.score >= 3 &&
          result.answer
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      )
      .slice(
        0,
        3
      );
  }

  function showKnowledgeResult(
    results
  ) {
    if (
      !results.length
    ) {
      return false;
    }

    const top =
      results[0];

    addBotMessage(
      `${t.kbPrefix} ${top.answer}`
    );

    const suggestions =
      results
        .slice(1)
        .map(
          result => ({
            label:
              result.title ||
              result.answer.slice(
                0,
                70
              ),

            onClick:
              () => {
                addUserMessage(
                  result.title ||
                  result.answer.slice(
                    0,
                    70
                  )
                );

                addBotMessage(
                  result.answer
                );

                if (
                  result.url
                ) {
                  setActions([
                    {
                      key:
                        "kb_link",

                      label:
                        t.productOpen,

                      userMessage:
                        false,

                      onClick:
                        () =>
                          externalOpen(
                            result.url
                          )
                    },

                    ...homeActions().map(
                      action => ({
                        ...action,
                        userMessage:
                          false
                      })
                    )
                  ]);
                }
              }
          })
        );

    setSuggestions(
      suggestions
    );

    const actions = [];

    if (
      top.url
    ) {
      actions.push({
        key:
          "kb_link",

        label:
          t.productOpen,

        userMessage:
          false,

        onClick:
          () =>
            externalOpen(
              top.url
            )
      });
    }

    actions.push(
      {
        key: "guide",

        label:
          t.homeActions.guided,

        userMessage:
          false,

        onClick:
          startGuidedFlow
      },

      {
        key: "contact",

        label:
          t.homeActions.contact,

        userMessage:
          false,

        onClick:
          showContact
      },

      {
        key: "home",

        label:
          t.home,

        userMessage:
          false,

        onClick:
          () =>
            showHome(false)
      }
    );

    setActions(
      actions
    );

    track(
      "knowledge_base_match",
      {
        score:
          top.score,

        index:
          top.index
      }
    );

    return true;
  }

  /* =========================================================
     FREE TEXT HANDLER
  ========================================================= */

  function handleFreeText(
    value
  ) {
    const text =
      value.trim();

    if (
      !text
    ) {
      addBotMessage(
        t.noInput
      );

      return;
    }

    addUserMessage(
      text
    );

    clearSuggestions();

    track(
      "free_text",
      {
        length:
          text.length
      }
    );

    const intent =
      findIntent(
        text
      );

    if (
      handleIntent(
        intent
      )
    ) {
      return;
    }

    const kbResults =
      searchKnowledgeBase(
        text
      );

    if (
      showKnowledgeResult(
        kbResults
      )
    ) {
      return;
    }

    addBotMessage(
      t.freeTextFallback
    );

    setActions(
      homeActions()
    );
  }

  /* =========================================================
     EVENTS
  ========================================================= */

  launcher.addEventListener(
    "click",
    () => {
      if (
        root.classList.contains(
          "is-open"
        )
      ) {
        closeChatbot();
      } else {
        openChatbot();
      }
    }
  );

  closeButton.addEventListener(
    "click",
    closeChatbot
  );

  actionsContainer.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "button[data-action-id]"
        );

      if (
        !button
      ) {
        return;
      }

      const handler =
        actionRegistry.get(
          button.dataset.actionId
        );

      if (
        typeof handler ===
          "function"
      ) {
        handler();
      }
    }
  );

  suggestionsContainer.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "button[data-suggestion-id]"
        );

      if (
        !button
      ) {
        return;
      }

      const handler =
        suggestionRegistry.get(
          button.dataset.suggestionId
        );

      if (
        typeof handler ===
          "function"
      ) {
        handler();
      }
    }
  );

  form.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const value =
        input.value;

      input.value =
        "";

      autoResizeInput();

      handleFreeText(
        value
      );
    }
  );

  input.addEventListener(
    "input",
    autoResizeInput
  );

  input.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        form.requestSubmit();
      }
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key ===
          "Escape" &&
        root.classList.contains(
          "is-open"
        )
      ) {
        closeChatbot();
      }
    }
  );

  /* =========================================================
     PUBLIC API
  ========================================================= */

  window.MateriaChatbot = {
    open:
      openChatbot,

    close:
      closeChatbot,

    home:
      () =>
        showHome(false),

    startGuided:
      startGuidedFlow,

    showProducts:
      showProductMenu,

    showContact,

    getState:
      () =>
        JSON.parse(
          JSON.stringify(
            state
          )
        ),

    getProjectContext:
      getProjectContextText
  };

  log(
    "Ready",
    {
      language:
        lang,

      knowledgeBaseEntries:
        getKnowledgeBase().length
    }
  );
})();
