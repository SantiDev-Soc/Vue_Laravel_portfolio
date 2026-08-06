<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Globe, Layers, Terminal } from 'lucide-vue-next';
import { Project } from '../../types';
import { useI18n } from '../../composables/useI18n';
import { useAuth } from '../../composables/useAuth';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  project: Project;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', project: Project): void;
}>();

const { locale } = useI18n();
const { isAdmin } = useAuth();

const activeLang = ref<'es' | 'en'>('es');

// Form state
const form = ref<{
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  status: string;
  status_en: string;
  technologiesRaw: string;
  link_url: string;
  link_label: string;
  link_label_en: string;
  category: 'Globe' | 'Layers' | 'Terminal';
}>({
  id: '',
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  status: '',
  status_en: '',
  technologiesRaw: '',
  link_url: '',
  link_label: '',
  link_label_en: '',
  category: 'Terminal'
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = {
      id: props.project.id || '',
      title: props.project.title || '',
      title_en: props.project.title_en || '',
      description: props.project.description || '',
      description_en: props.project.description_en || '',
      status: props.project.status || '',
      status_en: props.project.status_en || '',
      technologiesRaw: props.project.technologies ? props.project.technologies.join(', ') : '',
      link_url: props.project.link_url || '',
      link_label: props.project.link_label || '',
      link_label_en: props.project.link_label_en || '',
      category: props.project.category || 'Terminal'
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  if (!isAdmin.value) return;

  const techs = form.value.technologiesRaw
    .split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  const updatedProject: Project = {
    id: form.value.id || Date.now().toString(),
    title: form.value.title,
    title_en: form.value.title_en || form.value.title,
    description: form.value.description,
    description_en: form.value.description_en || form.value.description,
    status: form.value.status || 'ESTADO: DESARROLLO',
    status_en: form.value.status_en || 'STATUS: DEVELOPMENT',
    technologies: techs,
    link_url: form.value.link_url,
    link_label: form.value.link_label || 'ENLACE PROYECTO:',
    link_label_en: form.value.link_label_en || 'PROJECT LINK:',
    category: form.value.category
  };

  emit('save', updatedProject);
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    id="project-form-modal-overlay"
  >
    <!-- BACKDROP -->
    <div 
      @click="$emit('close')"
      class="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- DIALOG CONTAINER -->
    <div 
      class="bg-[#0E1116] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-fade-in"
      id="project-form-dialog"
    >
      <!-- HEADER -->
      <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Terminal class="h-4 w-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-white font-mono uppercase tracking-wider">
              {{ isEditing 
                ? (locale === 'es' ? 'EDITAR_PROYECTO.JSON' : 'EDIT_PROJECT.JSON') 
                : (locale === 'es' ? 'NUEVO_PROYECTO.JSON' : 'NEW_PROJECT.JSON') 
              }}
            </h3>
            <p class="text-[10px] text-slate-500 font-mono uppercase">
              {{ locale === 'es' ? 'PERSISTENCIA BACKEND DIRECTA' : 'DIRECT BACKEND PERSISTENCE' }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-lg bg-[#1A1E26] hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- IDIOMA TABS PARA EDICIÓN BILINGÜE -->
      <div class="px-6 pt-3 flex items-center justify-between border-b border-white/5 bg-[#14171C]/50">
        <span class="text-[10px] font-mono text-emerald-400">SELECT_LOCALIZATION_CONTEXT:</span>
        <div class="flex space-x-1">
          <button 
            type="button"
            @click="activeLang = 'es'"
            :class="[activeLang === 'es' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white bg-[#1A1E26]/50']"
            class="px-3 py-1.5 text-[10px] font-mono rounded-t-lg transition-colors"
          >
            🇪🇸 ESPAÑOL
          </button>
          <button 
            type="button"
            @click="activeLang = 'en'"
            :class="[activeLang === 'en' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white bg-[#1A1E26]/50']"
            class="px-3 py-1.5 text-[10px] font-mono rounded-t-lg transition-colors"
          >
            🇺🇸 ENGLISH
          </button>
        </div>
      </div>

      <!-- FORMULARIOS -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        
        <!-- CAMPOS SEGÚN IDIOMA SELECCIONADO (CONMUTADOR DE CONTEXTO) -->
        <div v-show="activeLang === 'es'" class="space-y-4 animate-fade-in">
          <div>
            <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Título del Proyecto (ES)</label>
            <input 
              v-model="form.title"
              type="text"
              required
              placeholder="Ej. Santi Solutions"
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Descripción del Sistema (ES)</label>
            <textarea 
              v-model="form.description"
              required
              rows="4"
              placeholder="Detalla la arquitectura, bases de datos y orquestación..."
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Badge de Estado (ES)</label>
              <input 
                v-model="form.status"
                type="text"
                placeholder="Ej. ESTADO: DESARROLLO"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Etiqueta del Enlace (ES)</label>
              <input 
                v-model="form.link_label"
                type="text"
                placeholder="Ej. ENLACE PROYECTO:"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div v-show="activeLang === 'en'" class="space-y-4 animate-fade-in">
          <div>
            <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Project Title (EN)</label>
            <input 
              v-model="form.title_en"
              type="text"
              placeholder="Ej. Santi Solutions Premium Edition"
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">System Description (EN)</label>
            <textarea 
              v-model="form.description_en"
              rows="4"
              placeholder="Detail the architecture, databases, and Docker services..."
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Status Badge (EN)</label>
              <input 
                v-model="form.status_en"
                type="text"
                placeholder="Ej. STATUS: DEVELOPMENT"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Link Label (EN)</label>
              <input 
                v-model="form.link_label_en"
                type="text"
                placeholder="Ej. PROJECT LINK:"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- CAMPOS COMUNES -->
        <div class="border-t border-white/5 pt-4 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Icono / Categoría</label>
              <select 
                v-model="form.category"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Globe">🌐 Globe (Web / SaaS / Cloud)</option>
                <option value="Layers">🥞 Layers (Distributed / Backend)</option>
                <option value="Terminal">💻 Terminal (Engines / Tools / CLI)</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">Enlace del Proyecto (URL)</label>
              <input 
                v-model="form.link_url"
                type="url"
                placeholder="https://santisolutions.com"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-mono text-slate-400 uppercase mb-1">
              Tecnologías (Separadas por comas)
            </label>
            <input 
              v-model="form.technologiesRaw"
              type="text"
              required
              placeholder="Laravel 11, Vue 3, Redis, Docker, PostgreSQL"
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <p class="text-[9px] text-slate-500 mt-1 font-mono">
              Las tecnologías se convertirán en badges dinámicos en el portafolio principal.
            </p>
          </div>
        </div>

        <!-- BOTONES -->
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
