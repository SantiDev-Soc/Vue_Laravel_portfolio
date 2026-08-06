<script setup lang="ts">
import { ref } from 'vue';
import { Send, CheckCircle } from 'lucide-vue-next';
import { Message } from '../../types';
import { useI18n } from '../../composables/useI18n';

const emit = defineEmits<{
  (e: 'message-sent', message: Message): void;
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t, locale } = useI18n();

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSendingMessage = ref(false);
const showContactSuccess = ref(false);

const handleSendMessage = () => {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    const errorMsg = locale.value === 'es' 
      ? 'Por favor, completa los campos requeridos (Nombre, Correo y Mensaje).'
      : 'Please, fill in all required fields (Name, Email, and Message).';
    alert(errorMsg);
    return;
  }

  isSendingMessage.value = true;

  // Simular latencia de red backend
  setTimeout(() => {
    const newMessage: Message = {
      id: Date.now().toString(),
      name: contactForm.value.name,
      email: contactForm.value.email,
      subject: contactForm.value.subject || (locale.value === 'es' ? 'Sin Asunto' : 'No Subject'),
      message: contactForm.value.message,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    emit('message-sent', newMessage);

    // Resetear formulario
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    isSendingMessage.value = false;
    showContactSuccess.value = true;

    setTimeout(() => {
      showContactSuccess.value = false;
    }, 5000);
  }, 1200);
};
</script>

<template>
  <div class="bg-[#14171C] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
    
    <!-- Banner sutil de éxito -->
    <div v-if="showContactSuccess" class="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-20 animate-fade-in">
      <CheckCircle class="h-12 w-12 text-emerald-400" />
      <h3 class="text-xl font-bold text-white">{{ t('contact.form_success') }}</h3>
      <p class="text-sm text-slate-300 max-w-md">
        {{ locale === 'es' 
          ? 'Tu mensaje se ha encolado en mi base de datos interactiva local. Puedes acceder al Dashboard (Inbox) para verificar que ha entrado correctamente en mi bandeja de entrada.' 
          : 'Your message has been queued in my local interactive database. You can go to the Dashboard (Inbox) to check that it entered my inbox correctly.' }}
      </p>
      <button @click="$emit('navigate', 'dashboard')" class="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-xs font-mono hover:bg-emerald-400 transition-colors">
        {{ locale === 'es' ? 'Ir al Inbox del Dashboard' : 'Go to Dashboard Inbox' }}
      </button>
    </div>

    <!-- Formulario real -->
    <form @submit.prevent="handleSendMessage" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-2">
          <label class="text-xs font-mono text-slate-400 uppercase">{{ t('contact.form_name') }} *</label>
          <input 
            type="text" 
            v-model="contactForm.name" 
            required
            :placeholder="locale === 'es' ? 'Ej. Laura Martínez' : 'e.g. Laura Martinez'" 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-mono text-slate-400 uppercase">{{ t('contact.form_email') }} *</label>
          <input 
            type="email" 
            v-model="contactForm.email" 
            required
            :placeholder="locale === 'es' ? 'Ej. laura@startup.co' : 'e.g. laura@startup.co'" 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-mono text-slate-400 uppercase">{{ t('contact.form_subject') }}</label>
        <input 
          type="text" 
          v-model="contactForm.subject" 
          :placeholder="locale === 'es' ? 'Ej. Oferta laboral / Duda técnica' : 'e.g. Job offer / Technical inquiry'" 
          class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <div class="space-y-2">
        <label class="text-xs font-mono text-slate-400 uppercase">{{ t('contact.form_message') }} *</label>
        <textarea 
          rows="5" 
          v-model="contactForm.message" 
          required
          :placeholder="locale === 'es' ? 'Describe tu propuesta, stack técnico o consulta de manera detallada...' : 'Describe your proposal, technical stack or inquiry in detail...'" 
          class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
        ></textarea>
      </div>

      <div class="pt-2">
        <button 
          type="submit" 
          :disabled="isSendingMessage"
          class="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-700 disabled:to-slate-800 text-black font-bold py-3 px-6 rounded-lg active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <span v-if="isSendingMessage" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent mr-2"></span>
          <span>{{ isSendingMessage ? t('contact.form_sending') : t('contact.form_submit') }}</span>
          <Send v-if="!isSendingMessage" class="h-4 w-4" />
        </button>
      </div>
    </form>

  </div>
</template>
