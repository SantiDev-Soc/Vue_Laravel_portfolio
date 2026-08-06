import { Post, Message, Certification, Project } from './types';

export const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'Desacoplando la Lógica de Negocio con DDD en Symfony 7',
    title_en: 'Decoupling Business Logic with DDD in Symfony 7',
    summary: 'Cómo estructurar el dominio utilizando Handlers, DTOs y Repositorios independientes para evitar el acoplamiento con Doctrine DBAL.',
    summary_en: 'How to structure the domain using Handlers, DTOs, and independent Repositories to avoid coupling with Doctrine DBAL.',
    content: `La arquitectura de software moderna exige que nuestras aplicaciones sean altamente mantenibles y escalables. En ecosistemas complejos, acoplar la lógica de negocio directamente al ORM (como Doctrine o Eloquent) suele ser el primer paso hacia el temido "código espagueti".

### Implementando DDD en Symfony
Para resolver esto, recurrimos al **Domain-Driven Design (DDD)** táctico, estructurando nuestra aplicación en tres capas fundamentales:

1. **Capa de Dominio (Domain):** Alberga las reglas de negocio puras. Aquí definimos nuestros Agregados, Entidades, Objetos de Valor (Value Objects) y contratos de Repositorios. Es 100% independiente de cualquier framework o base de datos.
2. **Capa de Aplicación (Application):** Orquesta el flujo de datos. En esta capa implementamos el patrón **CQRS** (Command Query Responsibility Segregation). Los **Command Handlers** gestionan acciones de escritura, mientras que los **Query Handlers** resuelven la lectura de datos.
3. **Capa de Infraestructura (Infrastructure):** Contiene la implementación concreta de los contratos. Aquí vive el mapeo de base de datos con Doctrine, el envío de emails, colas de mensajería, etc.

\`\`\`php
// Ejemplo de un Command Handler desacoplado
namespace App\\Application\\CommandHandler;

use App\\Domain\\Repository\\UserRepositoryInterface;
use App\\Application\\Command\\RegisterUserCommand;
use App\\Domain\\Entity\\User;

class RegisterUserHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function __invoke(RegisterUserCommand $command): void
    {
        $user = User::create(
            $command->getEmail(),
            $command->getPassword()
        );
        
        $this->userRepository->save($user);
    }
}
\`\`\`

### Beneficios del Desacoplamiento
- **Testabilidad:** Los tests unitarios no requieren levantar bases de datos; testeamos el dominio con mocks puros.
- **Mantenibilidad:** Cambiar la base de datos (por ejemplo, de MySQL a PostgreSQL) solo afecta a la capa de Infraestructura, el Dominio permanece intacto.`,
    content_en: `Modern software engineering demands that our applications be highly maintainable and scalable. In complex ecosystems, coupling business logic directly to the ORM (like Doctrine or Eloquent) is usually the first step toward the dreaded "spaghetti code."

### Implementing DDD in Symfony
To solve this, we turn to tactical **Domain-Driven Design (DDD)**, structuring our application into three fundamental layers:

1. **Domain Layer:** Houses pure business rules. Here we define our Aggregates, Entities, Value Objects, and Repository contracts. It is 100% independent of any framework or database.
2. **Application Layer:** Orchestrates the data flow. In this layer, we implement the **CQRS** (Command Query Responsibility Segregation) pattern. **Command Handlers** manage write actions, while **Query Handlers** handle reading data.
3. **Infrastructure Layer:** Contains the concrete implementation of the contracts. Here live the database mapping with Doctrine, email sending, message queues, etc.

\`\`\`php
// Example of a decoupled Command Handler
namespace App\\Application\\CommandHandler;

use App\\Domain\\Repository\\UserRepositoryInterface;
use App\\Application\\Command\\RegisterUserCommand;
use App\\Domain\\Entity\\User;

class RegisterUserHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function __invoke(RegisterUserCommand $command): void
    {
        $user = User::create(
            $command->getEmail(),
            $command->getPassword()
        );
        
        $this->userRepository->save($user);
    }
}
\`\`\`

### Benefits of Decoupling
- **Testability:** Unit tests do not require starting databases; we test the domain with pure mocks.
- **Maintainability:** Changing the database (e.g., from MySQL to PostgreSQL) only affects the Infrastructure layer; the Domain remains intact.`,
    category: 'Arquitectura',
    category_en: 'Architecture',
    readTime: '6 min lectura',
    readTime_en: '6 min read',
    date: '2026-06-15',
    tags: ['PHP', 'Symfony', 'DDD', 'CQRS']
  },
  {
    id: '2',
    title: 'Arquitectura de Mensajería Distribuida con Laravel Reverb y Redis',
    title_en: 'Distributed Messaging Architecture with Laravel Reverb and Redis',
    summary: 'Diseño y optimización de un sistema de mensajería en tiempo real utilizando Laravel Reverb, colas distribuidas y aislamiento de base de datos.',
    summary_en: 'Designing and optimizing a real-time messaging system using Laravel Reverb, distributed queues, and database isolation.',
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
    tags: ['Laravel', 'Redis', 'PostgreSQL', 'WebSockets']
  },
  {
    id: '3',
    title: 'Orquestación de Microservicios Backend con Docker y Nginx',
    title_en: 'Backend Microservices Orchestration with Docker and Nginx',
    summary: 'Guía práctica para construir un entorno de desarrollo idéntico a producción usando contenedores Docker aislados y Nginx como API Gateway.',
    summary_en: 'Practical guide to building a development environment identical to production using isolated Docker containers and Nginx as an API Gateway.',
    content: `El clásico "en mi máquina funciona" es el enemigo número uno de la entrega continua. Docker y la contenerización resuelven esto al empaquetar de forma exacta el sistema operativo, dependencias y variables de entorno de cada servicio.

### Diseñando la Topología de Red
Para una arquitectura robusta, cada microservicio debe estar aislado de los demás en la capa de red:
1. **Red Externa (Frontend Network):** Expone solo el contenedor Nginx al mundo exterior.
2. **Red Interna (Backend Network):** Permite que los microservicios se comuniquen entre sí y con sus respectivas bases de datos, manteniéndolas inaccesibles de forma externa.

### Configurando Nginx como Reverse Proxy
Nginx actúa como la puerta de entrada única (API Gateway), redirigiendo el tráfico entrante al microservicio adecuado según el prefijo de la URI:

\`\`\`nginx
# Fragmento de configuración de Nginx como Gateway
server {
    listen 80;
    server_name api.santiago.dev;

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

### Designing the Network Topology
For a robust architecture, each microservice must be isolated from others at the network layer:
1. **External Network (Frontend Network):** Exposes only the Nginx container to the outside world.
2. **Internal Network (Backend Network):** Allows microservices to communicate with each other and with their respective databases, keeping them inaccessible from the outside.

### Configuring Nginx as a Reverse Proxy
Nginx acts as the single entry point (API Gateway), redirecting incoming traffic to the appropriate microservice based on the URI prefix:

\`\`\`nginx
# Nginx Gateway configuration snippet
server {
    listen 80;
    server_name api.santiago.dev;

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
    tags: ['Docker', 'Nginx', 'DevOps', 'Microservicios']
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
    category: 'Globe'
  },
  {
    id: '2',
    title: 'Sistema de Mensajería Distribuida en Tiempo Real',
    title_en: 'Distributed Real-Time Messaging System',
    description: 'Despliegue de un sistema escalable de WebSockets utilizando Laravel Reverb, colas de trabajo distribuidas y caché de baja latencia mediante Redis. Implementación de bases de datos aisladas para comunicación inmediata, robusta y tolerante a fallos.',
    description_en: 'Deployment of a scalable WebSocket system using Laravel Reverb, distributed queues, and low-latency cache via Redis. Implementation of isolated databases for immediate, robust, and fault-tolerant communication.',
    status: 'ESTADO: PRODUCCIÓN',
    status_en: 'STATUS: PRODUCTION',
    technologies: ['Laravel 11', 'Docker', 'Redis', 'PostgreSQL'],
    link_label: 'SISTEMA DE MENSAJERÍA:',
    link_label_en: 'MESSAGING SYSTEM:',
    link_url: 'https://mychat.com',
    category: 'Layers'
  },
  {
    id: '3',
    title: 'Motor de Portafolio Seguro & Pipeline Full-Stack',
    title_en: 'Secure Portfolio Engine & Full-Stack Pipeline',
    description: 'Sistema modular interactivo desarrollado en Vue 3 y TypeScript, dockerizado bajo un entorno Alpine seguro y preparado para enlazarse con una API backend de Laravel para persistencia duradera y respuestas de email automáticas.',
    description_en: 'Interactive modular system developed in Vue 3 and TypeScript, dockerized under a secure Alpine environment and prepared to link with a Laravel backend API for durable persistence and automatic email replies.',
    status: 'ESTADO: INTEGRACIÓN',
    status_en: 'STATUS: INTEGRATION',
    technologies: ['Vue 3', 'Docker', 'TypeScript', 'Laravel Connect'],
    link_label: 'ENLACE PROYECTO:',
    link_label_en: 'PROJECT LINK:',
    link_url: '',
    category: 'Terminal'
  }
];

