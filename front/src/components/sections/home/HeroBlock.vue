<script setup lang="ts">
import {
  Terminal,
  Mail,
  Phone,
  Linkedin,
  Github,
  ArrowRight,
  MapPin,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-vue-next';
import { useI18n } from '../../../composables/useI18n';

defineEmits<{
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <!-- Columna Izquierda: Presentación Principal -->
    <div class="lg:col-span-7 space-y-6">
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <Terminal class="h-3.5 w-3.5" />
        <span>{{ t('home.file_label') }}</span>
      </div>

      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
        {{ t('home.title_1') }} <br class="hidden md:inline" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">{{ t('home.title_2') }}</span>
      </h1>

      <p class="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
        {{ t('home.subtitle') }}
      </p>

      <!-- Redes e Info Rápida -->
      <div class="flex flex-wrap gap-3 pt-1">
        <a href="mailto:santiago9605es@gmail.com" class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#1A1E26] hover:bg-[#252B38] text-slate-300 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-all text-xs md:text-sm font-mono">
          <Mail class="h-4 w-4 text-emerald-400" />
          <span>santiago9605es@gmail.com</span>
        </a>
        <a href="tel:+31644708530" class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#1A1E26] hover:bg-[#252B38] text-slate-300 hover:text-white border border-white/5 hover:border-emerald-500/30 transition-all text-xs md:text-sm font-mono">
          <Phone class="h-4 w-4 text-emerald-400" />
          <span>+31 644 70 85 30</span>
        </a>
      </div>

      <div class="flex flex-wrap items-center gap-4 pt-2">
        <div class="flex items-center space-x-3">
          <a href="https://github.com/SantiDev-Soc" target="_blank" class="p-2.5 rounded-lg bg-[#14171C] border border-white/5 text-slate-400 hover:text-white hover:border-emerald-500/40 transition-all" title="GitHub">
            <Github class="h-5 w-5" />
          </a>
          <a href="https://www.linkedin.com/in/rsantdev" target="_blank" class="p-2.5 rounded-lg bg-[#14171C] border border-white/5 text-slate-400 hover:text-white hover:border-emerald-500/40 transition-all" title="LinkedIn">
            <Linkedin class="h-5 w-5" />
          </a>
        </div>

        <button @click="$emit('navigate', 'contact')" class="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold px-6 py-2.5 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 text-sm">
          <span>{{ t('home.cta_talk') }}</span>
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Columna Derecha: TARJETA DE PRESENTACIÓN OPCIÓN 1 -->
    <div class="lg:col-span-5 relative">
      <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-indigo-500/20 to-teal-500/30 opacity-40 blur-xl"></div>

      <div class="relative bg-[#14171C] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">

        <!-- Header con indicador de ventana y status -->
        <div class="flex items-center justify-between border-b border-white/5 pb-3.5">
          <div class="flex space-x-1.5">
            <span class="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span class="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500/80"></span>
          </div>

          <div class="flex items-center space-x-1.5 bg-[#0B0D11] px-3 py-1 rounded-lg border border-white/5 text-xs font-mono text-emerald-400 font-semibold">
            <ShieldCheck class="h-3.5 w-3.5" />
            <span>{{ t('home.card.status_badge') }}</span>
          </div>
        </div>

        <!-- TARJETA DE PERFIL DESTACADA -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <!-- Marco Foto de Perfil con Halo Glow -->
            <div class="relative group shrink-0">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-50 blur group-hover:opacity-80 transition-opacity"></div>
              <img
                  src="/assets/santiago.svg"
                  alt="Santiago Velázquez"
                  referrerPolicy="no-referrer"
                  class="relative h-24 w-24 rounded-2xl object-cover border-2 border-emerald-400/60 bg-[#0A0C10] shadow-xl group-hover:scale-105 transition-transform"
              />
              <span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#14171C] animate-pulse" :title="t('home.card.available_title')"></span>
            </div>

            <!-- Datos de Presentación -->
            <div class="space-y-1">
              <div class="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                <ShieldCheck class="h-3 w-3" />
                <span>{{ t('home.card.status_tag') }}</span>
              </div>
              <h3 class="text-xl font-bold text-white tracking-tight">{{ t('home.card.name') }}</h3>
              <p class="text-xs font-mono text-emerald-400">{{ t('home.card.role') }}</p>
              <div class="flex items-center space-x-1 text-[11px] text-slate-400 pt-0.5">
                <MapPin class="h-3 w-3 text-slate-500" />
                <span>{{ t('home.card.location') }}</span>
              </div>
            </div>
          </div>

          <!-- Badges Técnicos Destacados -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <div class="bg-[#1A1E26] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2">
              <CheckCircle2 class="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <div class="text-[10px] text-slate-400 font-mono">{{ t('home.card.arch_label') }}</div>
                <div class="text-xs font-bold text-slate-200">{{ t('home.card.arch_value') }}</div>
              </div>
            </div>

            <div class="bg-[#1A1E26] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2">
              <CheckCircle2 class="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <div class="text-[10px] text-slate-400 font-mono">{{ t('home.card.backend_label') }}</div>
                <div class="text-xs font-bold text-slate-200">{{ t('home.card.backend_value') }}</div>
              </div>
            </div>

            <div class="bg-[#1A1E26] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2">
              <CheckCircle2 class="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <div class="text-[10px] text-slate-400 font-mono">{{ t('home.card.containers_label') }}</div>
                <div class="text-xs font-bold text-slate-200">{{ t('home.card.containers_value') }}</div>
              </div>
            </div>

            <div class="bg-[#1A1E26] p-2.5 rounded-lg border border-white/5 flex items-center space-x-2">
              <CheckCircle2 class="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <div class="text-[10px] text-slate-400 font-mono">{{ t('home.card.frontend_label') }}</div>
                <div class="text-xs font-bold text-slate-200">{{ t('home.card.frontend_value') }}</div>
              </div>
            </div>
          </div>

          <!-- Cuadro de resumen profesional -->
          <div class="bg-[#0D0F13] p-3 rounded-lg border border-emerald-500/20 text-xs text-slate-300 leading-relaxed flex items-start space-x-2">
            <Sparkles class="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {{ t('home.card.summary') }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

