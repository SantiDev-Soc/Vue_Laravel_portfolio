<script setup lang="ts">
import { Award, Calendar, ArrowUpRight, ShieldCheck, Bookmark, GraduationCap } from 'lucide-vue-next';
import { Certification } from '../../../types';
import { useI18n } from '../../../composables/useI18n';

defineProps<{
  certifications: Certification[];
}>();

const { locale } = useI18n();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, year, month, day] = match;
    const monthsEs = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const monthsEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = locale.value === 'es' ? monthsEs[monthIndex] : monthsEn[monthIndex];
      return `${monthName} ${year}`;
    }

    return locale.value === 'es' ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
  }
  return dateStr;
};
</script>

<template>
  <div class="space-y-8 animate-fade-in" id="certifications-block">
    <!-- CABECERA DE SECCIÓN -->
    <div class="space-y-2">
      <div class="inline-flex items-center space-x-2 text-emerald-400 text-xs font-mono">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>ACADEMIC_AUDIT_LOG // CREDENTIALS</span>
      </div>
      <h2 class="text-2xl font-bold text-white tracking-tight">
        {{ locale === 'es' ? 'Certificaciones y Acreditaciones' : 'Certifications & Credentials' }}
      </h2>
      <p class="text-sm text-[#94A3B8] max-w-2xl">
        {{ locale === 'es'
          ? 'Titulaciones oficiales e itinerarios de especialización en ciberseguridad y desarrollo de software.'
          : 'Official degrees and specialized training pathways in cybersecurity and software development.'
        }}
      </p>
    </div>

    <!-- RECILLA DE CERTIFICACIONES -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
          v-for="cert in certifications"
          :key="cert.id"
          class="group relative bg-[#14171C] border border-white/5 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
      >
        <!-- Decoración de fondo en hover -->
        <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <!-- Insignia de estado y emisor -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div
                  class="p-2 rounded-lg"
                  :class="[
                  cert.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                ]"
              >
                <GraduationCap v-if="cert.status === 'completed'" class="h-4 w-4" />
                <ShieldCheck v-else class="h-4 w-4 animate-pulse" />
              </div>

              <span class="text-xs font-mono text-slate-400 font-semibold">
                {{ cert.issuer }}
              </span>
            </div>

            <span
                class="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                :class="[
                cert.status === 'completed'
                  ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400'
                  : 'bg-indigo-500/5 border-indigo-500/25 text-indigo-400'
              ]"
            >
              {{
                cert.status === 'completed'
                    ? (locale === 'es' ? 'COMPLETADO' : 'COMPLETED')
                    : (locale === 'es' ? 'ESTUDIANDO (EN CURSO)' : 'ENROLLED (IN PROGRESS)')
              }}
            </span>
          </div>

          <!-- Título y Descripción -->
          <div class="space-y-1">
            <h3 class="text-md font-bold text-white group-hover:text-emerald-300 transition-colors">
              {{ locale === 'en' && cert.title_en ? cert.title_en : cert.title }}
            </h3>
            <p class="text-xs text-[#94A3B8] leading-relaxed">
              {{ locale === 'en' && cert.description_en ? cert.description_en : cert.description }}
            </p>
          </div>
        </div>

        <!-- Fecha y Enlace -->
        <div class="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div class="flex items-center space-x-1.5">
            <Calendar class="h-3.5 w-3.5 text-slate-600" />
            <span>{{ formatDate(cert.date) }}</span>
          </div>

          <a
              v-if="cert.link"
              :href="cert.link"
              target="_blank"
              class="inline-flex items-center space-x-1 text-emerald-400 hover:text-white transition-colors group/link"
          >
            <span>{{ locale === 'es' ? 'Ver Credencial' : 'Verify' }}</span>
            <ArrowUpRight class="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>

    <!-- Reflexión de Ciberseguridad activa -->
    <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-center gap-4">
      <div class="h-10 w-10 shrink-0 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
        <Award class="h-5 w-5" />
      </div>
      <div class="space-y-1 text-center md:text-left">
        <h4 class="text-sm font-bold text-white font-mono uppercase">
          {{ locale === 'es' ? '¿Por qué muestro mis estudios de Ciberseguridad?' : 'Why showcase in-progress Cybersecurity studies?' }}
        </h4>
        <p class="text-xs text-[#94A3B8] leading-relaxed max-w-3xl">
          {{ locale === 'es'
            ? 'La ciberseguridad es una disciplina viva que complementa directamente mi enfoque en el desarrollo backend. Diseñar APIs seguras, mitigar amenazas según OWASP, y estructurar arquitecturas robustas requiere entender cómo atacan los adversarios y cómo proteger los servidores hoy, no mañana.'
            : 'Cybersecurity is a live discipline that directly complements robust backend development. Designing secure APIs, mitigating OWASP threats, and building resilient infrastructures requires understanding how adversaries attack and how to protect servers today, not tomorrow.'
          }}
        </p>
      </div>
    </div>
  </div>
</template>
