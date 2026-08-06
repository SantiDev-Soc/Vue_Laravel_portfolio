<script setup lang="ts">
import { Terminal } from 'lucide-vue-next';
import { useI18n } from '../../../composables/useI18n';

const { t } = useI18n();
</script>

<template>
  <div class="pt-10 border-t border-white/5">
    <h2 class="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
      <Terminal class="text-emerald-400 h-5 w-5" />
      <span class="font-mono">experiencia_destacada.sh</span>
    </h2>

    <div class="space-y-8">
      <div class="relative pl-8 border-l border-emerald-500/30 space-y-2">
        <div class="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-400 border-4 border-[#0A0B0E]"></div>
        
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-xl font-bold text-white flex flex-wrap items-center gap-2">
            <span>{{ t('home.timeline_role') }}</span>
            <span class="text-base font-normal text-slate-500">{{ t('home.timeline_company') }}</span>
            <a href="https://tabamba.com" target="_blank" class="text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4">Tabamba</a>
          </h3>
          <span class="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">{{ t('home.timeline_duration') }}</span>
        </div>
        <p class="text-sm text-slate-400 leading-relaxed max-w-3xl">
          {{ t('home.timeline_desc') }}
        </p>
        <div class="flex flex-wrap gap-2 pt-2">
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">Symfony</span>
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">PHP 8</span>
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">DDD</span>
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">CQRS</span>
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">Stripe API</span>
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">PHPUnit</span>
          <span class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs border border-white/5">Postman</span>
        </div>
      </div>
    </div>
  </div>
</template>
