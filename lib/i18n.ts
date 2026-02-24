// eterlab/lib/i18n.ts
export type Lang = "en" | "es";

export const LANG_KEY = "eterlab:lang";

type Copy = {
  /** Global button labels (use these whenever possible to avoid drift). */
  buttons: {
    view: string;
    visitSite: string;
    learnMore: string;
    send: string;
    viewSite: string;
    open: string;
    live: string;
    comingSoon: string;
    viewAll: string;
    showLess: string;
    back: string;
    backHome: string;
    contact: string;
  };

  nav: {
    home: string;
    projects: string;
    work: string;
    about: string;
    contact: string;
    startProject: string;
    toggle: string;
  };

  hero: {
    subtitle: string;
    scrollAria: string;
  };

  projects: {
    tag: string;
    title: string;
    meta: string;
    kicker: string;
    cards: {
      promptea: {
        badge: string;
        desc: string;
        ctaPrimary: string;
        ctaSecondary: string;
      };
      moonlight: {
        badge: string;
        desc: string;
        ctaSecondary: string;
        comingSoon: string;
        overlay: string;
      };
    };
  };

  featured: {
    tag: string;
    title: string;
    desc: string;
    ctaMore: string;
    ctaLive: string;
    moreTitle: string;
    viewAll: string;
    viewLess: string;
  };

  statement: {
    tag: string;
    descStrong: string;
    desc: string;
    lines: [string, string, string, string];
  };

  contact: {
    tag: string;
    title: string;
    desc: string;

    subjectProject: string;
    subjectSubscription: string;
    subjectOther: string;

    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;

    subjectLabel: string;

    messageLabel: string;
    messagePlaceholder: string;

    ctaPrimary: string;
    ctaSecondary: string;
    note: string;

    sending: string;
    sent: string;
    error: string;
  };

  footer: {
    phone?: string;
    email: string;

    navTitle: string;
    nav: {
      home: string;
      studio: string;
      projects: string;
      work: string;
      contact: string;
    };

    socialTitle: string;
    social: {
      twitter: string;
      instagram: string;
      dribbble: string;
      tiktok: string;
    };

    studioLabel: string;
    copy: string;
    backToTop: string;

    emailUs: string;
    followUsOn: string;
    backToTopToast: string;
  };

  work: {
    back: string;
    sectionsLabel: string;
    liveLabel: string;
    yearLabel: string;
    readTimeLabel: string;
    roleLabel: string;
    stackLabel: string;
    readMore: string;
  };

  workIndex: {
    tag: string;
    title: string;
    desc: string;
    backHome: string;
    open: string;
    live: string;
    comingSoon: string;
  };

  separator: {
    line: string;
    big: string;
  };
};

const BUTTONS: Record<Lang, Copy["buttons"]> = {
  en: {
    view: "view",
    visitSite: "visit site",
    learnMore: "learn more",
    send: "send",
    viewSite: "view site",
    open: "open",
    live: "live",
    comingSoon: "coming soon",
    viewAll: "view all",
    showLess: "show less",
    back: "back",
    backHome: "back to home",
    contact: "contact",
  },
  es: {
    view: "ver",
    visitSite: "visitar sitio",
    learnMore: "conocer más",
    send: "enviar",
    viewSite: "ver sitio",
    open: "abrir",
    live: "ver online",
    comingSoon: "próximamente",
    viewAll: "ver todo",
    showLess: "ver menos",
    back: "volver",
    backHome: "volver al inicio",
    contact: "contacto",
  },
};

export const COPY: Record<Lang, Copy> = {
  en: {
    buttons: BUTTONS.en,

    nav: {
      home: "Home",
      projects: "Projects",
      work: "Work",
      about: "Studio",
      contact: "Contact",
      startProject: "Start project",
      toggle: "ES / EN",
    },

    hero: {
      subtitle: "turning ideas into solutions through design & development.",
      scrollAria: "Scroll to the next section",
    },

    projects: {
      tag: "our solutions",
      title: "projects.",
      meta: "©",
      kicker: "We build digital solutions — turning ideas into useful realities for real people.",
      cards: {
        promptea: {
          badge: "AI tool",
          desc: "Analyze your prompt, detect issues, and optimize it for each AI.",
          ctaPrimary: BUTTONS.en.view,
          ctaSecondary: BUTTONS.en.visitSite,
        },
        moonlight: {
          badge: "design subscription",
          desc: "We offer 100% handcrafted websites tailored exclusively for your business. Achieve better results at a better price.",
          ctaSecondary: BUTTONS.en.visitSite,
          comingSoon: BUTTONS.en.comingSoon,
          overlay: BUTTONS.en.comingSoon,
        },
      },
    },

    featured: {
      tag: "featured deliveries",
      title: "latest work.",
      desc: "A closer look at our recent client work — from craft to launch, with a commitment to quality and results.",
      ctaMore: BUTTONS.en.learnMore,
      ctaLive: BUTTONS.en.visitSite,
      moreTitle: "more projects",
      viewAll: BUTTONS.en.viewAll,
      viewLess: BUTTONS.en.showLess,
    },

    statement: {
      tag: "why eterlab.",
      descStrong: "Design and development that solve real problems.",
      desc: `We help you turn ideas into solid digital products: thoughtful UX, clean interfaces, and a fast, reliable technical foundation. From the first pixel to the last line of code, we optimize the result for your satisfaction and your users'.`,
      lines: ["proven outcomes", "for every build, with", "a focus on design", "and functionality."],
    },

    contact: {
      tag: "get in touch",
      title: "let’s talk.",
      desc: "Find out how we can help you with your idea.",

      subjectProject: "New project",
      subjectSubscription: "Subscription",
      subjectOther: "Other",

      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",

      subjectLabel: "Subject",

      messageLabel: "Message",
      messagePlaceholder: "What are you building? What do you need help with?",

      ctaPrimary: BUTTONS.en.send,
      ctaSecondary: "view projects",
      note: "Tip: keep it short — scope, timeline and links are perfect.",

      sending: "Sending…",
      sent: "Sent",
      error: "Something went wrong",
    },

    footer: {
      phone: "",
      email: "contact.eterlab@gmail.com",

      navTitle: "Navigation",
      nav: {
        home: "Home",
        studio: "Studio",
        projects: "Projects",
        work: "Work",
        contact: "Contact",
      },

      socialTitle: "Social",
      social: {
        twitter: "#",
        instagram: "#",
        dribbble: "#",
        tiktok: "https://tiktok.com/@.eterlab",
      },

      studioLabel: "Studio",
      copy: "eterlab. All rights reserved.",
      backToTop: "Back to top",

      emailUs: "email us",
      followUsOn: "follow us on",
      backToTopToast: "Back to top",
    },

    work: {
      back: "Back",
      sectionsLabel: "Sections",
      liveLabel: BUTTONS.en.viewSite,
      yearLabel: "Year",
      readTimeLabel: "Reading time",
      roleLabel: "Role",
      stackLabel: "Stack",
      readMore: "Read more",
    },

    workIndex: {
      tag: "index",
      title: "work.",
      desc: "view our proof of work.",
      backHome: BUTTONS.en.backHome,
      open: BUTTONS.en.open,
      live: BUTTONS.en.live,
      comingSoon: BUTTONS.en.comingSoon,
    },

    separator: {
      line: "Design • Software • Tools",
      big: "Ethereal aesthetics. Performance-first.",
    },
  },

  es: {
    buttons: BUTTONS.es,

    nav: {
      home: "Inicio",
      projects: "Proyectos",
      work: "Trabajos",
      about: "Estudio",
      contact: "Contacto",
      startProject: "Iniciar proyecto",
      toggle: "ES / EN",
    },

    hero: {
      subtitle: "convirtiendo ideas en soluciones a través del diseño y desarrollo.",
      scrollAria: "Scroll a la siguiente sección",
    },

    projects: {
      tag: "nuestras soluciones",
      title: "proyectos.",
      meta: "©",
      kicker: "Construimos soluciones digitales, convirtiendo ideas en realidades útiles para el usuario.",
      cards: {
        promptea: {
          badge: "herramienta de IA",
          desc: "Analizá tu prompt, detectá problemas y optimizalo para cada IA.",
          ctaPrimary: BUTTONS.es.view,
          ctaSecondary: BUTTONS.es.visitSite,
        },
        moonlight: {
          badge: "suscripción de diseño",
          desc: "Hacemos sitios 100% handcrafted, hechos a medida para tu negocio. Mejores resultados, a mejor precio.",
          ctaSecondary: BUTTONS.es.visitSite,
          comingSoon: BUTTONS.es.comingSoon,
          overlay: BUTTONS.es.comingSoon,
        },
      },
    },

    featured: {
      tag: "entregas destacadas",
      title: "trabajos recientes.",
      desc: "Un vistazo a nuestro trabajo para clientes — de la idea al lanzamiento, con compromiso de calidad y resultados garantizados.",
      ctaMore: BUTTONS.es.learnMore,
      ctaLive: BUTTONS.es.visitSite,
      moreTitle: "más proyectos",
      viewAll: BUTTONS.es.viewAll,
      viewLess: BUTTONS.es.showLess,
    },

    statement: {
      tag: "por qué eterlab.",
      descStrong: "Diseño y desarrollo para resolver problemas reales.",
      desc: `Te acompañamos a transformar ideas en productos digitales sólidos: UX cuidado, interfaces limpias y una base técnica rápida.
      
      Desde el primer pixel hasta la última línea de código, optimizamos el resultado para tu satisfacción y la de tus usuarios.`,
      lines: ["resultados probados", "en cada entrega, con", "foco en diseño", "y funcionalidad."],
    },

    contact: {
      tag: "contactanos",
      title: "hablemos.",
      desc: "Descubrí cómo podemos ayudarte con tu idea.",

      subjectProject: "Nuevo proyecto",
      subjectSubscription: "Suscripción",
      subjectOther: "Otro",

      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      emailLabel: "Email",
      emailPlaceholder: "vos@empresa.com",

      subjectLabel: "Tema",

      messageLabel: "Mensaje",
      messagePlaceholder: "¿Qué estás construyendo? ¿En qué necesitás ayuda?",

      ctaPrimary: BUTTONS.es.send,
      ctaSecondary: "ver proyectos",
      note: "Tip: con scope, timeline y links alcanza.",

      sending: "Enviando…",
      sent: "Enviado",
      error: "Hubo un error",
    },

    footer: {
      phone: "",
      email: "contact.eterlab@gmail.com",

      navTitle: "Navegación",
      nav: {
        home: "Inicio",
        studio: "Estudio",
        projects: "Proyectos",
        work: "Trabajos",
        contact: "Contacto",
      },

      socialTitle: "Social",
      social: {
        twitter: "#",
        instagram: "#",
        dribbble: "#",
        tiktok: "https://tiktok.com/@.eterlab",
      },

      studioLabel: "Estudio",
      copy: "eterlab. Todos los derechos reservados.",
      backToTop: "Volver arriba",

      emailUs: "escribinos",
      followUsOn: "seguinos en",
      backToTopToast: "Volver arriba",
    },

    work: {
      back: "Volver",
      sectionsLabel: "Secciones",
      liveLabel: BUTTONS.es.viewSite,
      yearLabel: "Año",
      readTimeLabel: "Tiempo de lectura",
      roleLabel: "Rol",
      stackLabel: "Stack",
      readMore: "Leer más",
    },

    workIndex: {
      tag: "índice",
      title: "trabajos.",
      desc: "un vistazo a lo que hacemos.",
      backHome: BUTTONS.es.backHome,
      open: BUTTONS.es.open,
      live: BUTTONS.es.live,
      comingSoon: BUTTONS.es.comingSoon,
    },

    separator: {
      line: "Diseño • Software • Herramientas",
      big: "Estética etérea. Performance-first.",
    },
  },
};

