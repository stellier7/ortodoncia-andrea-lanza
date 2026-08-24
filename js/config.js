/**
 * =============================================================================
 * CLIENT CONFIG — Dra. Andrea Lanza
 * =============================================================================
 * Edit THIS FILE ONLY when customizing content for this practice.
 * Empty strings / empty arrays hide the related UI automatically.
 *
 * IMAGE ASSETS — drop files under /assets/images/ (see TODO comments below).
 * =============================================================================
 */

const config = {
  // ---------------------------------------------------------------------------
  // SITE DEFAULTS
  // ---------------------------------------------------------------------------
  defaultLanguage: "es",

  // ---------------------------------------------------------------------------
  // SEO / METADATA
  // ---------------------------------------------------------------------------
  metadata: {
    es: "Dra. Andrea Lanza, especialista en ortodoncia y ortopedia maxilar en Torre Agalta, Tegucigalpa. Transformando sonrisas de niños y adultos.",
    en: "Dr. Andrea Lanza, specialist in orthodontics and maxillary orthopedics at Torre Agalta, Tegucigalpa. Transforming smiles for children and adults.",
  },

  // ---------------------------------------------------------------------------
  // PRACTICE INFO
  // ---------------------------------------------------------------------------
  practice: {
    name: "Dra. Andrea Lanza",

    tagline: {
      en: "Transforming smiles",
      es: "Transformando sonrisas",
    },

    phone: "+504 9566-0020",
    phoneTel: "50495660020",

    address: {
      street: "Torre Agalta",
      city: "Tegucigalpa",
      state: "Honduras",
      zip: "",
      // OPTIONAL — leave blank to auto-build map query from address fields above
      mapsQuery: "Torre Agalta, Tegucigalpa, Honduras",
    },

    hours: {
      mon: "9:00 AM – 5:00 PM",
      tue: "9:00 AM – 5:00 PM",
      wed: "9:00 AM – 5:00 PM",
      thu: "9:00 AM – 5:00 PM",
      fri: "9:00 AM – 5:00 PM",
      sat: "9:00 AM – 5:00 PM",
      sun: "", // Dom Cerrado — empty hides the day
    },

    // OPTIONAL — leave blank to hide email in footer
    email: "",

    // OPTIONAL — leave blank to hide trust-bar stats (entire bar hidden when all empty)
    yearsInPractice: "",
    patientRating: "",
  },

  // ---------------------------------------------------------------------------
  // BRANDING
  // ---------------------------------------------------------------------------
  branding: {
    // OPTIONAL — leave blank to use template default colors from styles.css
    primaryColor: "",
    accentColor: "",
    primaryDark: "",
    softBg: "",
    // TODO: Add practice logo — drop logo.png or logo.svg in assets/images/ and set path here
    logoUrl: "",
    // TODO: Replace with client hero photo — drop hero.jpg in assets/images/
    heroImageUrl: "assets/images/hero.jpg",
  },

  // ---------------------------------------------------------------------------
  // UI COPY (labels, nav, section headers, buttons) — per language
  // ---------------------------------------------------------------------------
  ui: {
    en: {
      nav: {
        home: "Home",
        services: "Services",
        dentists: "Our Team",
        gallery: "Gallery",
        testimonials: "Reviews",
        financing: "Financing",
        location: "Location",
        book: "Book Appointment",
        openMenu: "Open menu",
        closeMenu: "Close menu",
      },
      hero: {
        badge: "New Patients Welcome",
        cta: "Book Appointment",
      },
      trust: {
        years: "Years in practice",
        rating: "Patient rating",
        licensed: "Licensed & certified",
      },
      sections: {
        services: "Our Services",
        servicesLead: "Clear aligners and orthodontic care for children and adults.",
        dentists: "Meet the Doctor",
        dentistsLead: "Warm, specialized care for every stage of your smile.",
        gallery: "Smile Gallery",
        galleryLead: "Real results from patients like you.",
        testimonials: "What Patients Say",
        testimonialsLead: "Trusted by families in our community.",
        financing: "Financing",
        financingLead: "We work with BAC and Ficohsa to make care more accessible.",
        location: "Visit Us",
        locationLead: "Torre Agalta, Tegucigalpa — we look forward to seeing you.",
      },
      services: {
        expand: "Learn more",
        collapse: "Show less",
      },
      location: {
        hours: "Hours",
        call: "Call Us",
        directions: "Get Directions",
        mapInteract: "Tap to interact with the map",
        closed: "Closed",
        days: {
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday",
          sun: "Sunday",
        },
      },
      stickyBar: {
        cta: "Book Appointment",
      },
      footer: {
        contact: "Contact",
        hours: "Hours",
        follow: "Follow Us",
        rights: "All rights reserved.",
        developedBy: "Developed by",
      },
      langToggle: {
        label: "Language",
        en: "EN",
        es: "ES",
      },
      gallery: {
        viewImage: "View image",
        close: "Close preview",
        previous: "Previous image",
        next: "Next image",
        preview: "Image preview",
      },
    },
    es: {
      nav: {
        home: "Inicio",
        services: "Servicios",
        dentists: "Nuestro Equipo",
        gallery: "Galería",
        testimonials: "Opiniones",
        financing: "Financiamiento",
        location: "Ubicación",
        book: "Agendar Cita",
        openMenu: "Abrir menú",
        closeMenu: "Cerrar menú",
      },
      hero: {
        badge: "Nuevos Pacientes Bienvenidos",
        cta: "Agendar Cita",
      },
      trust: {
        years: "Años de experiencia",
        rating: "Calificación de pacientes",
        licensed: "Licenciados y certificados",
      },
      sections: {
        services: "Nuestros Servicios",
        servicesLead: "Alineadores y ortodoncia para niños y adultos.",
        dentists: "Conoce a la Doctora",
        dentistsLead: "Atención especializada y cálida en cada etapa de tu sonrisa.",
        gallery: "Galería de Sonrisas",
        galleryLead: "Resultados reales de pacientes como tú.",
        testimonials: "Lo Que Dicen Nuestros Pacientes",
        testimonialsLead: "La confianza de familias de nuestra comunidad.",
        financing: "Financiamiento",
        financingLead: "Trabajamos con BAC y Ficohsa para hacer tu tratamiento más accesible.",
        location: "Visítanos",
        locationLead: "Torre Agalta, Tegucigalpa — te esperamos con gusto.",
      },
      services: {
        expand: "Ver más",
        collapse: "Ver menos",
      },
      location: {
        hours: "Horario",
        call: "Llámanos",
        directions: "Cómo Llegar",
        mapInteract: "Toca para interactuar con el mapa",
        closed: "Cerrado",
        days: {
          mon: "Lunes",
          tue: "Martes",
          wed: "Miércoles",
          thu: "Jueves",
          fri: "Viernes",
          sat: "Sábado",
          sun: "Domingo",
        },
      },
      stickyBar: {
        cta: "Agendar Cita",
      },
      footer: {
        contact: "Contacto",
        hours: "Horario",
        follow: "Síguenos",
        rights: "Todos los derechos reservados.",
        developedBy: "Desarrollado por",
      },
      langToggle: {
        label: "Idioma",
        en: "EN",
        es: "ES",
      },
      gallery: {
        viewImage: "Ver imagen",
        close: "Cerrar vista previa",
        previous: "Imagen anterior",
        next: "Imagen siguiente",
        preview: "Vista previa de imagen",
      },
    },
  },

  // ---------------------------------------------------------------------------
  // DENTISTS
  // ---------------------------------------------------------------------------
  dentists: [
    {
      name: "Dra. Andrea Lanza",
      title: {
        en: "Orthodontist & Maxillary Orthopedist",
        es: "Ortodoncista y Ortopeda Maxilar",
      },
      bio: {
        en: "Specialist in orthodontics and pediatric facial growth, with warm, attentive care for children and adults.",
        es: "Especialista en ortodoncia y crecimiento facial infantil, con atención cálida para niños y adultos.",
      },
      // TODO: Replace with doctor photo — drop dentist.jpg (or andrea-lanza.jpg) in assets/images/
      photoUrl: "assets/images/dentist.jpg",
    },
  ],

  // ---------------------------------------------------------------------------
  // SERVICES
  // ---------------------------------------------------------------------------
  services: [
    {
      name: { en: "Clear Aligners", es: "Alineadores" },
      description: {
        en: "Discreet clear aligners that straighten teeth with personalized plans and check-ins — for teens and adults who want a confident smile without traditional braces.",
        es: "Alineadores transparentes que enderezan los dientes con planes personalizados y seguimientos — para adolescentes y adultos que buscan una sonrisa segura sin brackets tradicionales.",
      },
      icon: "aligners",
    },
    {
      name: { en: "Pediatric Orthodontics", es: "Ortodoncia Pediátrica" },
      description: {
        en: "Early orthodontic care and facial growth guidance for children — gentle visits that build healthy habits and confident little smiles.",
        es: "Atención ortodóntica temprana y guía del crecimiento facial en niños — visitas amables que crean hábitos sanos y sonrisas confiadas.",
      },
      icon: "pediatric",
    },
  ],

  // ---------------------------------------------------------------------------
  // TESTIMONIALS — empty array hides the section
  // ---------------------------------------------------------------------------
  testimonials: [],

  // ---------------------------------------------------------------------------
  // FINANCING IMAGES
  // ---------------------------------------------------------------------------
  financingImages: [
    {
      src: "assets/images/financing/Bac.png",
      alt: {
        en: "BAC Credomatic financing",
        es: "Financiamiento BAC Credomatic",
      },
    },
    {
      src: "assets/images/financing/Ficohsa.png",
      alt: {
        en: "Ficohsa financing",
        es: "Financiamiento Ficohsa",
      },
    },
  ],

  // ---------------------------------------------------------------------------
  // SMILE GALLERY
  // ---------------------------------------------------------------------------
  // TODO: Replace demo gallery images — drop client photos in assets/images/gallery/
  gallery: [
    "assets/images/gallery/smile-01.jpg",
    "assets/images/gallery/smile-02.jpg",
    "assets/images/gallery/smile-03.jpg",
    "assets/images/gallery/smile-04.jpg",
    "assets/images/gallery/smile-05.jpg",
  ],

  // ---------------------------------------------------------------------------
  // SOCIAL LINKS — leave blank to hide that icon
  // ---------------------------------------------------------------------------
  socials: {
    instagram: "https://www.instagram.com/ortodoncia.andrealanza",
    facebook: "", // OPTIONAL — leave blank to hide Facebook icon
  },
};

// Expose globally for app.js (no bundler / no modules required)
window.SITE_CONFIG = config;
