<script setup lang="ts">
import { 
  Globe, 
  Layers, 
  Terminal, 
  Edit2, 
  Trash2, 
  ExternalLink 
} from 'lucide-vue-next';
import { Project } from '../../../types';
import { useI18n } from '../../../composables/useI18n';
import { useAuth } from '../../../composables/useAuth';

defineProps<{
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: 'edit-project', project: Project): void;
  (e: 'delete-project', id: string): void;
}>();

const { locale } = useI18n();
const { isAdmin } = useAuth();

const getIconComponent = (category?: string) => {
  if (category === 'Globe') return Globe;
  if (category === 'Layers') return Layers;
  return Terminal;
};
</script>

<template>
  <div class="bg-[#14171C] border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-fade-in">
    <!-- TITULO DE TABLA -->
    <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#111419]">
      <div class="space-y-0.5">
        <h3 class="text-sm font-bold text-white font-mono uppercase tracking-wider">
          {{ locale === 'es' ? 'GESTION_PROYECTOS.DB' : 'PROJECT_MANAGEMENT.DB' }}
        </h3>
        <p class="text-[10px] text-slate-500 font-mono uppercase">
          {{ locale === 'es' ? 'Listado de proyectos dinámicos enlazados con Laravel' : 'List of dynamic projects connected with Laravel' }}
        </p>
      </div>
      <span class="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
        {{ projects.length }} {{ locale === 'es' ? 'Proyectos' : 'Projects' }}
      </span>
    </div>

    <!-- TABLA DE DATOS -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse" id="projects-table">
        <thead>
          <tr class="border-b border-white/5 bg-[#181C24]/30 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            <th class="px-6 py-3.5 font-medium">{{ locale === 'es' ? 'Icono' : 'Icon' }}</th>
            <th class="px-6 py-3.5 font-medium">{{ locale === 'es' ? 'Proyecto' : 'Project' }}</th>
            <th class="px-6 py-3.5 font-medium">{{ locale === 'es' ? 'Descripción' : 'Description' }}</th>
            <th class="px-6 py-3.5 font-medium">{{ locale === 'es' ? 'Tecnologías' : 'Technologies' }}</th>
            <th class="px-6 py-3.5 font-medium">{{ locale === 'es' ? 'Estado' : 'Status' }}</th>
            <th class="px-6 py-3.5 font-medium text-right">{{ locale === 'es' ? 'Acciones' : 'Actions' }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="projects.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-xs text-slate-500 font-mono uppercase">
              {{ locale === 'es' ? 'Ningún proyecto registrado en la base de datos' : 'No projects found in database' }}
            </td>
          </tr>
          <tr 
            v-for="project in projects" 
            :key="project.id"
            class="hover:bg-white/[0.02] transition-colors group"
          >
            <!-- ICONO -->
            <td class="px-6 py-4.5">
              <div class="p-2 bg-slate-800/50 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-400/10 rounded-lg w-9 h-9 flex items-center justify-center transition-all border border-white/5">
                <component :is="getIconComponent(project.category)" class="h-4 w-4" />
              </div>
            </td>

            <!-- DETALLES PROYECTO -->
            <td class="px-6 py-4.5 max-w-[200px]">
              <div class="font-bold text-white text-sm flex items-center space-x-1.5">
                <span>{{ locale === 'en' && project.title_en ? project.title_en : project.title }}</span>
                <a 
                  v-if="project.link_url" 
                  :href="project.link_url" 
                  target="_blank" 
                  class="text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink class="h-3 w-3" />
                </a>
              </div>
              <div class="text-[10px] text-slate-500 font-mono mt-0.5">ID: {{ project.id }}</div>
            </td>

            <!-- DESCRIPCIÓN -->
            <td class="px-6 py-4.5 max-w-[300px]">
              <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {{ locale === 'en' && project.description_en ? project.description_en : project.description }}
              </p>
            </td>

            <!-- TECNOLOGÍAS -->
            <td class="px-6 py-4.5 max-w-[200px]">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  class="px-1.5 py-0.5 bg-[#1C202A] text-slate-300 font-mono text-[9px] rounded border border-white/5"
                >
                  {{ tech }}
                </span>
              </div>
            </td>

            <!-- BADGE DE ESTADO -->
            <td class="px-6 py-4.5 font-mono text-xs">
              <span 
                class="px-2 py-0.5 rounded text-[10px] border"
                :class="[
                  project.status.toLowerCase().includes('desarrollo') || project.status.toLowerCase().includes('development')
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  project.status.toLowerCase().includes('producción') || project.status.toLowerCase().includes('production')
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-slate-500/10 text-slate-400 border-white/5'
                ]"
              >
                {{ locale === 'en' && project.status_en ? project.status_en : project.status }}
              </span>
            </td>

            <!-- ACCIONES -->
            <td class="px-6 py-4.5 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button 
                  @click="$emit('edit-project', project)"
                  class="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Editar"
                >
                  <Edit2 class="h-3.5 w-3.5" />
                </button>
                <button 
                  @click="$emit('delete-project', project.id)"
                  :disabled="!isAdmin"
                  :class="[!isAdmin ? 'opacity-40 cursor-not-allowed bg-red-950/10 text-red-500/40 border-transparent' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20']"
                  class="p-1.5 rounded transition-all border"
                  title="Eliminar"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
