<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Post, Message, Certification, Project } from './types';
import { DEFAULT_POSTS, DEFAULT_MESSAGES, DEFAULT_CERTIFICATIONS, DEFAULT_PROJECTS } from './constants';
import { useApi } from './composables/useApi';

// Subcomponentes modularizados
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import HomeSection from './components/sections/HomeSection.vue';
import BlogSection from './components/sections/BlogSection.vue';
import ContactSection from './components/sections/ContactSection.vue';
import DashboardSection from './components/sections/DashboardSection.vue';

// --- ESTADOS REACTIVOS PRINCIPALES ---
const currentTab = ref<'home' | 'blog' | 'dashboard' | 'contact'>('home');
const posts = ref<Post[]>([]);
const messages = ref<Message[]>([]);
const certifications = ref<Certification[]>([]);
const projects = ref<Project[]>([]);

const {
  checkConnection,
  getPosts,
  getMessages,
  createPost,
  updatePost,
  deletePost,
  createMessage,
  markMessageRead,
  deleteMessage,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = useApi();

// Reloj dinámico de la barra de estado
const currentTime = ref('');
let clockInterval: ReturnType<typeof setInterval> | null = null;

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
};

// Carga inicial desde la API / Base de datos exclusivamente
onMounted(async () => {
  updateClock();
  clockInterval = setInterval(updateClock, 30000); // Actualiza cada 30 segundos

  await checkConnection();

  posts.value = await getPosts(DEFAULT_POSTS);
  messages.value = await getMessages(DEFAULT_MESSAGES);
  certifications.value = await getCertifications(DEFAULT_CERTIFICATIONS);
  projects.value = await getProjects(DEFAULT_PROJECTS);
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
});

// Conteo de mensajes no leídos
const unreadCount = computed(() => {
  return messages.value.filter(m => !m.read).length;
});

// --- ENRUTADOR LOCAL (NAVEGACIÓN) ---
const navigateTo = (tab: 'home' | 'blog' | 'dashboard' | 'contact') => {
  currentTab.value = tab;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- HANDLERS DE EVENTOS ---

// Crear publicación
const handleCreatePost = async (newPost: Post) => {
  posts.value.unshift(newPost);
  const res = await createPost(newPost);
  if (res && res.success && res.id) {
    const index = posts.value.findIndex(p => p.id === newPost.id);
    if (index !== -1) {
      posts.value[index].id = String(res.id);
    }
  }
};

// Editar publicación
const handleUpdatePost = async (updatedPost: Post) => {
  const index = posts.value.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
    await updatePost(updatedPost);
  }
};

// Eliminar publicación
const handleDeletePost = async (id: string) => {
  posts.value = posts.value.filter(p => p.id !== id);
  await deletePost(id);
};

// Recibir mensaje del formulario de contacto
const handleMessageSent = async (newMessage: Message) => {
  messages.value.unshift(newMessage);
  const res = await createMessage(newMessage);
  if (res && res.success && res.id) {
    const index = messages.value.findIndex(m => m.id === newMessage.id);
    if (index !== -1) {
      messages.value[index].id = String(res.id);
    }
  }
};

// Marcar mensaje como leído en el buzón
const handleMarkMessageRead = async (id: string) => {
  const found = messages.value.find(m => m.id === id);
  if (found && !found.read) {
    found.read = true;
    await markMessageRead(id);
  }
};

// Eliminar mensaje del buzón
const handleDeleteMessage = async (id: string) => {
  messages.value = messages.value.filter(m => m.id !== id);
  await deleteMessage(id);
};

// --- HANDLERS DE CERTIFICACIONES ---
const handleCreateCertification = async (newCert: Certification) => {
  certifications.value.unshift(newCert);
  const res = await createCertification(newCert);
  if (res && res.success && res.id) {
    const index = certifications.value.findIndex(c => c.id === newCert.id);
    if (index !== -1) {
      certifications.value[index].id = String(res.id);
    }
  }
};

const handleUpdateCertification = async (updatedCert: Certification) => {
  const index = certifications.value.findIndex(c => c.id === updatedCert.id);
  if (index !== -1) {
    certifications.value[index] = updatedCert;
    await updateCertification(updatedCert);
  }
};

const handleDeleteCertification = async (id: string) => {
  certifications.value = certifications.value.filter(c => c.id !== id);
  await deleteCertification(id);
};

// --- HANDLERS DE PROYECTOS ---
const handleCreateProject = async (newProj: Project) => {
  projects.value.unshift(newProj);
  const res = await createProject(newProj);
  if (res && res.success && res.id) {
    const index = projects.value.findIndex(p => p.id === newProj.id);
    if (index !== -1) {
      projects.value[index].id = String(res.id);
    }
  }
};

const handleUpdateProject = async (updatedProj: Project) => {
  const index = projects.value.findIndex(p => p.id === updatedProj.id);
  if (index !== -1) {
    projects.value[index] = updatedProj;
    await updateProject(updatedProj);
  }
};

const handleDeleteProject = async (id: string) => {
  projects.value = projects.value.filter(p => p.id !== id);
  await deleteProject(id);
};
</script>

<template>
  <div class="min-h-screen bg-[#0A0B0E] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 flex flex-col justify-between relative overflow-x-hidden">
    <!-- Grid sutil de fondo de estilo técnico -->
    <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

    <!-- HEADER / NAVIGATION -->
    <AppHeader
        :current-tab="currentTab"
        :unread-count="unreadCount"
        @navigate="navigateTo"
    />

    <!-- MAIN APP WRAPPER -->
    <main class="relative z-10 max-w-6xl mx-auto px-6 py-12 flex-grow w-full">
      <HomeSection
          v-if="currentTab === 'home'"
          :certifications="certifications"
          :projects="projects"
          @navigate="navigateTo"
      />

      <BlogSection
          v-else-if="currentTab === 'blog'"
          :posts="posts"
      />

      <ContactSection
          v-else-if="currentTab === 'contact'"
          @message-sent="handleMessageSent"
          @navigate="navigateTo"
      />

      <DashboardSection
          v-else-if="currentTab === 'dashboard'"
          :posts="posts"
          :messages="messages"
          :certifications="certifications"
          :projects="projects"
          @create-post="handleCreatePost"
          @update-post="handleUpdatePost"
          @delete-post="handleDeletePost"
          @mark-message-read="handleMarkMessageRead"
          @delete-message="handleDeleteMessage"
          @create-certification="handleCreateCertification"
          @update-certification="handleUpdateCertification"
          @delete-certification="handleDeleteCertification"
          @create-project="handleCreateProject"
          @update-project="handleUpdateProject"
          @delete-project="handleDeleteProject"
      />
    </main>

    <!-- FOOTER / BOTTOM STATUS BAR -->
    <AppFooter
        :current-time="currentTime"
        @navigate="navigateTo"
    />
  </div>
</template>
