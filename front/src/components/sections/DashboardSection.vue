<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Terminal, 
  Plus, 
  MessageSquare, 
  FileText,
  Settings,
  RefreshCw,
  Check,
  X,
  LogOut,
  Award
} from 'lucide-vue-next';
import { Post, Message, Certification, Project } from '../../types';
import PostFormModal from '../forms/PostFormModal.vue';
import CertFormModal from '../forms/CertFormModal.vue';
import ProjectFormModal from '../forms/ProjectFormModal.vue';
import PostManagementTable from './dashboard/PostManagementTable.vue';
import CertManagementTable from './dashboard/CertManagementTable.vue';
import ProjectManagementTable from './dashboard/ProjectManagementTable.vue';
import InboxMessagesSplitView from './dashboard/InboxMessagesSplitView.vue';
import ApiRequestMonitor from './dashboard/ApiRequestMonitor.vue';
import LoginPanel from '../forms/LoginPanel.vue';
import { useI18n } from '../../composables/useI18n';
import { useApi } from '../../composables/useApi';
import { useAuth } from '../../composables/useAuth';

const props = defineProps<{
  posts: Post[];
  messages: Message[];
  certifications: Certification[];
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: 'create-post', post: Post): void;
  (e: 'update-post', post: Post): void;
  (e: 'delete-post', id: string): void;
  (e: 'delete-message', id: string): void;
  (e: 'mark-message-read', id: string): void;
  (e: 'create-certification', cert: Certification): void;
  (e: 'update-certification', cert: Certification): void;
  (e: 'delete-certification', id: string): void;
  (e: 'create-project', project: Project): void;
  (e: 'update-project', project: Project): void;
  (e: 'delete-project', id: string): void;
}>();

const { t, locale } = useI18n();
const { backendUrl, apiMode, connectionStatus, checkConnection } = useApi();
const { isAuthenticated, isAdmin, logout } = useAuth();

// Estado de pestañas locales
const dashboardSubTab = ref<'posts' | 'inbox' | 'certifications' | 'projects' | 'settings'>('posts');
const testingConnection = ref(false);
const testResult = ref<'success' | 'failed' | null>(null);

// Modal de Creación / Edición de Certificación
const showCertModal = ref(false);
const isEditingCert = ref(false);
const editingCert = ref<Certification>({
  id: '',
  title: '',
  issuer: '',
  date: '',
  description: '',
  link: '',
  status: 'completed'
});

const openAddCertModal = () => {
  isEditingCert.value = false;
  editingCert.value = {
    id: Date.now().toString(),
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    description: '',
    link: '',
    status: 'completed'
  };
  showCertModal.value = true;
};

const handleOpenEditCert = (cert: Certification) => {
  isEditingCert.value = true;
  editingCert.value = { ...cert };
  showCertModal.value = true;
};

const handleSaveCert = (savedCert: Certification) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes guardar cambios. Inicia sesión como administrador.' : 'Access Denied: As a read-only guest user you cannot save changes. Please login as administrator.');
    return;
  }
  if (isEditingCert.value) {
    emit('update-certification', savedCert);
  } else {
    emit('create-certification', savedCert);
  }
  showCertModal.value = false;
};

const handleDeleteCert = (id: string) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes borrar elementos.' : 'Access Denied: As a read-only guest user you cannot delete items.');
    return;
  }
  const confirmMsg = locale.value === 'es'
    ? '¿Estás seguro de que deseas eliminar esta acreditación?'
    : 'Are you sure you want to delete this credential?';
  if (confirm(confirmMsg)) {
    emit('delete-certification', id);
  }
};

// Modal de Creación / Edición de Proyecto
const showProjectModal = ref(false);
const isEditingProject = ref(false);
const editingProject = ref<Project>({
  id: '',
  title: '',
  description: '',
  status: 'ESTADO: DESARROLLO',
  technologies: [],
  category: 'Terminal'
});

const openAddProjectModal = () => {
  isEditingProject.value = false;
  editingProject.value = {
    id: Date.now().toString(),
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    status: 'ESTADO: DESARROLLO',
    status_en: 'STATUS: DEVELOPMENT',
    technologies: [],
    link_url: '',
    link_label: 'ENLACE PROYECTO:',
    link_label_en: 'PROJECT LINK:',
    category: 'Terminal'
  };
  showProjectModal.value = true;
};

const handleOpenEditProject = (proj: Project) => {
  isEditingProject.value = true;
  editingProject.value = { ...proj };
  showProjectModal.value = true;
};

const handleSaveProject = (savedProj: Project) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes guardar cambios. Inicia sesión como administrador.' : 'Access Denied: As a read-only guest user you cannot save changes. Please login as administrator.');
    return;
  }
  if (isEditingProject.value) {
    emit('update-project', savedProj);
  } else {
    emit('create-project', savedProj);
  }
  showProjectModal.value = false;
};

const handleDeleteProject = (id: string) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes borrar elementos.' : 'Access Denied: As a read-only guest user you cannot delete items.');
    return;
  }
  const confirmMsg = locale.value === 'es'
    ? '¿Estás seguro de que deseas eliminar este proyecto del catálogo?'
    : 'Are you sure you want to delete this project from the catalog?';
  if (confirm(confirmMsg)) {
    emit('delete-project', id);
  }
};

// Modal de Creación / Edición de Post
const showPostModal = ref(false);
const isEditing = ref(false);
const editingPost = ref<Post>({
  id: '',
  title: '',
  summary: '',
  content: '',
  category: 'Backend',
  readTime: '5 min lectura',
  date: '',
  tags: []
});

// Conteo de mensajes no leídos
const unreadCount = computed(() => {
  return props.messages.filter(m => !m.read).length;
});

// Métodos de posts (CRUD)
const openAddPostModal = () => {
  isEditing.value = false;
  editingPost.value = {
    id: Date.now().toString(),
    title: '',
    summary: '',
    content: '',
    category: 'Backend',
    readTime: locale.value === 'es' ? '5 min lectura' : '5 min read',
    date: new Date().toISOString().split('T')[0],
    tags: []
  };
  showPostModal.value = true;
};

const handleOpenEditPost = (post: Post) => {
  isEditing.value = true;
  editingPost.value = { ...post };
  showPostModal.value = true;
};

const handleSavePost = (savedPost: Post) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes guardar publicaciones.' : 'Access Denied: As a read-only guest user you cannot save publications.');
    return;
  }
  if (isEditing.value) {
    emit('update-post', savedPost);
  } else {
    emit('create-post', savedPost);
  }
  showPostModal.value = false;
};

const handleDeletePost = (id: string) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes borrar publicaciones.' : 'Access Denied: As a read-only guest user you cannot delete publications.');
    return;
  }
  const confirmMsg = locale.value === 'es'
    ? '¿Estás seguro de que deseas eliminar esta publicación técnica?'
    : 'Are you sure you want to delete this technical post?';
  if (confirm(confirmMsg)) {
    emit('delete-post', id);
  }
};

const handleDeleteMessage = (id: string) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes eliminar mensajes.' : 'Access Denied: As a read-only guest user you cannot delete messages.');
    return;
  }
  emit('delete-message', id);
};

const handleMarkMessageRead = (id: string) => {
  if (!isAdmin.value) {
    alert(locale.value === 'es' ? 'Acceso Denegado: Como usuario invitado de solo lectura no puedes gestionar el buzón.' : 'Access Denied: As a read-only guest user you cannot manage the inbox.');
    return;
  }
  emit('mark-message-read', id);
};

const testBackendConnection = async () => {
  testingConnection.value = true;
  testResult.value = null;
  try {
    const connected = await checkConnection();
    testResult.value = connected ? 'success' : 'failed';
  } catch {
    testResult.value = 'failed';
  } finally {
    testingConnection.value = false;
  }
};
</script>

<template>
  <!-- SINO ESTÁ AUTENTICADO: MOSTRAR PANEL DE LOGIN -->
  <div v-if="!isAuthenticated">
    <LoginPanel />
  </div>

  <!-- SI ESTÁ AUTENTICADO: ACCESO COMPLETO AL DASHBOARD -->
  <div v-else class="space-y-8 animate-fade-in">
    <!-- HEADER DEL DASHBOARD -->
    <div class="bg-[#14171C] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
          <Terminal class="h-3.5 w-3.5" :class="{ 'animate-pulse': connectionStatus === 'checking' }" />
          <span>PORTFOLIO_ENGINE_DASHBOARD v1.0.4</span>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">{{ t('dashboard.title') }}</h1>
        <p class="text-[#94A3B8] text-xs">
          {{ t('dashboard.subtitle') }}
          <span v-if="connectionStatus === 'connected'" class="text-emerald-400 font-mono ml-2">● API LARAVEL ACTIVA</span>
          <span v-else class="text-slate-500 font-mono ml-2">○ MODO LOCAL (LOCALSTORAGE)</span>
        </p>
      </div>

      <div class="flex items-center space-x-3 self-end md:self-center">
        <!-- Acciones dinámicas según pestaña actual -->
        <button 
          v-if="dashboardSubTab === 'posts'"
          @click="openAddPostModal"
          class="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
        >
          <Plus class="h-4 w-4" />
          <span>{{ t('dashboard.new_post') }}</span>
        </button>

        <button 
          v-if="dashboardSubTab === 'certifications'"
          @click="openAddCertModal"
          class="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
        >
          <Plus class="h-4 w-4" />
          <span>{{ locale === 'es' ? 'Añadir Certificación' : 'Add Certification' }}</span>
        </button>

        <button 
          v-if="dashboardSubTab === 'projects'"
          @click="openAddProjectModal"
          class="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
        >
          <Plus class="h-4 w-4" />
          <span>{{ locale === 'es' ? 'Añadir Proyecto' : 'Add Project' }}</span>
        </button>

        <!-- Cerrar Sesión -->
        <button 
          @click="logout"
          class="p-2 bg-[#1A1E26] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
          :title="locale === 'es' ? 'Cerrar Sesión' : 'Logout'"
        >
          <LogOut class="h-4.5 w-4.5" />
        </button>
      </div>
    </div>

    <!-- BANNER DE USUARIO INVITADO (SOLO LECTURA) -->
    <div v-if="!isAdmin" class="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs flex items-start space-x-3 shadow-md animate-fade-in">
      <div class="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
        <Terminal class="h-4 w-4" />
      </div>
      <div class="space-y-1">
        <p class="font-bold uppercase tracking-wider font-mono">
          {{ locale === 'es' ? 'Modo de Solo Lectura Activo (Invitado)' : 'Read-Only Mode Active (Guest)' }}
        </p>
        <p class="text-slate-300 leading-relaxed text-[11px]">
          {{ locale === 'es' 
            ? 'Has iniciado sesión como Reclutador / Invitado. Puedes explorar libremente todo el Dashboard (incluyendo abrir los formularios para evaluar su diseño y campos), pero las acciones de guardar, editar, crear y eliminar están protegidas contra escrituras para salvaguardar el entorno. Inicia sesión con tus credenciales de administrador para probar los flujos de escritura completos.' 
            : 'You are logged in as a Guest / Recruiter. Feel free to explore the dashboard (including opening form modals to review fields and design), but saving, creating, and deleting are protected to maintain the environment. Log in with your admin credentials to test full write privileges.' 
          }}
        </p>
      </div>
    </div>

    <!-- TABS DE OPERACIONES -->
    <div class="flex border-b border-white/5 overflow-x-auto select-none no-scrollbar">
      <button 
        @click="dashboardSubTab = 'posts'"
        :class="[dashboardSubTab === 'posts' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold bg-white/[0.01]' : 'text-slate-400 hover:text-white']"
        class="px-5 py-3 text-sm font-mono flex items-center space-x-2 transition-all shrink-0"
      >
        <FileText class="h-4 w-4" />
        <span>{{ t('dashboard.tab_posts') }} ({{ posts.length }})</span>
      </button>

      <button 
        @click="dashboardSubTab = 'projects'"
        :class="[dashboardSubTab === 'projects' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold bg-white/[0.01]' : 'text-slate-400 hover:text-white']"
        class="px-5 py-3 text-sm font-mono flex items-center space-x-2 transition-all shrink-0"
      >
        <Terminal class="h-4 w-4" />
        <span>{{ locale === 'es' ? 'Proyectos' : 'Projects' }} ({{ projects?.length || 0 }})</span>
      </button>

      <button 
        @click="dashboardSubTab = 'certifications'"
        :class="[dashboardSubTab === 'certifications' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold bg-white/[0.01]' : 'text-slate-400 hover:text-white']"
        class="px-5 py-3 text-sm font-mono flex items-center space-x-2 transition-all shrink-0 relative"
      >
        <Award class="h-4 w-4" />
        <span>{{ locale === 'es' ? 'Certificaciones' : 'Certifications' }} ({{ certifications?.length || 0 }})</span>
      </button>

      <button 
        @click="dashboardSubTab = 'inbox'"
        :class="[dashboardSubTab === 'inbox' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold bg-white/[0.01]' : 'text-slate-400 hover:text-white']"
        class="px-5 py-3 text-sm font-mono flex items-center space-x-2 transition-all shrink-0 relative"
      >
        <MessageSquare class="h-4 w-4" />
        <span>{{ t('dashboard.tab_inbox') }}</span>
        <span v-if="unreadCount > 0" class="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
          {{ unreadCount }}
        </span>
      </button>

      <button 
        @click="dashboardSubTab = 'settings'"
        :class="[dashboardSubTab === 'settings' ? 'border-b-2 border-emerald-400 text-emerald-300 font-bold bg-white/[0.01]' : 'text-slate-400 hover:text-white']"
        class="px-5 py-3 text-sm font-mono flex items-center space-x-2 transition-all shrink-0"
      >
        <Settings class="h-4 w-4" />
        <span>{{ locale === 'es' ? 'Conexión API' : 'API Connection' }}</span>
      </button>
    </div>

    <!-- SUBSECCIÓN: ADMINISTRACIÓN DE PUBLICACIONES (CRUD LIST) -->
    <div v-if="dashboardSubTab === 'posts'">
      <PostManagementTable 
        :posts="posts" 
        @edit-post="handleOpenEditPost" 
        @delete-post="handleDeletePost" 
      />
    </div>

    <!-- SUBSECCIÓN: ADMINISTRACIÓN DE PROYECTOS (CRUD LIST) -->
    <div v-if="dashboardSubTab === 'projects'">
      <ProjectManagementTable 
        :projects="projects" 
        @edit-project="handleOpenEditProject" 
        @delete-project="handleDeleteProject" 
      />
    </div>

    <!-- SUBSECCIÓN: CERTIFICACIONES Y ESTUDIOS (CRUD LIST) -->
    <div v-if="dashboardSubTab === 'certifications'">
      <CertManagementTable 
        :certifications="certifications" 
        @edit-certification="handleOpenEditCert" 
        @delete-certification="handleDeleteCert" 
      />
    </div>

    <!-- SUBSECCIÓN: BUZÓN / INBOX -->
    <div v-if="dashboardSubTab === 'inbox'">
      <InboxMessagesSplitView 
        :messages="messages" 
        @delete-message="handleDeleteMessage" 
        @mark-message-read="handleMarkMessageRead" 
      />
    </div>

    <!-- SUBSECCIÓN: CONFIGURACIÓN DE CONEXIÓN LARAVEL -->
    <div v-if="dashboardSubTab === 'settings'" class="space-y-6 animate-fade-in">
      <div class="bg-[#14171C] border border-white/5 rounded-xl p-6 space-y-6">
        <div>
          <h3 class="text-lg font-bold text-white mb-1">
            {{ locale === 'es' ? 'Configuración de Enlace con Laravel Backend' : 'Laravel Backend Integration Settings' }}
          </h3>
          <p class="text-xs text-[#94A3B8]">
            {{ locale === 'es' 
              ? 'Conecta este motor Vue 3 directamente a tu API construida con Laravel. Si el servidor backend está inactivo, la aplicación continuará funcionando usando almacenamiento local en caché de manera transparente.'
              : 'Connect this Vue 3 engine directly to your custom Laravel API. If the backend server is offline, the app will gracefully continue operating using local browser caching.' 
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          <!-- URL y Modo -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-emerald-400 mb-2 uppercase">
                {{ locale === 'es' ? 'URL Base de la API' : 'API Base URL' }}
              </label>
              <input 
                v-model="backendUrl"
                type="text"
                placeholder="http://localhost:8000/api"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-emerald-400 mb-2 uppercase">
                {{ locale === 'es' ? 'Modo de Operación' : 'Operation Mode' }}
              </label>
              <select 
                v-model="apiMode"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="auto">
                  {{ locale === 'es' ? 'Auto-Detectar (Recomendado)' : 'Auto-Detect (Recommended)' }}
                </option>
                <option value="local">
                  {{ locale === 'es' ? 'Forzar Almacenamiento Local (Local)' : 'Force Local Storage (Local)' }}
                </option>
                <option value="remote">
                  {{ locale === 'es' ? 'Forzar Conexión API (Laravel)' : 'Force API Connection (Laravel)' }}
                </option>
              </select>
            </div>
          </div>

          <!-- Estado de conexión actual -->
          <div class="bg-[#1A1E26] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div class="space-y-3">
              <span class="text-[10px] font-mono text-slate-500 uppercase">
                {{ locale === 'es' ? 'Auditoría de Estado' : 'Status Audit' }}
              </span>
              
              <div class="flex items-center space-x-3">
                <span 
                  class="h-3.5 w-3.5 rounded-full"
                  :class="[
                    connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                    connectionStatus === 'checking' ? 'bg-yellow-500 animate-spin border-t-transparent' : 'bg-red-500'
                  ]"
                ></span>
                <div>
                  <p class="font-mono text-sm font-bold text-white">
                    {{ 
                      connectionStatus === 'connected' ? 'API_ONLINE' : 
                      connectionStatus === 'checking' ? 'CHECKING_CONNECTION...' : 'API_OFFLINE' 
                    }}
                  </p>
                  <p class="text-[11px] text-[#94A3B8]">
                    {{ connectionStatus === 'connected' 
                      ? (locale === 'es' ? 'Conectado a Laravel satisfactoriamente.' : 'Connected to Laravel successfully.')
                      : (locale === 'es' ? 'No se detecta servicio activo en la URL configurada.' : 'No active service detected at the configured URL.')
                    }}
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-white/5 flex items-center justify-between">
              <button 
                @click="testBackendConnection"
                :disabled="testingConnection"
                class="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs rounded-lg flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': testingConnection }" />
                <span>{{ locale === 'es' ? 'Probar Conexión' : 'Test Connection' }}</span>
              </button>

              <span v-if="testResult === 'success'" class="text-emerald-400 text-xs font-mono flex items-center space-x-1">
                <Check class="h-4 w-4" />
                <span>{{ locale === 'es' ? 'Éxito' : 'Success' }}</span>
              </span>
              <span v-else-if="testResult === 'failed'" class="text-red-400 text-xs font-mono flex items-center space-x-1">
                <X class="h-4 w-4" />
                <span>{{ locale === 'es' ? 'Error' : 'Failed' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TERMINAL DE PETICIONES API (MONITOR EN VIVO) -->
    <ApiRequestMonitor class="mt-8" />

    <!-- MODAL FORMULARIO DE POST -->
    <PostFormModal 
      :is-open="showPostModal" 
      :is-editing="isEditing" 
      :post="editingPost" 
      @close="showPostModal = false" 
      @save="handleSavePost" 
    />

    <!-- MODAL FORMULARIO DE CERTIFICACIONES -->
    <CertFormModal 
      :is-open="showCertModal" 
      :is-editing="isEditingCert" 
      :certification="editingCert" 
      @close="showCertModal = false" 
      @save="handleSaveCert" 
    />

    <!-- MODAL FORMULARIO DE PROYECTOS -->
    <ProjectFormModal 
      :is-open="showProjectModal" 
      :is-editing="isEditingProject" 
      :project="editingProject" 
      @close="showProjectModal = false" 
      @save="handleSaveProject" 
    />
  </div>
</template>
