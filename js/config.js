/**
 * =============================================================================
 * CLIENT CONFIG — ORTHO ODONTO / Dra. Andrea Lanza
 * =============================================================================
 * Edit THIS FILE ONLY when customizing content for this practice.
 * Empty strings / empty arrays hide the related UI automatically.
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
    es: "Dra. Andrea Lanza y equipo especializado en ortodoncia, odontología general, endodoncia e implantología en Torre Agalta, Tegucigalpa. Transformando sonrisas de niños y adultos.",
    en: "Dr. Andrea Lanza and a specialized team in orthodontics, general dentistry, endodontics, and implantology at Torre Agalta, Tegucigalpa. Transforming smiles for children and adults.",
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
      mapsQuery: "Torre Agalta, Tegucigalpa, Honduras",
    },

    hours: {
      mon: "9:00 AM – 5:00 PM",
      tue: "9:00 AM – 5:00 PM",
      wed: "9:00 AM – 5:00 PM",
      thu: "9:00 AM – 5:00 PM",
      fri: "9:00 AM – 5:00 PM",
      sat: "9:00 AM – 5:00 PM",
      sun: "",
    },

    email: "",

    yearsInPractice: "",
    patientRating: "",
  },

  // ---------------------------------------------------------------------------
  // BRANDING — colors from ORTHO ODONTO logo (assets/images/IMG_0437.jpeg)
  // ---------------------------------------------------------------------------
  branding: {
    primaryColor: "#B89BC4",
    accentColor: "#7EA3D9",
    primaryDark: "#967AA3",
    softBg: "#F8F3FA",
    logoUrl: "assets/images/IMG_0437.jpeg",
    heroImageUrl: "assets/images/IMG_0439.jpeg",
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
        servicesLead: "Orthodontics, general dentistry, endodontics, and oral surgery — comprehensive care for the whole family.",
        dentists: "Meet the Team",
        dentistsLead: "Specialists working together for healthier, more confident smiles.",
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
        servicesLead: "Ortodoncia, odontología general, endodoncia e implantología — cuidado integral para toda la familia.",
        dentists: "Conoce al Equipo",
        dentistsLead: "Especialistas que trabajan juntos por sonrisas más sanas y seguras.",
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
        en: "Orthodontics & Maxillary Orthopedics",
        es: "Ortodoncia y Ortopedia Maxilar",
      },
      bio: {
        en: "Specialist in orthodontics and pediatric facial growth, with warm, attentive care for children and adults.",
        es: "Especialista en ortodoncia y crecimiento facial infantil, con atención cálida para niños y adultos.",
      },
      photoUrl: "assets/images/IMG_0430.jpeg",
    },
    {
      name: "Dra. Carmen Cruz",
      title: {
        en: "General Dentistry",
        es: "Odontología General",
      },
      bio: {
        en: "Comprehensive preventive and restorative care — check-ups, fillings, and everyday treatments to keep your smile healthy.",
        es: "Atención preventiva y restaurativa integral — revisiones, resinas y tratamientos cotidianos para mantener tu sonrisa sana.",
      },
      // TODO: Add photo when available — drop carmen-cruz.jpeg in assets/images/
      photoUrl: "",
    },
    {
      name: "Dr. Estrella Reyes",
      title: {
        en: "General Dentistry",
        es: "Odontología",
      },
      bio: {
        en: "Gentle general dentistry with a focus on comfortable visits and clear guidance for patients of all ages.",
        es: "Odontología general con enfoque en visitas cómodas y orientación clara para pacientes de todas las edades.",
      },
      photoUrl: "assets/images/estrella-perez.jpeg",
    },
    {
      name: "Dr. Ulises Lagos",
      title: {
        en: "Endodontics Specialist",
        es: "Especialista en Endodoncia",
      },
      bio: {
        en: "Expert in root canal therapy and pulp treatments — saving natural teeth with precision and gentle care.",
        es: "Experto en tratamientos de conducto y terapias pulpares — salvando dientes naturales con precisión y cuidado gentil.",
      },
      photoUrl: "assets/images/IMG_0442.jpeg",
    },
    {
      name: "Dr. Carlos Díaz",
      title: {
        en: "Oral Surgery & Implantology Specialist",
        es: "Especialista en Cirugía Bucal e Implantología",
      },
      bio: {
        en: "Specialist in oral surgery and dental implants — restoring function and confidence with durable, natural-looking results.",
        es: "Especialista en cirugía bucal e implantes dentales — recuperando función y confianza con resultados duraderos y naturales.",
      },
      photoUrl: "assets/images/IMG_0443.jpeg",
    },
  ],

  // ---------------------------------------------------------------------------
  // SERVICES
  // ---------------------------------------------------------------------------
  services: [
    {
      name: { en: "Clear Aligners", es: "Alineadores" },
      description: {
        en: "Discreet clear aligners that straighten teeth with personalized plans — for teens and adults who want a confident smile without traditional braces.",
        es: "Alineadores transparentes que enderezan los dientes con planes personalizados — para adolescentes y adultos que buscan una sonrisa segura sin brackets tradicionales.",
      },
      icon: "aligners",
    },
    {
      name: { en: "Traditional Braces", es: "Ortodoncia con Brackets" },
      description: {
        en: "Fixed braces for precise tooth movement and bite correction, with regular adjustments and personalized care throughout treatment.",
        es: "Brackets fijos para mover los dientes con precisión y corregir la mordida, con ajustes periódicos y atención personalizada durante el tratamiento.",
      },
      icon: "aligners",
    },
    {
      name: { en: "Pediatric Orthodontics", es: "Ortodoncia Pediátrica" },
      description: {
        en: "Early orthodontic evaluation and facial growth guidance for children — gentle visits that build healthy habits and confident smiles.",
        es: "Evaluación ortodóntica temprana y guía del crecimiento facial en niños — visitas amables que crean hábitos sanos y sonrisas confiadas.",
      },
      icon: "pediatric",
    },
    {
      name: { en: "Maxillary Orthopedics", es: "Ortopedia Maxilar" },
      description: {
        en: "Appliances that guide jaw growth and balance facial development in children and adolescents — preventing more complex problems later.",
        es: "Aparatos que guían el crecimiento mandibular y equilibran el desarrollo facial en niños y adolescentes — previniendo problemas más complejos después.",
      },
      icon: "pediatric",
    },
    {
      name: { en: "Cleanings & Exams", es: "Limpiezas y Exámenes" },
      description: {
        en: "Routine preventive care to keep gums healthy, detect concerns early, and maintain a bright smile for the whole family.",
        es: "Cuidado preventivo de rutina para mantener encías sanas, detectar problemas a tiempo y conservar una sonrisa radiante en toda la familia.",
      },
      icon: "cleaning",
    },
    {
      name: { en: "Fillings & Restorations", es: "Resinas y Restauraciones" },
      description: {
        en: "Tooth-colored fillings and restorations that repair decay or damage while blending naturally with your smile.",
        es: "Resinas y restauraciones del color del diente que reparan caries o daños integrándose de forma natural con tu sonrisa.",
      },
      icon: "general",
    },
    {
      name: { en: "Teeth Whitening", es: "Blanqueamiento Dental" },
      description: {
        en: "Professional whitening for a brighter smile with natural-looking results — safe and supervised by our team.",
        es: "Blanqueamiento profesional para una sonrisa más luminosa con resultados naturales — seguro y supervisado por nuestro equipo.",
      },
      icon: "whitening",
    },
    {
      name: { en: "Root Canal Therapy", es: "Endodoncia" },
      description: {
        en: "Root canal treatment to relieve pain and save infected teeth — performed with precision and gentle, modern techniques.",
        es: "Tratamiento de conducto para aliviar el dolor y salvar dientes infectados — realizado con precisión y técnicas modernas y gentiles.",
      },
      icon: "general",
    },
    {
      name: { en: "Dental Implants", es: "Implantes Dentales" },
      description: {
        en: "Titanium implants that replace missing teeth with durable, natural-looking results — restoring chewing function and confidence.",
        es: "Implantes de titanio que reemplazan dientes perdidos con resultados duraderos y naturales — recuperando función masticatoria y confianza.",
      },
      icon: "implants",
    },
    {
      name: { en: "Oral Surgery", es: "Cirugía Bucal" },
      description: {
        en: "Surgical extractions, wisdom teeth removal, and other oral surgery procedures planned for comfort and long-term health.",
        es: "Extracciones quirúrgicas, remoción de cordales y otros procedimientos de cirugía bucal planificados para comodidad y salud a largo plazo.",
      },
      icon: "emergency",
    },
    {
      name: { en: "Extractions", es: "Extracciones Dentales" },
      description: {
        en: "Simple and surgical tooth extractions when a tooth cannot be saved — with clear guidance before and after the procedure.",
        es: "Extracciones dentales simples y quirúrgicas cuando un diente no puede conservarse — con orientación clara antes y después del procedimiento.",
      },
      icon: "general",
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
