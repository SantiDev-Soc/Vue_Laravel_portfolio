<script setup lang="ts">
import { 
  Globe, 
  Layers, 
  Terminal, 
  ArrowRight 
} from 'lucide-vue-next';
import { Project } from '../../../types';
import { useI18n } from '../../../composables/useI18n';

defineProps<{
  projects: Project[];
}>();

const { t, locale } = useI18n();

const getIconComponent = (category?: string) => {
  if (category === 'Globe') return Globe;
  if (category === 'Layers') return Layers;
  return Terminal;
};
</script>

<template>
  <div class="space-y-8 pt-10 border-t border-white/5">
    <div>
      <p class="text-emerald-400 font-mono text-xs">{{ t('home.projects_label') }}</p>
      <h2 class="text-3xl font-bold text-white tracking-tight">{{ t('home.projects_title') }}</h2>
      <p class="text-[#94A3B8] max-w-2xl text-sm">
        {{ t('home.projects_subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="bg-[#14171C] border border-white/5 hover:border-emerald-500/30 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
      >
        <div 
          v-if="project.category === 'Globe'"
          class="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none"
        ></div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <component :is="getIconComponent(project.category)" class="h-6 w-6" />
            </div>
            <span 
              class="text-[10px] font-mono bg-[#1A1E26] text-[#94A3B8] px-2 py-1 rounded border border-white/5"
              :class="{ 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse': project.status.toLowerCase().includes('desarrollo') || project.status.toLowerCase().includes('integración') || project.status.toLowerCase().includes('development') || project.status.toLowerCase().includes('integration') || project.status.toLowerCase().includes('curso') }"
            >
              {{ locale === 'en' && project.status_en ? project.status_en : project.status }}
            </span>
          </div>
          
          <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {{ locale === 'en' && project.title_en ? project.title_en : project.title }}
          </h3>
          <p class="text-slate-400 text-xs md:text-sm leading-relaxed">
            {{ locale === 'en' && project.description_en ? project.description_en : project.description }}
          </p>
        </div>

        <div class="pt-6 mt-6 border-t border-white/5 space-y-3">
          <div class="flex flex-wrap gap-1.5">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-[11px] border border-white/5 font-mono"
            >
              {{ tech }}
            </span>
          </div>
          
          <div v-if="project.link_url" class="flex items-center justify-between text-xs pt-1.5 border-t border-white/5">
            <span class="text-slate-500 font-mono text-[10px]">
              {{ locale === 'en' && project.link_label_en ? project.link_label_en : (project.link_label || (locale === 'es' ? 'ENLACE PROYECTO:' : 'PROJECT LINK:')) }}
            </span>
            <a 
              :href="project.link_url" 
              target="_blank" 
              class="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors flex items-center space-x-1 font-mono font-bold text-xs"
            >
              <span>{{ project.link_url.replace('https://', '').replace('http://', '').split('/')[0] }}</span>
              <ArrowRight class="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
