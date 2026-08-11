import { Post, Message, Certification, Project } from './types';

export const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'Tabamba: Arquitectura Backend con DDD, CQRS, Event-Driven y Audio Streaming',
    title_en: 'Tabamba: Backend Architecture with DDD, CQRS, Event-Driven & Audio Streaming',
    summary: 'Diseño y desarrollo del backend para Tabamba: plataforma de alto rendimiento para podcasters aplicando Domain-Driven Design (DDD), CQRS, arquitectura orientada a eventos y streaming de audio de baja latencia.',
    summary_en: 'Design and engineering of Tabamba backend: a high-performance podcasting platform applying Domain-Driven Design (DDD), CQRS, event-driven architecture, and low-latency audio streaming.',
    content: `En la industria del podcasting y distribución de contenidos de audio, la estabilidad de la API backend, el desacoplamiento de la lógica de negocio y la rapidez en la entrega del contenido determinan la experiencia del usuario.

### Arquitectura de Tabamba (Back-Podcasters)
Para dar soporte a la emisión y gestión de podcasts en **Tabamba**, diseñamos un servicio backend estructurado con principios de **Domain-Driven Design (DDD)**, **CQRS** (Command Query Responsibility Segregation) y **Event-Driven Architecture**:

1. **Capa de Dominio e Identidad:** Las reglas de negocio de episodios, canales RSS y cuotas de almacenamiento están totalmente aisladas del ORM.
2. **Command & Query Handlers:** Los comandos alteran el estado del sistema mediante eventos de dominio, mientras las consultas de lectura leen proyecciones optimizadas.
3. **Gestión Desacoplada de Audio & RSS:** Streaming de audio de baja latencia con fragmentación de medios y generación automatizada de feeds RSS validados.
4. **Persistencia en PostgreSQL & Event Bus:** Modelo relacional con índices optimizados para metadatos de episodios y propagación asíncrona de eventos.

\`\`\`php
// Ejemplo de Command Handler y controlador de streaming en Tabamba
namespace App\\Application\\CommandHandler;

use App\\Domain\\Repository\\PodcastRepositoryInterface;
use App\\Application\\Command\\PublishEpisodeCommand;

class PublishEpisodeHandler
{
    public function __construct(
        private readonly PodcastRepositoryInterface $repository
    ) {}

    public function __invoke(PublishEpisodeCommand $command): void
    {
        $episode = $this->repository->findOrFail($command->getEpisodeId());
        $episode->publish();
        $this->repository->save($episode);
    }
}
\`\`\`

### Repositorio y Código Fuente
El código fuente completo de la arquitectura backend de Tabamba está alojado en GitHub:
https://github.com/SantiDev-Soc/Back-Podcasters.git`,
    content_en: `In the podcasting and audio distribution industry, backend API stability, domain logic decoupling, and rapid content delivery determine the user experience.

### Tabamba Architecture (Back-Podcasters)
To support podcast streaming and management in **Tabamba**, we engineered a backend service built around **Domain-Driven Design (DDD)**, **CQRS**, and **Event-Driven Architecture**:

1. **Domain & Identity Layer:** Business rules for episodes, RSS channels, and quota limits are completely isolated from the ORM.
2. **Command & Query Handlers:** Commands mutate system state via domain events, while queries read optimized projections.
3. **Decoupled Audio & RSS Management:** Low-latency audio streaming with media chunking and automated RSS feed validation.
4. **PostgreSQL Persistence & Event Bus:** Relational schema with optimized indexes for episode metadata and asynchronous event propagation.

\`\`\`php
// Example Command Handler and streaming controller in Tabamba
namespace App\\Application\\CommandHandler;

use App\\Domain\\Repository\\PodcastRepositoryInterface;
use App\\Application\\Command\\PublishEpisodeCommand;

class PublishEpisodeHandler
{
    public function __construct(
        private readonly PodcastRepositoryInterface $repository
    ) {}

    public function __invoke(PublishEpisodeCommand $command): void
    {
        $episode = $this->repository->findOrFail($command->getEpisodeId());
        $episode->publish();
        $this->repository->save($episode);
    }
}
\`\`\`

### Repository & Source Code
The complete source code for Tabamba's backend architecture is hosted on GitHub:
https://github.com/SantiDev-Soc/Back-Podcasters.git`,
    category: 'Arquitectura & Audio',
    category_en: 'Architecture & Audio',
    readTime: '7 min lectura',
    readTime_en: '7 min read',
    date: '2026-08-01',
    tags: ['Tabamba', 'DDD', 'CQRS', 'Event-Driven', 'PHP', 'Laravel', 'PostgreSQL'],
    github_url: 'https://github.com/SantiDev-Soc/Back-Podcasters.git'
  },
  {
    id: '2',
    title: 'Arquitectura de Mensajería Distribuida en MyChat con Laravel Reverb y Redis',
    title_en: 'Distributed Messaging Architecture in MyChat with Laravel Reverb and Redis',
    summary: 'Diseño y optimización del sistema de mensajería en tiempo real MyChat utilizando Laravel Reverb, colas distribuidas y aislamiento de base de datos.',
    summary_en: 'Designing and optimizing the MyChat real-time messaging system using Laravel Reverb, distributed queues, and database isolation.',
    content: `El tiempo real ya no es un lujo; es una expectativa del usuario. Sin embargo, escalar conexiones WebSockets a miles de usuarios simultáneos plantea un desafío de rendimiento considerable.

### El Rol de Laravel Reverb y Redis
**Laravel Reverb** introduce un servidor WebSocket nativo para Laravel, optimizado para una alta eficiencia. Al combinarlo con **Redis** como broker de mensajería y backend de caché, logramos distribuir la carga de eventos de manera sobresaliente.

### Principio "Database-per-Service"
En nuestro proyecto de mensajería distribuida, aplicamos aislamiento granular de base de datos:
- El microservicio de mensajería gestiona sus propios datos en **PostgreSQL**.
- La comunicación asíncrona se realiza a través de **Eventos de Dominio** propagados mediante colas.
- El almacenamiento en memoria caché con **Redis** garantiza que los canales activos se resuelvan en microsegundos.

\`\`\`javascript
// Conexión frontend minimalista con Alpine.js
import Echo from 'laravel-echo';
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

window.Echo.private(\`chat.\${chatId}\`)
    .listen('MessageSent', (e) => {
        this.messages.push(e.message);
    });
\`\`\`

### Resultados Clave
Esta arquitectura distribuida nos permitió reducir la latencia de entrega de mensajes a menos de **50ms**, asegurando que los recursos de la base de datos principal solo se consuman en operaciones estrictamente necesarias.`,
    content_en: `Real-time is no longer a luxury; it is a user expectation. However, scaling WebSocket connections to thousands of simultaneous users poses a major performance challenge.

### The Role of Laravel Reverb and Redis
**Laravel Reverb** introduces a native WebSocket server for Laravel, optimized for high efficiency. By combining it with **Redis** as a messaging broker and cache backend, we achieve outstanding distribution of event loads.

### "Database-per-Service" Principle
In our distributed messaging project, we applied granular database isolation:
- The messaging microservice manages its own data in **PostgreSQL**.
- Asynchronous communication is handled through **Domain Events** propagated via queues.
- In-memory caching with **Redis** ensures that active channels are resolved in microseconds.

\`\`\`javascript
// Minimalist frontend connection with Alpine.js
import Echo from 'laravel-echo';
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

window.Echo.private(\`chat.\${chatId}\`)
    .listen('MessageSent', (e) => {
        this.messages.push(e.message);
    });
\`\`\`

### Key Results
This distributed architecture allowed us to reduce message delivery latency to under **50ms**, ensuring that main database resources are only consumed in strictly necessary operations.`,
    category: 'Sistemas Distribuidos',
    category_en: 'Distributed Systems',
    readTime: '8 min lectura',
    readTime_en: '8 min read',
    date: '2026-05-28',
    tags: ['MyChat', 'Laravel', 'Redis', 'PostgreSQL', 'WebSockets'],
    github_url: 'https://github.com/SantiDev-Soc/Mmy-Chat-Microservices-Architecture.git'
  },
  {
    id: '4',
    title: 'Orquestación de Microservicios Backend en Santi Solutions con Docker y Nginx',
    title_en: 'Backend Microservices Orchestration in Santi Solutions with Docker and Nginx',
    summary: 'Guía práctica para construir el entorno monorepo Docker de Santi Solutions con contenedores aislados y Nginx como API Gateway.',
    summary_en: 'Practical guide to building Santi Solutions monorepo Docker environment with isolated containers and Nginx as an API Gateway.',
    content: `El clásico "en mi máquina funciona" es el enemigo número uno de la entrega continua. Docker y la contenerización resuelven esto al empaquetar de forma exacta el sistema operativo, dependencias y variables de entorno de cada servicio.

### Diseñando la Topología de Red de Santi Solutions
Para una arquitectura robusta en Santi Solutions, cada microservicio debe estar aislado de los demás en la capa de red:
1. **Red Externa (Frontend Network):** Expone solo el contenedor Nginx al mundo exterior.
2. **Red Interna (Backend Network):** Permite que los microservicios se comuniquen entre sí y con sus respectivas bases de datos, manteniéndolas inaccesibles de forma externa.

### Configurando Nginx como Reverse Proxy
Nginx actúa como la puerta de entrada única (API Gateway), redirigiendo el tráfico entrante al microservicio adecuado según el prefijo de la URI:

\`\`\`nginx
# Fragmento de configuración de Nginx como Gateway
server {
    listen 80;
    server_name api.santisolutions.com;

    location /api/v1/users {
        proxy_pass http://user_service:8000;
        proxy_set_header Host $host;
    }

    location /api/v1/messages {
        proxy_pass http://message_service:8001;
        proxy_set_header Host $host;
    }
}
\`\`\`

### Docker Compose para Desarrollo
Mediante un archivo \`docker-compose.yml\` bien estructurado, levantamos el stack completo (Nginx, PHP-FPM, PostgreSQL, Redis) en un único comando, facilitando la incorporación de nuevos desarrolladores al equipo instantáneamente.`,
    content_en: `The classic "it works on my machine" is continuous delivery's number one enemy. Docker and containerization solve this by packaging exactly the operating system, dependencies, and environment variables of each service.

### Designing the Network Topology of Santi Solutions
For a robust architecture in Santi Solutions, each microservice must be isolated from others at the network layer:
1. **External Network (Frontend Network):** Exposes only the Nginx container to the outside world.
2. **Internal Network (Backend Network):** Allows microservices to communicate with each other and with their respective databases, keeping them inaccessible from the outside.

### Configuring Nginx as a Reverse Proxy
Nginx acts as the single entry point (API Gateway), redirecting incoming traffic to the appropriate microservice based on the URI prefix:

\`\`\`nginx
# Nginx Gateway configuration snippet
server {
    listen 80;
    server_name api.santisolutions.com;

    location /api/v1/users {
        proxy_pass http://user_service:8000;
        proxy_set_header Host $host;
    }

    location /api/v1/messages {
        proxy_pass http://message_service:8001;
        proxy_set_header Host $host;
    }
}
\`\`\`

### Docker Compose for Development
Through a well-structured \`docker-compose.yml\` file, we spin up the full stack (Nginx, PHP-FPM, PostgreSQL, Redis) in a single command, making it incredibly easy for new developers to join the team instantly.`,
    category: 'DevOps',
    category_en: 'DevOps',
    readTime: '5 min lectura',
    readTime_en: '5 min read',
    date: '2026-04-12',
    tags: ['SantiSolutions', 'Docker', 'Nginx', 'DevOps', 'Microservicios'],
    github_url: 'https://github.com/SantiDev-Soc/Santi-Solutions.git'
  },
  {
    id: '4',
    title: 'Construyendo un Portafolio Full-Stack Seguro con Vue 3, TypeScript y API REST',
    title_en: 'Building a Secure Full-Stack Portfolio with Vue 3, TypeScript and REST API',
    summary: 'Diseño e ingeniería de este portafolio profesional: arquitectura modular en Vue 3, monitorización HTTP en tiempo real, integración REST API y despliegue en contenedor.',
    summary_en: 'Engineering and design of this professional portfolio: modular Vue 3 architecture, real-time HTTP monitoring, REST API integration, and containerized deployment.',
    content: `Un portafolio profesional de ingeniería de software debe ser una demostración viva de buenas prácticas de código, seguridad y arquitectura. En este artículo explico cómo diseñé e implementé la aplicación que estás navegando actualmente.

### 1. Arquitectura Frontend Modular con Vue 3 y TypeScript
El frontend está desarrollado en **Vue 3 (Composition API)** con TypeScript para garantizar estricto tipado estático:
- **Separación de responsabilidades:** Componentes limpios en \`src/components/sections/\` y modales de gestión desacoplados.
- **Composables de API (\`useApi\` y \`monitoredFetch\`):** Abstracciones reactivas para canalizar peticiones HTTP.
- **Sincronización Inteligente:** Fallback de datos iniciales en memoria cuando la API externa no está conectada y mapeo automático cuando la base de datos responde.

### 2. Monitorización de Tráfico HTTP en Tiempo Real (\`API_TRAFFIC_MONITOR.LOG\`)
Para brindar visibilidad transparente sobre la comunicación cliente-servidor:
- Toda petición entrante/saliente atraviesa el wrapper \`monitoredFetch\`.
- Captura la URL objetivo, verbo HTTP, tiempo de respuesta (ms) y estado (200 OK, 404 Not Found, etc.).
- Muestra una consola interactiva en el Dashboard para auditar la actividad de la API en tiempo real.

\`\`\`typescript
// Fragmento del interceptor de tráfico HTTP
export const monitoredFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const startTime = performance.now();
  recordRequest(method, url, payload);
  const response = await fetch(url, options);
  const duration = Math.round(performance.now() - startTime);
  updateRequestLog(id, response.status, duration);
  return response;
};
\`\`\`

### 3. Seguridad y Integración RESTful
- **Cero claves expuestas:** Headers de autenticación protegidos mediante Bearer tokens.
- **Resiliencia de Rutas:** Reintentos inteligentes entre convenciones plurales y singulares de Laravel (\`/contacts/create\`, \`/messages/create\`).
- **Persistencia en Base de Datos:** Eliminación de almacenamiento local volátil para garantizar que la información leída en el dashboard provenga de la base de datos real.`,
    content_en: `A professional software engineering portfolio should be a living demonstration of code quality, security, and architecture. In this article I explain how I designed and implemented the current application you are browsing.

### 1. Modular Frontend Architecture with Vue 3 & TypeScript
The frontend is built with **Vue 3 (Composition API)** and TypeScript for strict static typing:
- **Separation of concerns:** Clean components inside \`src/components/sections/\` and decoupled management modals.
- **API Composables (\`useApi\` and \`monitoredFetch\`):** Reactive abstractions to pipe HTTP requests.
- **Smart Synchronization:** Initial memory fallback data when the external API is offline, auto-mapping live responses once the database connects.

### 2. Real-Time HTTP Traffic Monitor (\`API_TRAFFIC_MONITOR.LOG\`)
To provide full visibility into client-server communication:
- Every request passes through the \`monitoredFetch\` wrapper.
- Captures target URL, HTTP verb, response latency (ms), and status code (200 OK, 404 Not Found, etc.).
- Displays an interactive terminal on the Dashboard to audit live API traffic.

\`\`\`typescript
// HTTP Traffic interceptor snippet
export const monitoredFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const startTime = performance.now();
  recordRequest(method, url, payload);
  const response = await fetch(url, options);
  const duration = Math.round(performance.now() - startTime);
  updateRequestLog(id, response.status, duration);
  return response;
};
\`\`\`

### 3. Security and RESTful Integration
- **Zero exposed keys:** Protected authentication headers using Bearer tokens.
- **Route Resilience:** Smart fallbacks across Laravel plural and singular route conventions (\`/contacts/create\`, \`/messages/create\`).
- **Database Persistence:** Elimination of volatile local storage to ensure dashboard data comes exclusively from the real database.`,
    category: 'Full-Stack',
    category_en: 'Full-Stack',
    readTime: '7 min lectura',
    readTime_en: '7 min read',
    date: '2026-07-26',
    tags: ['Portfolio', 'Vue 3', 'TypeScript', 'Laravel', 'REST API', 'Docker'],
    github_url: 'https://github.com/SantiDev-Soc/Vue_Laravel_portfolio.git'
  }
];

export const DEFAULT_MESSAGES: Message[] = [
  {
    id: '1',
    name: 'Alejandro Gómez',
    email: 'alejandro.gomez@techsolutions.es',
    subject: 'Propuesta de Colaboración Backend',
    message: 'Hola Santiago, vi tu perfil especializado en Symfony y DDD. Estamos buscando un desarrollador fullstack con fuerte inclinación a backend para un proyecto de microservicios financieros en AWS. ¿Tienes disponibilidad para una charla breve la próxima semana?',
    date: '2026-06-26 15:42',
    read: false
  },
  {
    id: '2',
    name: 'Laura Martínez',
    email: 'l.martinez@startuphub.co',
    subject: 'Pregunta sobre Laravel Reverb',
    message: '¡Excelente artículo sobre WebSockets con Reverb! He tenido problemas de escalabilidad con Redis en un proyecto mediano, ¿recomiendas usar Laravel Horizon para monitorear las colas de mensajería en producción?',
    date: '2026-06-25 09:15',
    read: true
  }
];

export const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: '1',
    title: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
    title_en: 'Higher Degree in Web Applications Development (DAW)',
    issuer: 'Ilerna',
    date: '2025',
    description: 'Estudios oficiales de desarrollo web enfocados en programación frontend y backend, bases de datos relacionales, diseño de interfaces y despliegue de aplicaciones.',
    description_en: 'Official web development studies focused on frontend and backend programming, relational databases, interface design, and application deployment.',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Especialización en Ciberseguridad y Hacking Ético',
    title_en: 'Specialization in Cybersecurity & Ethical Hacking',
    issuer: 'Estudios Activos / Autoaprendizaje',
    date: '2026 (En curso)',
    description: 'Profundizando de forma continua en seguridad ofensiva, auditorías web, OWASP Top 10, bastionado de servidores Linux (Hardening) y análisis forense de malware.',
    description_en: 'Continuously deepening knowledge in offensive security, web auditing, OWASP Top 10, Linux server hardening, and malware forensics.',
    status: 'in_progress'
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Santi Solutions',
    title_en: 'Santi Solutions',
    description: 'Plataforma de consultoría y reformas premium para Florida, USA. Diseñado bajo Arquitectura Hexagonal y DDD (Domain-Driven Design). Orquestado con un monorepo Docker de 12 contenedores, incluyendo 6 servicios web Laravel 11/PHP 8.4, 5 workers asíncronos para comunicación basada en eventos mediante Redis Pub/Sub, y un pool de 6 bases de datos PostgreSQL aisladas.',
    description_en: 'Premium consulting and renovation platform for Florida, USA. Designed under Hexagonal Architecture and DDD (Domain-Driven Design). Orchestrated with a Docker monorepo of 12 containers, including 6 Laravel 11/PHP 8.4 web services, 5 asynchronous workers for event-based communication via Redis Pub/Sub, and a pool of 6 isolated PostgreSQL databases.',
    status: 'ESTADO: DESARROLLO',
    status_en: 'STATUS: DEVELOPMENT',
    technologies: ['Laravel 11', 'Vue 3', 'DDD & Hexagonal', 'Redis EDA', 'Docker (12 Cont.)', 'PostgreSQL'],
    link_label: 'ENLACE PROYECTO:',
    link_label_en: 'PROJECT LINK:',
    link_url: 'https://santisolutions.com',
    github_url: 'https://github.com/SantiDev-Soc/Santi-Solutions.git',
    category: 'Globe'
  },
  {
    id: '2',
    title: 'Tabamba - Podcasting & Audio Streaming Backend (DDD, CQRS & Event-Driven)',
    title_en: 'Tabamba - Podcasting & Audio Streaming Backend (DDD, CQRS & Event-Driven)',
    description: 'Plataforma y arquitectura backend para podcasters y creadores de audio. Desarrollada en Symfony 7 / Laravel 11 y PHP 8.4 bajo principios de DDD (Domain-Driven Design), CQRS y Event-Driven Architecture para gestión desacoplada de dominios, handlers de comandos/consultas, normalización de feeds RSS y streaming de audio de baja latencia.',
    description_en: 'Backend architecture and platform for podcasters and audio creators. Built in Symfony 7 / Laravel 11 and PHP 8.4 applying DDD (Domain-Driven Design), CQRS, and Event-Driven Architecture for decoupled domain logic, command/query handlers, RSS feed normalization, and low-latency audio streaming.',
    status: 'ESTADO: PRODUCCIÓN',
    status_en: 'STATUS: PRODUCTION',
    technologies: ['Laravel 11 / Symfony', 'PHP 8.4', 'DDD & CQRS', 'Event-Driven', 'Audio Streaming', 'PostgreSQL', 'Docker'],
    link_label: 'VER REPOSITORIO TABAMBA:',
    link_label_en: 'VIEW TABAMBA REPO:',
    link_url: 'https://github.com/SantiDev-Soc/Back-Podcasters.git',
    github_url: 'https://github.com/SantiDev-Soc/Back-Podcasters.git',
    category: 'Layers'
  },
  {
    id: '3',
    title: 'MyChat - Sistema de Mensajería Distribuida en Tiempo Real',
    title_en: 'MyChat - Distributed Real-Time Messaging System',
    description: 'Despliegue de un sistema escalable de WebSockets utilizando Laravel Reverb, colas de trabajo distribuidas y caché de baja latencia mediante Redis. Implementación de bases de datos aisladas para comunicación inmediata, robusta y tolerante a fallos.',
    description_en: 'Deployment of a scalable WebSocket system using Laravel Reverb, distributed queues, and low-latency cache via Redis. Implementation of isolated databases for immediate, robust, and fault-tolerant communication.',
    status: 'ESTADO: PRODUCCIÓN',
    status_en: 'STATUS: PRODUCTION',
    technologies: ['Laravel 11', 'Docker', 'Redis', 'PostgreSQL', 'Laravel Reverb'],
    link_label: 'SISTEMA DE MENSAJERÍA:',
    link_label_en: 'MESSAGING SYSTEM:',
    link_url: 'https://github.com/SantiDev-Soc/Mmy-Chat-Microservices-Architecture.git',
    github_url: 'https://github.com/SantiDev-Soc/Mmy-Chat-Microservices-Architecture.git',
    category: 'Layers'
  },
  {
    id: '4',
    title: 'Motor de Portafolio Seguro & Pipeline Full-Stack',
    title_en: 'Secure Portfolio Engine & Full-Stack Pipeline',
    description: 'Sistema modular interactivo desarrollado en Vue 3 y TypeScript, dockerizado bajo un entorno Alpine seguro y preparado para enlazarse con una API backend de Laravel para persistencia duradera y respuestas de email automáticas.',
    description_en: 'Interactive modular system developed in Vue 3 and TypeScript, dockerized under a secure Alpine environment and prepared to link with a Laravel backend API for durable persistence and automatic email replies.',
    status: 'ESTADO: INTEGRACIÓN',
    status_en: 'STATUS: INTEGRATION',
    technologies: ['Vue 3', 'Docker', 'TypeScript', 'Laravel Connect'],
    link_label: 'VER REPOSITORIO PORTAFOLIO:',
    link_label_en: 'VIEW PORTFOLIO REPO:',
    link_url: 'https://github.com/SantiDev-Soc/Vue_Laravel_portfolio.git',
    github_url: 'https://github.com/SantiDev-Soc/Vue_Laravel_portfolio.git',
    category: 'Terminal'
  }
];

