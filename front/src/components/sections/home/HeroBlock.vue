<script setup lang="ts">
import { 
  Terminal, 
  Mail, 
  Phone, 
  Linkedin, 
  Github,
  ArrowRight
} from 'lucide-vue-next';
import { useI18n } from '../../../composables/useI18n';

defineEmits<{
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <div class="lg:col-span-7 space-y-6">
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <Terminal class="h-3.5 w-3.5" />
        <span>{{ t('home.file_label') }}</span>
      </div>

      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
        {{ t('home.title_1') }} <br class="hidden md:inline" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">{{ t('home.title_2') }}</span>
      </h1>

      <p class="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
        {{ t('home.subtitle') }}
      </p>

      <!-- Redes e Info Rápida -->
      <div class="flex flex-wrap gap-4 pt-2">
        <a href="mailto:santiago9605es@gmail.com" class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#1A1E26] hover:bg-[#252B38] text-slate-300 border border-white/5 transition-colors text-sm">
          <Mail class="h-4 w-4 text-emerald-400" />
          <span>santiago9605es@gmail.com</span>
        </a>
        <a href="tel:+34691318563" class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#1A1E26] hover:bg-[#252B38] text-slate-300 border border-white/5 transition-colors text-sm">
          <Phone class="h-4 w-4 text-emerald-400" />
          <span>+34 691 31 85 63</span>
        </a>
      </div>

      <div class="flex items-center space-x-4 pt-4">
        <a href="https://github.com/SantiDev-Soc" target="_blank" class="text-slate-400 hover:text-white transition-colors" title="GitHub">
          <Github class="h-6 w-6" />
        </a>
        <a href="https://www.linkedin.com/in/rsantdev" target="_blank" class="text-slate-400 hover:text-white transition-colors" title="LinkedIn">
          <Linkedin class="h-6 w-6" />
        </a>
        <button @click="$emit('navigate', 'contact')" class="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
          <span>{{ t('home.cta_talk') }}</span>
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="lg:col-span-5 relative">
      <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-20 blur-xl"></div>
      
      <div class="relative bg-[#14171C] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
        <!-- Header de simulación IDE -->
        <div class="flex items-center justify-between border-b border-white/5 pb-4">
          <div class="flex space-x-1.5">
            <span class="h-3 w-3 rounded-full bg-red-500/70"></span>
            <span class="h-3 w-3 rounded-full bg-yellow-500/70"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500/70"></span>
          </div>
          <span class="text-xs font-mono text-slate-500">{{ t('home.ide_file') }}</span>
        </div>

        <div class="font-mono text-xs md:text-sm space-y-2 text-slate-300">
          <p><span class="text-indigo-400">class</span> <span class="text-emerald-400">BackendDeveloper</span> {</p>
          <p class="pl-4"><span class="text-indigo-400">public</span> <span class="text-teal-400">array</span> <span class="text-amber-400">$focus</span> = [</p>
          <p class="pl-8"><span class="text-emerald-500">'Domain_Driven_Design'</span>,</p>
          <p class="pl-8"><span class="text-emerald-500">'CQRS_Architecture'</span>,</p>
          <p class="pl-8"><span class="text-emerald-500">'Database_Performance'</span></p>
          <p class="pl-4">];</p>
          <p class="pl-4"><span class="text-indigo-400">public function</span> <span class="text-teal-400">optimize</span>() {</p>
          <p class="pl-8"><span class="text-indigo-400">return</span> <span class="text-emerald-400">{{ t('home.ide_return') }}</span>;</p>
          <p class="pl-4">}</p>
          <p>}</p>
        </div>

        <div class="bg-[#1A1E26] p-3 rounded border border-emerald-500/20 text-[11px] leading-relaxed text-[#94A3B8]">
          <div class="text-emerald-400 font-bold mb-1">{{ t('home.ide_focus_title') }}</div>
          {{ t('home.ide_focus_text') }}
        </div>
      </div>
    </div>
  </div>
</template>
