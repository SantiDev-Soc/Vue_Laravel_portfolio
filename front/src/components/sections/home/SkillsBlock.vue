<script setup lang="ts">
import { 
  Cpu, 
  Layers, 
  Globe, 
  Terminal 
} from 'lucide-vue-next';
import { useI18n } from '../../../composables/useI18n';

const { t } = useI18n();
</script>

<template>
  <div class="space-y-8 pt-10 border-t border-white/5">
    <div>
      <p class="text-emerald-400 font-mono text-xs">{{ t('home.skills_label') }}</p>
      <h2 class="text-3xl font-bold text-white tracking-tight">{{ t('home.skills_title') }}</h2>
      <p class="text-[#94A3B8] max-w-2xl text-sm">
        {{ t('home.skills_subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Backend & Cloud -->
      <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 space-y-4">
        <div class="flex items-center space-x-3 text-emerald-400">
          <Cpu class="h-5 w-5" />
          <h3 class="font-bold text-white font-mono text-sm">{{ t('home.skills_backend') }}</h3>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          PHP, Symfony, Laravel, MySQL, PostgreSQL, Redis, Docker, Nginx, AWS (S3, RDS, EC2).
        </p>
      </div>

      <!-- Arquitectura & Negocio -->
      <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 space-y-4">
        <div class="flex items-center space-x-3 text-emerald-400">
          <Layers class="h-5 w-5" />
          <h3 class="font-bold text-white font-mono text-sm">{{ t('home.skills_database') }}</h3>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Domain-Driven Design (DDD), Command Query Responsibility Segregation (CQRS), Event-Driven Architecture, SOLID.
        </p>
      </div>

      <!-- Frontend -->
      <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 space-y-4">
        <div class="flex items-center space-x-3 text-emerald-400">
          <Globe class="h-5 w-5" />
          <h3 class="font-bold text-white font-mono text-sm">Frontend</h3>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), Vue.js, Alpine.js, integración fluida de APIs.
        </p>
      </div>

      <!-- Herramientas & QA -->
      <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 space-y-4">
        <div class="flex items-center space-x-3 text-emerald-400">
          <Terminal class="h-5 w-5" />
          <h3 class="font-bold text-white font-mono text-sm">QA & Tools</h3>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Git/GitHub, PHPUnit, Postman/Newman, CI/CD Pipelines, validación rigurosa de APIs REST.
        </p>
      </div>
    </div>
  </div>
</template>
