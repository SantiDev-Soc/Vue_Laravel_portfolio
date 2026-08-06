import { ref, computed } from 'vue';

export type Locale = 'es' | 'en';

const locale = ref<Locale>('es');

// Detección regional automática basada en idioma del navegador o zona horaria
const autoDetectLocale = (): Locale => {
  const saved = localStorage.getItem('santi_portfolio_locale');
  if (saved === 'es' || saved === 'en') {
    return saved as Locale;
  }

  // Detectar por idioma del navegador
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const isSpanishSpeaker = ['es', 'ca', 'gl', 'eu', 'ast'].some(lang => 
    browserLang.toLowerCase().startsWith(lang)
  );

  // Detectar por zona horaria de España o Latinoamérica
  let isSpanishZone = false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && (
      tz.includes('Europe/Madrid') || 
      (tz.includes('America/') && ![
        'America/New_York', 'America/Los_Angeles', 'America/Chicago', 
        'America/Denver', 'America/Anchorage', 'America/Phoenix', 
        'America/Halifax', 'America/Toronto', 'America/Vancouver'
      ].some(ignoredTz => tz.includes(ignoredTz)))
    )) {
      isSpanishZone = true;
    }
  } catch (e) {
    // Ignorar si el navegador no soporta resolvedOptions
  }

  return (isSpanishSpeaker || isSpanishZone) ? 'es' : 'en';
};

// Inicializar idioma detectado
locale.value = autoDetectLocale();

const setLocale = (newLocale: Locale) => {
  locale.value = newLocale;
  localStorage.setItem('santi_portfolio_locale', newLocale);
};

const toggleLocale = () => {
  const target: Locale = locale.value === 'es' ? 'en' : 'es';
  setLocale(target);
};

// Diccionario de traducciones completo y altamente pulido
const translations: Record<Locale, Record<string, any>> = {
  es: {
    // LAYOUT & HEADER
    nav: {
      home: 'Inicio',
      blog: 'Publicaciones',
      contact: 'Contacto',
      dashboard: 'Dashboard',
      logo: 'SANTIAGO'
    },
    footer: {
      status: 'PORTFOLIO_ENGINE_READY v1.0.4',
      server: 'Modo Desarrollo (Docker compatible)',
      locale: 'Idioma actual: Español'
    },

    // HOME SECTION
    home: {
      file_label: 'santiago_velazquez.bin',
      title_1: 'Sistemas Robustos.',
      title_2: 'Código Limpio.',
      subtitle: 'Soy desarrollador backend especializado en arquitectura de software, desacoplamiento de dominio y optimización de bases de datos. Diseño APIs escalables capaces de procesar transacciones complejas sin comprometer la velocidad.',
      cta_talk: 'Hablemos',
      ide_file: 'architecture_manifesto.php',
      ide_return: "'Sistemas altamente desacoplados'",
      ide_focus_title: '💡 ENFOQUE TÉCNICO',
      ide_focus_text: 'Especializado en aislar lógica empresarial (Dominio) de capas externas. Implementación de bus de mensajes robusto para Command / Query de forma limpia.',
      
      // Experiencia
      experience_title: 'Trayectoria Técnica',
      experience_subtitle: 'Experiencia real construyendo e integrando flujos de datos estructurados.',
      timeline_duration: '1 Año de Prácticas',
      timeline_role: 'Desarrollador Backend en Prácticas',
      timeline_company: 'en',
      timeline_desc: 'Durante este periodo de prácticas de un año, desarrollé y consolidé gran parte de mis aptitudes técnicas en backend. Participé activamente en la implementación de arquitectura backend aplicando principios de Domain-Driven Design (DDD) y CQRS para asegurar un código altamente mantenible, además de colaborar en el diseño y desarrollo de una API REST segura y Pasarela de Pagos SaaS integrada con la API de Stripe con control de concurrencia y rate-limiting. Colaboré en la creación de Command/Query Handlers, propagación de Eventos de dominio, diseño de DTOs independientes y desacoplamiento de Repositorios. Aseguré la calidad de código mediante tests unitarios con PHPUnit y validación de APIs con Postman.',
      
      // Proyectos
      projects_label: 'PORTAFOLIO DE SISTEMAS',
      projects_title: 'Proyectos Destacados',
      projects_subtitle: 'Sistemas distribuidos e infraestructuras de backend que he conceptualizado y estructurado.',
      
      project_santi_solutions: {
        title: 'Santi Solutions',
        desc: 'Plataforma de consultoría y reformas premium para Florida, USA. Diseñado bajo Arquitectura Hexagonal y DDD (Domain-Driven Design). Orquestado con un monorepo Docker de 12 contenedores, incluyendo 6 servicios web Laravel 11/PHP 8.4, 5 workers asíncronos para comunicación basada en eventos mediante Redis Pub/Sub, y un pool de 6 bases de datos PostgreSQL aisladas.',
        status: 'ESTADO: DESARROLLO',
        link_label: 'ENLACE PROYECTO:'
      },
      project_messaging: {
        title: 'Sistema de Mensajería Distribuida en Tiempo Real',
        desc: 'Despliegue de un sistema escalable de WebSockets utilizando Laravel Reverb, colas de trabajo distribuidas y caché de baja latencia mediante Redis. Implementación de bases de datos aisladas para comunicación inmediata, robusta y tolerante a fallos.',
        status: 'ESTADO: PRODUCCIÓN',
        link_label: 'SISTEMA DE MENSAJERÍA:'
      },
      project_portfolio: {
        title: 'Motor de Portafolio Seguro & Pipeline Full-Stack',
        desc: 'Sistema modular interactivo desarrollado en Vue 3 y TypeScript, dockerizado bajo un entorno Alpine seguro y preparado para enlazarse con una API backend de Laravel para persistencia duradera y respuestas de email automáticas.',
        status: 'ESTADO: INTEGRACIÓN'
      },

      // Habilidades
      skills_label: 'HABILIDADES TÉCNICAS',
      skills_title: 'Especialización Tecnológica',
      skills_subtitle: 'Mi arsenal técnico dividido por capas de responsabilidad.',
      skills_backend: 'Backend & Arquitectura',
      skills_database: 'Persistencia & Caché',
      skills_devops: 'DevOps & Entornos',

      // CTA
      cta_title: '¿Quieres construir sistemas eficientes y mantenibles?',
      cta_desc: 'Hablemos sobre tu proyecto o arquitectura. Estaré encantado de aportar valor en la escalabilidad y robustez técnica de tu backend.',
      cta_btn: 'Escríbeme hoy mismo'
    },

    // BLOG SECTION
    blog: {
      log_label: 'LOG DE CONOCIMIENTO',
      title: 'Publicaciones Técnicas',
      subtitle: 'Espacio dedicado a compartir aprendizajes, enfoques de arquitectura y reflexiones sobre desarrollo backend, escalabilidad y la construcción de software limpio.',
      filter_all: 'Todas',
      empty: 'No se encontraron publicaciones en la categoría seleccionada.',
      sidebar_title: 'sobre_mi.md',
      sidebar_text: 'Escribo principalmente sobre Symfony, Laravel, arquitectura DDD, patrones de diseño de APIs e integración de sistemas basados en colas asíncronas. El objetivo es estructurar ideas complejas de forma amena y entendible.',
      sidebar_update: 'Actualizado semanalmente',
      modal_close: 'Cerrar Lector',
      read_time_label: 'lectura'
    },

    // CONTACT SECTION
    contact: {
      label: 'CONEXIÓN BACKEND',
      title: 'Iniciar Conversación',
      subtitle: '¿Tienes una propuesta técnica, una necesidad de arquitectura, o buscas un desarrollador con enfoque en backend robusto? Escríbeme y responderé en la brevedad posible.',
      channel: 'Canal Principal',
      phone: 'Móvil / WhatsApp',
      location: 'Ubicación',
      location_text: 'Madrid, España (Disponible para remoto)',
      form_title: 'FORMULARIO_SEGURO_API.JSON',
      form_name: 'Tu Nombre',
      form_email: 'Tu Correo Electrónico',
      form_subject: 'Asunto de Propuesta',
      form_message: 'Mensaje / Detalles Técnicos',
      form_submit: 'Enviar Mensaje Seguro',
      form_sending: 'Enviando payload...',
      form_success: '¡Mensaje encolado correctamente! Se procesará la respuesta automática.',
      form_back: 'Volver al Inicio'
    },

    // DASHBOARD SECTION
    dashboard: {
      version: 'PORTFOLIO_ENGINE_DASHBOARD v1.0.4',
      title: 'Panel de Administración',
      subtitle: 'Gestión interactiva local de publicaciones técnicas y buzón de entrada de propuestas.',
      btn_new_post: 'Nueva Publicación',
      tab_posts: 'Publicaciones',
      tab_inbox: 'Buzón / Inbox',
      table_title: 'Título',
      table_category: 'Categoría',
      table_date: 'Fecha',
      table_tags: 'Etiquetas',
      table_actions: 'Acciones',
      table_empty: 'No hay publicaciones técnicas disponibles en este momento.',
      inbox_empty: 'La bandeja de entrada está vacía.',
      inbox_delete_btn: 'Borrar Mensaje Seguro',
      inbox_subject_label: 'Asunto de Propuesta',
      inbox_body_label: 'Cuerpo del Mensaje',
      inbox_select_prompt: 'Selecciona un mensaje del buzón para auditar su contenido.',
      confirm_delete_post: '¿Estás seguro de que deseas eliminar esta publicación técnica?',
      confirm_delete_msg: '¿Deseas borrar este mensaje del buzón?',
      
      // Modal Post
      modal_post_new: 'Crear Publicación Técnica',
      modal_post_edit: 'Editar Publicación Técnica',
      modal_field_title: 'Título de la Publicación',
      modal_field_category: 'Categoría',
      modal_field_summary: 'Resumen o Abstract',
      modal_field_content: 'Contenido Completo (Soporta saltos de línea)',
      modal_field_readtime: 'Tiempo Estimado de Lectura',
      modal_field_tags: 'Etiquetas (Separadas por comas)',
      modal_btn_save: 'Guardar Cambios',
      modal_btn_cancel: 'Cancelar'
    }
  },
  en: {
    // LAYOUT & HEADER
    nav: {
      home: 'Home',
      blog: 'Publications',
      contact: 'Contact',
      dashboard: 'Dashboard',
      logo: 'SANTIAGO'
    },
    footer: {
      status: 'PORTFOLIO_ENGINE_READY v1.0.4',
      server: 'Development Mode (Docker compatible)',
      locale: 'Current Language: English'
    },

    // HOME SECTION
    home: {
      file_label: 'santiago_velazquez.bin',
      title_1: 'Robust Systems.',
      title_2: 'Clean Code.',
      subtitle: 'I am a backend developer specializing in software architecture, domain decoupling, and database optimization. I design scalable APIs capable of processing complex transactions without compromising speed.',
      cta_talk: "Let's Talk",
      ide_file: 'architecture_manifesto.php',
      ide_return: "'Highly decoupled systems'",
      ide_focus_title: '💡 TECHNICAL FOCUS',
      ide_focus_text: 'Specialized in isolating business logic (Domain) from external layers. Implementation of a robust message bus for clean Command / Query execution.',
      
      // Experience
      experience_title: 'Technical Career',
      experience_subtitle: 'Hands-on experience building and integrating structured data flows.',
      timeline_duration: '1 Year Internship',
      timeline_role: 'Backend Developer Intern',
      timeline_company: 'at',
      timeline_desc: 'During this one-year internship, I developed and consolidated a major part of my technical backend skills. I actively participated in implementing backend architecture applying Domain-Driven Design (DDD) and CQRS principles to ensure highly maintainable code. I also collaborated on the design and development of a Secure REST API and SaaS Payment Gateway integrated with the Stripe API with concurrency control and rate-limiting. I contributed to creating Command/Query Handlers, propagating domain Events, designing independent DTOs, and decoupling Repositories. I ensured code quality through unit testing with PHPUnit and API validation with Postman.',
      
      // Projects
      projects_label: 'SYSTEMS PORTFOLIO',
      projects_title: 'Featured Projects',
      projects_subtitle: 'Distributed systems and backend infrastructures I have conceptualized and structured.',
      
      project_santi_solutions: {
        title: 'Santi Solutions',
        desc: 'Premium home remodeling and consulting platform for Florida, USA. Designed under Hexagonal Architecture and DDD (Domain-Driven Design). Orchestrated with a 12-container Docker monorepo, including 6 Laravel 11/PHP 8.4 web services, 5 asynchronous workers for event-driven communication via Redis Pub/Sub, and a pool of 6 isolated PostgreSQL databases.',
        status: 'STATUS: DEVELOPMENT',
        link_label: 'PROJECT LINK:'
      },
      project_messaging: {
        title: 'Real-Time Distributed Messaging System',
        desc: 'Deployment of a highly scalable WebSocket system using Laravel Reverb, distributed job queues, and low-latency caching via Redis. Implemented isolated databases for immediate, robust, and fault-tolerant communication.',
        status: 'STATUS: PRODUCTION',
        link_label: 'MESSAGING SYSTEM:'
      },
      project_portfolio: {
        title: 'Secure Portfolio Engine & Full-Stack Pipeline',
        desc: 'Modular interactive system developed in Vue 3 and TypeScript, dockerized under a secure Alpine environment and prepared to link with a Laravel backend API for durable persistence and automatic email responses.',
        status: 'STATUS: INTEGRATION'
      },

      // Habilidades
      skills_label: 'TECHNICAL SKILLS',
      skills_title: 'Technology Stack',
      skills_subtitle: 'My technical toolset categorized by layers of responsibility.',
      skills_backend: 'Backend & Architecture',
      skills_database: 'Persistence & Cache',
      skills_devops: 'DevOps & Environments',

      // CTA
      cta_title: 'Do you want to build efficient and maintainable systems?',
      cta_desc: 'Let’s discuss your project or architecture. I would be delighted to bring value to the scalability and technical robustness of your backend.',
      cta_btn: 'Write to me today'
    },

    // BLOG SECTION
    blog: {
      log_label: 'KNOWLEDGE LOG',
      title: 'Technical Publications',
      subtitle: 'Space dedicated to sharing learnings, architectural approaches, and reflections on backend development, scalability, and building clean software.',
      filter_all: 'All',
      empty: 'No publications found in the selected category.',
      sidebar_title: 'about_me.md',
      sidebar_text: 'I write mostly about Symfony, Laravel, DDD architecture, API design patterns, and asynchronous queue-based systems integration. The goal is to structure complex ideas in an engaging and understandable way.',
      sidebar_update: 'Updated weekly',
      modal_close: 'Close Reader',
      read_time_label: 'read'
    },

    // CONTACT SECTION
    contact: {
      label: 'BACKEND CONNECTION',
      title: 'Start Conversation',
      subtitle: 'Do you have a technical proposal, an architectural need, or are you looking for a developer with a robust backend focus? Write to me and I will respond as soon as possible.',
      channel: 'Main Channel',
      phone: 'Mobile / WhatsApp',
      location: 'Location',
      location_text: 'Madrid, Spain (Available for remote work)',
      form_title: 'SECURE_API_FORM.JSON',
      form_name: 'Your Name',
      form_email: 'Your Email Address',
      form_subject: 'Proposal Subject',
      form_message: 'Message / Technical Details',
      form_submit: 'Send Secure Message',
      form_sending: 'Sending payload...',
      form_success: 'Message successfully queued! Automatic email response will be processed.',
      form_back: 'Back to Home'
    },

    // DASHBOARD SECTION
    dashboard: {
      version: 'PORTFOLIO_ENGINE_DASHBOARD v1.0.4',
      title: 'Admin Dashboard',
      subtitle: 'Interactive local management of technical publications and incoming proposals inbox.',
      btn_new_post: 'New Publication',
      tab_posts: 'Publications',
      tab_inbox: 'Inbox / Buzón',
      table_title: 'Title',
      table_category: 'Category',
      table_date: 'Date',
      table_tags: 'Tags',
      table_actions: 'Actions',
      table_empty: 'No technical publications available at this moment.',
      inbox_empty: 'Inbox is empty.',
      inbox_delete_btn: 'Delete Secure Message',
      inbox_subject_label: 'Proposal Subject',
      inbox_body_label: 'Message Body',
      inbox_select_prompt: 'Select a message from the inbox to audit its content.',
      confirm_delete_post: 'Are you sure you want to delete this technical publication?',
      confirm_delete_msg: 'Do you want to delete this message from the inbox?',
      
      // Modal Post
      modal_post_new: 'Create Technical Publication',
      modal_post_edit: 'Edit Technical Publication',
      modal_field_title: 'Publication Title',
      modal_field_category: 'Category',
      modal_field_summary: 'Summary or Abstract',
      modal_field_content: 'Full Content (Supports line breaks)',
      modal_field_readtime: 'Estimated Reading Time',
      modal_field_tags: 'Tags (Separated by commas)',
      modal_btn_save: 'Save Changes',
      modal_btn_cancel: 'Cancel'
    }
  }
};

export function useI18n() {
  const currentLocale = computed(() => locale.value);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale.value];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback al español si falta una traducción en inglés
        let fallback: any = translations['es'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            fallback = undefined;
            break;
          }
        }
        return fallback !== undefined ? fallback : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return {
    locale: currentLocale,
    setLocale,
    toggleLocale,
    t
  };
}
