<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Award, Globe } from 'lucide-vue-next';
import { Certification } from '../../types';
import { useI18n } from '../../composables/useI18n';
import { useAuth } from '../../composables/useAuth';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  certification: Certification;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', cert: Certification): void;
}>();

const { locale } = useI18n();
const { isAdmin } = useAuth();

const activeLang = ref<'es' | 'en'>('es');

const formTitle = ref('');
const formTitleEn = ref('');
const formIssuer = ref('');
const formDate = ref('');
const formDescription = ref('');
const formDescriptionEn = ref('');
const formLink = ref('');
const formStatus = ref<'completed' | 'in_progress'>('completed');

// Sincronizar campos al abrir o cambiar la certificación seleccionada
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    activeLang.value = locale.value; // Poner por defecto el idioma actual de la app
    formTitle.value = props.certification.title || '';
    formTitleEn.value = props.certification.title_en || '';
    formIssuer.value = props.certification.issuer || '';

    // Convertir fecha legacy a formato YYYY-MM-DD para el input tipo date
    let initialDate = props.certification.date || '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
      formDate.value = initialDate;
    } else {
      const yearMatch = initialDate.match(/^\d{4}/);
      if (yearMatch) {
        formDate.value = `${yearMatch[0]}-01-01`;
      } else {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        formDate.value = `${yyyy}-${mm}-${dd}`;
      }
    }

    formDescription.value = props.certification.description || '';
    formDescriptionEn.value = props.certification.description_en || '';
    formLink.value = props.certification.link || '';
    formStatus.value = props.certification.status || 'completed';
  }
});

const handleFormSubmit = () => {
  if (!formTitle.value || !formIssuer.value || !formDate.value) {
    alert(locale.value === 'es' ? 'Por favor completa los campos requeridos.' : 'Please fill in all required fields.');
    return;
  }

  const updatedCert: Certification = {
    ...props.certification,
    title: formTitle.value,
    title_en: formTitleEn.value || formTitle.value, // fallback
    issuer: formIssuer.value,
    date: formDate.value,
    description: formDescription.value,
    description_en: formDescriptionEn.value || formDescription.value, // fallback
    link: formLink.value,
    status: formStatus.value
  };

  emit('save', updatedCert);
};
</script>

<template>
  <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
  >
    <div class="relative bg-[#14171C] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
      <!-- Cabecera del Modal -->
      <div class="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div class="flex items-center space-x-2 text-emerald-400">
          <Award class="h-5 w-5" />
          <h3 class="text-md font-bold text-white">
            {{ isEditing
              ? (locale === 'es' ? 'Editar Acreditación' : 'Edit Credential')
              : (locale === 'es' ? 'Añadir Nueva Acreditación' : 'Add New Credential')
            }}
          </h3>
        </div>

        <button
            @click="$emit('close')"
            class="p-1.5 bg-[#1A1E26] hover:bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Selector de Idioma para los campos traducibles -->
      <div class="flex border-b border-white/5 bg-[#101216] px-4">
        <button
            type="button"
            @click="activeLang = 'es'"
            :class="[activeLang === 'es' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white']"
            class="px-4 py-2.5 text-xs font-mono transition-all flex items-center space-x-1.5"
        >
          <span>ESPAÑOL</span>
          <span v-if="formTitle && formDescription" class="text-[9px] text-emerald-500 font-sans">●</span>
        </button>
        <button
            type="button"
            @click="activeLang = 'en'"
            :class="[activeLang === 'en' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white']"
            class="px-4 py-2.5 text-xs font-mono transition-all flex items-center space-x-1.5"
        >
          <span>ENGLISH</span>
          <span v-if="formTitleEn && formDescriptionEn" class="text-[9px] text-emerald-500 font-sans">●</span>
          <span v-else class="text-[9px] text-amber-500/70 font-sans">○</span>
        </button>
      </div>

      <!-- Contenido / Formulario -->
      <form @submit.prevent="handleFormSubmit" class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
        <!-- Título en Español -->
        <div class="space-y-1.5" v-show="activeLang === 'es'">
          <label class="block text-xs font-mono text-emerald-400 uppercase">
            Título de la Acreditación *
          </label>
          <input
              v-model="formTitle"
              type="text"
              required
              placeholder="e.g. Técnico Superior en Desarrollo de Aplicaciones Web"
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <!-- Título en Inglés -->
        <div class="space-y-1.5" v-show="activeLang === 'en'">
          <label class="block text-xs font-mono text-emerald-400 uppercase">
            Credential Title (English) *
          </label>
          <input
              v-model="formTitleEn"
              type="text"
              placeholder="e.g. Higher Degree in Web Applications Development"
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Emisor -->
          <div class="space-y-1.5">
            <label class="block text-xs font-mono text-emerald-400 uppercase">
              {{ locale === 'es' ? 'Organismo Emisor *' : 'Issuing Organization *' }}
            </label>
            <input
                v-model="formIssuer"
                type="text"
                required
                placeholder="e.g. Ilerna, Coursera, Cisco"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <!-- Fecha -->
          <div class="space-y-1.5">
            <label class="block text-xs font-mono text-emerald-400 uppercase">
              {{ locale === 'es' ? 'Fecha de Acreditación *' : 'Credential Date *' }}
            </label>
            <input
                v-model="formDate"
                type="date"
                required
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                style="color-scheme: dark;"
            />
          </div>
        </div>

        <!-- Estado de la certificación -->
        <div class="space-y-1.5">
          <label class="block text-xs font-mono text-emerald-400 uppercase">
            {{ locale === 'es' ? 'Estado actual de los estudios' : 'Current Studies Status' }}
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
                type="button"
                @click="formStatus = 'completed'"
                class="px-4 py-2.5 border text-xs font-mono rounded-lg transition-all"
                :class="[
                formStatus === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 font-bold'
                  : 'bg-[#1A1E26] border-white/15 text-slate-400'
              ]"
            >
              {{ locale === 'es' ? '✓ Completado / Graduado' : '✓ Completed / Graduated' }}
            </button>
            <button
                type="button"
                @click="formStatus = 'in_progress'"
                class="px-4 py-2.5 border text-xs font-mono rounded-lg transition-all"
                :class="[
                formStatus === 'in_progress'
                  ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400 font-bold'
                  : 'bg-[#1A1E26] border-white/15 text-slate-400'
              ]"
            >
              {{ locale === 'es' ? '⚡ En Curso / Cursando' : '⚡ In Progress' }}
            </button>
          </div>
        </div>

        <!-- Enlace Opcional -->
        <div class="space-y-1.5">
          <label class="block text-xs font-mono text-emerald-400 uppercase">
            {{ locale === 'es' ? 'Enlace de Verificación / URL (Opcional)' : 'Verification Link / URL (Optional)' }}
          </label>
          <input
              v-model="formLink"
              type="url"
              placeholder="https://..."
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <!-- Descripción en Español -->
        <div class="space-y-1.5" v-show="activeLang === 'es'">
          <label class="block text-xs font-mono text-emerald-400 uppercase">
            Breve Resumen / Detalle Académico
          </label>
          <textarea
              v-model="formDescription"
              rows="4"
              placeholder="e.g. Especialización enfocada en seguridad informática y análisis de logs..."
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono"
          ></textarea>
        </div>

        <!-- Descripción en Inglés -->
        <div class="space-y-1.5" v-show="activeLang === 'en'">
          <label class="block text-xs font-mono text-emerald-400 uppercase">
            Brief Summary / Academic Detail (English)
          </label>
          <textarea
              v-model="formDescriptionEn"
              rows="4"
              placeholder="e.g. Specialization focused on computer security and log analysis..."
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono"
          ></textarea>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div v-if="!isAdmin" class="text-xs text-amber-500 font-mono flex items-center space-x-1">
            <span>⚠️</span>
            <span>{{ locale === 'es' ? 'Modo lectura (Guardar deshabilitado)' : 'Read-only mode (Save disabled)' }}</span>
          </div>
          <div v-else></div>
          <div class="flex items-center space-x-3">
            <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 bg-[#1A1E26] border border-white/10 text-slate-400 hover:text-white text-xs font-mono rounded-lg transition-colors"
            >
              {{ locale === 'es' ? 'Cancelar' : 'Cancel' }}
            </button>

            <button
                type="submit"
                :disabled="!isAdmin"
                :class="[!isAdmin ? 'opacity-40 cursor-not-allowed bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95']"
                class="px-5 py-2 font-bold text-xs font-mono rounded-lg transition-all"
            >
              {{ locale === 'es' ? 'Guardar Cambios' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
