<script setup lang="ts">
import { ref, watch } from 'vue';
import { Terminal, X, Globe } from 'lucide-vue-next';
import { Post } from '../../types';
import { useI18n } from '../../composables/useI18n';
import { useAuth } from '../../composables/useAuth';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  post: Post;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', post: Post): void;
}>();

const { t, locale } = useI18n();
const { isAdmin } = useAuth();

const activeLang = ref<'es' | 'en'>('es');

const editingPost = ref<Post>({ ...props.post });
const rawTags = ref('');

// Sincronizar estado local al abrir el modal o cambiar el post prop
watch(() => props.isOpen, (isOpenVal) => {
  if (isOpenVal) {
    activeLang.value = locale.value; // por defecto el idioma actual de la app
    editingPost.value = { 
      ...props.post,
      title: props.post.title || '',
      title_en: props.post.title_en || '',
      summary: props.post.summary || '',
      summary_en: props.post.summary_en || '',
      content: props.post.content || '',
      content_en: props.post.content_en || '',
      category: props.post.category || 'Backend',
      category_en: props.post.category_en || 'Backend',
      readTime: props.post.readTime || '',
      readTime_en: props.post.readTime_en || ''
    };
    rawTags.value = props.post.tags ? props.post.tags.join(', ') : '';
  }
}, { immediate: true });

const handleSave = () => {
  if (!editingPost.value.title || !editingPost.value.summary || !editingPost.value.content) {
    const errorMsg = locale.value === 'es'
      ? 'Por favor rellena los campos requeridos en Español (Título, Resumen y Contenido).'
      : 'Please fill in the required fields in Spanish (Title, Summary, and Content).';
    alert(errorMsg);
    return;
  }

  // Fallbacks automáticos al inglés si se dejan vacíos
  if (!editingPost.value.title_en) editingPost.value.title_en = editingPost.value.title;
  if (!editingPost.value.summary_en) editingPost.value.summary_en = editingPost.value.summary;
  if (!editingPost.value.content_en) editingPost.value.content_en = editingPost.value.content;
  if (!editingPost.value.category_en) {
    editingPost.value.category_en = editingPost.value.category === 'Arquitectura' ? 'Architecture' :
                                    editingPost.value.category === 'Sistemas Distribuidos' ? 'Distributed Systems' :
                                    editingPost.value.category;
  }
  if (!editingPost.value.readTime_en) {
    editingPost.value.readTime_en = editingPost.value.readTime ? editingPost.value.readTime.replace('lectura', 'read') : '';
  }

  // Procesar tags
  editingPost.value.tags = rawTags.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  emit('save', { ...editingPost.value });
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
    <div class="bg-[#14171C] border border-white/5 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
      
      <!-- Cabecera Sticky del modal -->
      <div class="sticky top-0 bg-[#14171C] px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
        <h3 class="text-base font-bold text-white font-mono flex items-center space-x-2">
          <Terminal class="h-4 w-4 text-emerald-400" />
          <span>{{ isEditing ? t('dashboard.modal_post_edit') : t('dashboard.modal_post_new') }}</span>
        </h3>
        <button @click="$emit('close')" class="p-1 rounded bg-[#1A1E26] text-slate-400 hover:text-white transition-colors">
          <X class="h-5 w-5" />
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
          <span v-if="editingPost.title && editingPost.summary" class="text-[9px] text-emerald-500 font-sans">●</span>
        </button>
        <button 
          type="button"
          @click="activeLang = 'en'"
          :class="[activeLang === 'en' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white']"
          class="px-4 py-2.5 text-xs font-mono transition-all flex items-center space-x-1.5"
        >
          <span>ENGLISH</span>
          <span v-if="editingPost.title_en && editingPost.summary_en" class="text-[9px] text-emerald-500 font-sans">●</span>
          <span v-else class="text-[9px] text-amber-500/70 font-sans">○</span>
        </button>
      </div>

      <!-- Cuerpo del Formulario -->
      <div class="p-6 space-y-4">
        <!-- TÍTULO ESPAÑOL -->
        <div class="space-y-2" v-show="activeLang === 'es'">
          <label class="text-xs font-mono text-slate-400 uppercase">{{ t('dashboard.modal_field_title') }} *</label>
          <input 
            type="text" 
            v-model="editingPost.title" 
            placeholder="Ej. Optimización de PostgreSQL indexando llaves primarias" 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- TÍTULO INGLÉS -->
        <div class="space-y-2" v-show="activeLang === 'en'">
          <label class="text-xs font-mono text-slate-400 uppercase">Post Title (English) *</label>
          <input 
            type="text" 
            v-model="editingPost.title_en" 
            placeholder="e.g. PostgreSQL optimization using index strategies" 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- CATEGORÍA Y TIEMPO DE LECTURA -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Categoría (Español) -->
          <div class="space-y-2" v-show="activeLang === 'es'">
            <label class="text-xs font-mono text-slate-400 uppercase">{{ t('dashboard.modal_field_category') }}</label>
            <select 
              v-model="editingPost.category" 
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Arquitectura">Arquitectura</option>
              <option value="Backend">Backend</option>
              <option value="Sistemas Distribuidos">Sistemas Distribuidos</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <!-- Categoría (Inglés) -->
          <div class="space-y-2" v-show="activeLang === 'en'">
            <label class="text-xs font-mono text-slate-400 uppercase">Category (English)</label>
            <select 
              v-model="editingPost.category_en" 
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Architecture">Architecture</option>
              <option value="Backend">Backend</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <!-- Tiempo de Lectura (Español) -->
          <div class="space-y-2" v-show="activeLang === 'es'">
            <label class="text-xs font-mono text-slate-400 uppercase">{{ t('dashboard.modal_field_readtime') }}</label>
            <input 
              type="text" 
              v-model="editingPost.readTime" 
              placeholder="Ej. 6 min lectura" 
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <!-- Tiempo de Lectura (Inglés) -->
          <div class="space-y-2" v-show="activeLang === 'en'">
            <label class="text-xs font-mono text-slate-400 uppercase">Read Time (English)</label>
            <input 
              type="text" 
              v-model="editingPost.readTime_en" 
              placeholder="e.g. 6 min read" 
              class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <!-- SÍNTESIS / RESUMEN ESPAÑOL -->
        <div class="space-y-2" v-show="activeLang === 'es'">
          <label class="text-xs font-mono text-slate-400 uppercase">{{ t('dashboard.modal_field_summary') }} *</label>
          <input 
            type="text" 
            v-model="editingPost.summary" 
            placeholder="Escribe una pequeña síntesis en Español..." 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- SÍNTESIS / RESUMEN INGLÉS -->
        <div class="space-y-2" v-show="activeLang === 'en'">
          <label class="text-xs font-mono text-slate-400 uppercase">Brief Summary (English) *</label>
          <input 
            type="text" 
            v-model="editingPost.summary_en" 
            placeholder="Write a brief synthesis in English..." 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- CONTENIDO COMPLETO ESPAÑOL -->
        <div class="space-y-2" v-show="activeLang === 'es'">
          <label class="text-xs font-mono text-slate-400 uppercase">{{ t('dashboard.modal_field_content') }} *</label>
          <textarea 
            rows="8" 
            v-model="editingPost.content" 
            placeholder="Aquí puedes desplegar todo tu conocimiento técnico en Español (Markdown compatible)..." 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 font-mono"
          ></textarea>
        </div>

        <!-- CONTENIDO COMPLETO INGLÉS -->
        <div class="space-y-2" v-show="activeLang === 'en'">
          <label class="text-xs font-mono text-slate-400 uppercase">Main Content (English) *</label>
          <textarea 
            rows="8" 
            v-model="editingPost.content_en" 
            placeholder="Here you can showcase all your technical knowledge in English (Markdown supported)..." 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 font-mono"
          ></textarea>
        </div>

        <!-- ETIQUETAS / TAGS (UNIFICADOS) -->
        <div class="space-y-2">
          <label class="text-xs font-mono text-slate-400 uppercase">{{ t('dashboard.modal_field_tags') }}</label>
          <input 
            type="text" 
            v-model="rawTags" 
            placeholder="PHP, Symfony, DDD, Postgres" 
            class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- BOTONES -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-white/5">
          <div v-if="!isAdmin" class="text-xs text-amber-500 font-mono flex items-center space-x-1">
            <span>⚠️</span>
            <span>{{ locale === 'es' ? 'Modo lectura (Guardar deshabilitado)' : 'Read-only mode (Save disabled)' }}</span>
          </div>
          <div v-else></div>
          <div class="flex items-center space-x-3">
            <button 
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-lg bg-[#1A1E26] hover:bg-slate-800 text-slate-300 font-bold text-xs"
            >
              {{ t('dashboard.modal_btn_cancel') }}
            </button>
            <button 
              type="button"
              @click="handleSave"
              :disabled="!isAdmin"
              :class="[!isAdmin ? 'opacity-40 cursor-not-allowed bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95']"
              class="px-5 py-2 rounded-lg font-bold text-xs shadow-md shadow-emerald-500/10 transition-all"
            >
              {{ t('dashboard.modal_btn_save') }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
