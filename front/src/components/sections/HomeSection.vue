<script setup lang="ts">
import { Certification, Project } from '../../types';
import HeroBlock from './home/HeroBlock.vue';
import ExperienceBlock from './home/ExperienceBlock.vue';
import ProjectsBlock from './home/ProjectsBlock.vue';
import CertificationsBlock from './home/CertificationsBlock.vue';
import SkillsBlock from './home/SkillsBlock.vue';
import CtaBlock from './home/CtaBlock.vue';

defineProps<{
  certifications: Certification[];
  projects: Project[];
}>();


defineEmits<{
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();
</script>

<template>
  <div class="space-y-16 animate-fade-in">
    <!-- HERO / PRESENTACIÓN -->
    <HeroBlock @navigate="$emit('navigate', $event)" />

    <!-- SECCIÓN: EXPERIENCIA Y FILOSOFÍA -->
    <ExperienceBlock />

    <!-- SECCIÓN: PROYECTOS SELECCIONADOS -->
    <ProjectsBlock :projects="projects" />

    <!-- SECCIÓN: CERTIFICACIONES Y ESTUDIOS -->
    <CertificationsBlock :certifications="certifications" />

    <!-- SECCIÓN: STACK TECNOLÓGICO -->
    <SkillsBlock />

    <!-- CALL TO ACTION (CTA) -->
    <CtaBlock @navigate="$emit('navigate', $event)" />
  </div>
</template>

