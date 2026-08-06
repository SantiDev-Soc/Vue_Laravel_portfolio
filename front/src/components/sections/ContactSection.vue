<script setup lang="ts">
import { Mail, Phone, MapPin } from 'lucide-vue-next';
import { Message } from '../../types';
import ContactForm from '../forms/ContactForm.vue';
import { useI18n } from '../../composables/useI18n';

defineEmits<{
  (e: 'message-sent', message: Message): void;
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="space-y-12 animate-fade-in">
    <!-- HEADER DE CONTACTO -->
    <div class="space-y-4 border-b border-white/5 pb-8">
      <p class="text-emerald-400 font-mono text-xs">{{ t('contact.label') }}</p>
      <h1 class="text-4xl font-extrabold text-white tracking-tight">{{ t('contact.title') }}</h1>
      <p class="text-[#94A3B8] max-w-2xl">
        {{ t('contact.subtitle') }}
      </p>
    </div>

    <!-- CONTENIDO: DATOS DE CONTACTO + FORMULARIO -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Tarjetas de Información -->
      <div class="lg:col-span-4 space-y-4">
        <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 flex items-start space-x-4">
          <div class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Mail class="h-5 w-5" />
          </div>
          <div>
            <h4 class="font-bold text-white text-xs font-mono uppercase">{{ t('contact.channel') }}</h4>
            <a href="mailto:santiago9605es@gmail.com" class="text-sm text-slate-300 hover:text-emerald-400 transition-colors">santiago9605es@gmail.com</a>
          </div>
        </div>

        <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 flex items-start space-x-4">
          <div class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Phone class="h-5 w-5" />
          </div>
          <div>
            <h4 class="font-bold text-white text-xs font-mono uppercase">{{ t('contact.phone') }}</h4>
            <a href="tel:+34691318563" class="text-sm text-slate-300 hover:text-emerald-400 transition-colors">+34 691 31 85 63</a>
          </div>
        </div>

        <div class="bg-[#14171C] border border-white/5 rounded-xl p-5 flex items-start space-x-4">
          <div class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <MapPin class="h-5 w-5" />
          </div>
          <div>
            <h4 class="font-bold text-white text-xs font-mono uppercase">{{ t('contact.location') }}</h4>
            <p class="text-sm text-slate-300">{{ t('contact.location_text') }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario Seguro (Extracto modular en forms/ContactForm.vue) -->
      <div class="lg:col-span-8">
        <ContactForm 
          @message-sent="$emit('message-sent', $event)" 
          @navigate="$emit('navigate', $event)" 
        />
      </div>
    </div>
  </div>
</template>
