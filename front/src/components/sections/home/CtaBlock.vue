<script setup lang="ts">
import { Send } from 'lucide-vue-next';
import { useI18n } from '../../../composables/useI18n';

defineEmits<{
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="bg-[#14171C] border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
    <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 opacity-30 blur-2xl"></div>
    <div class="relative z-10 space-y-6">
      <h2 class="text-2xl md:text-3xl font-extrabold text-white">{{ t('home.cta_title') }}</h2>
      <p class="text-[#94A3B8] max-w-xl mx-auto text-sm md:text-base">
        {{ t('home.cta_desc') }}
      </p>
      <div>
        <button @click="$emit('navigate', 'contact')" class="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-lg active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
          <span>{{ t('home.cta_btn') }}</span>
          <Send class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>
