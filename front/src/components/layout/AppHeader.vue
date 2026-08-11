<script setup lang="ts">
import { Settings, Globe } from 'lucide-vue-next';
import { useI18n } from '../../composables/useI18n';

defineProps<{
  currentTab: 'home' | 'blog' | 'dashboard' | 'contact';
  unreadCount: number;
}>();

defineEmits<{
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t, locale, toggleLocale } = useI18n();
</script>

<template>
  <header class="sticky top-0 z-40 bg-[#0F1116]/90 backdrop-blur-md border-b border-white/5">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3 cursor-pointer" @click="$emit('navigate', 'home')">
        <span class="font-mono font-semibold tracking-wider text-white">{{ t('nav.logo') }}<span class="text-emerald-400">.DEV</span></span>
      </div>

      <nav class="hidden md:flex items-center space-x-8">
        <button
            @click="$emit('navigate', 'home')"
            :class="[currentTab === 'home' ? 'text-emerald-400 font-medium' : 'text-[#94A3B8] hover:text-white transition-colors']"
            class="text-sm font-mono"
            id="nav-home"
        >
          {{ t('nav.home') }}
        </button>
        <button
            @click="$emit('navigate', 'blog')"
            :class="[currentTab === 'blog' ? 'text-emerald-400 font-medium' : 'text-[#94A3B8] hover:text-white transition-colors']"
            class="text-sm font-mono"
            id="nav-blog"
        >
          {{ t('nav.blog') }}
        </button>
        <button
            @click="$emit('navigate', 'contact')"
            :class="[currentTab === 'contact' ? 'text-emerald-400 font-medium' : 'text-[#94A3B8] hover:text-white transition-colors']"
            class="text-sm font-mono"
            id="nav-contact"
        >
          {{ t('nav.contact') }}
        </button>
      </nav>

      <div class="flex items-center space-x-3">
        <!-- Selector de Idioma con Detección Regional -->
        <button
            @click="toggleLocale()"
            class="px-2.5 py-1.5 rounded-lg border border-white/5 bg-[#14171C] hover:border-emerald-500/30 text-[#94A3B8] hover:text-white text-xs font-mono transition-all flex items-center space-x-1.5"
            title="Cambiar idioma / Switch language"
            id="locale-switcher"
        >
          <Globe class="h-3.5 w-3.5 text-emerald-400" />
          <span>{{ locale.toUpperCase() }}</span>
          <span class="text-[9px] text-emerald-400/80 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">GEO</span>
        </button>

        <!-- Botón de Acceso al Dashboard -->
        <button
            @click="$emit('navigate', 'dashboard')"
            :class="[currentTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-[#1A1E26] text-slate-300 hover:text-white border-white/10 hover:border-slate-600']"
            class="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-2 transition-all group"
            id="nav-dashboard"
        >
          <Settings class="h-4 w-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
          <span>{{ t('nav.dashboard') }}</span>
          <span v-if="unreadCount > 0" class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>
    </div>
  </header>
</template>
