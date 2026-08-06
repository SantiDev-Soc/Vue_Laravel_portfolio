<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Terminal, 
  BookOpen, 
  Calendar, 
  X, 
  ChevronRight 
} from 'lucide-vue-next';
import { Post } from '../../types';
import { useI18n } from '../../composables/useI18n';

const props = defineProps<{
  posts: Post[];
}>();

const { t, locale } = useI18n();

const selectedCategoryFilter = ref<string>('__ALL__');
const selectedPost = ref<Post | null>(null);

const categories = computed(() => {
  const cats = new Set(props.posts.map(p => p.category));
  return ['__ALL__', ...Array.from(cats)];
});

const filteredPosts = computed(() => {
  if (selectedCategoryFilter.value === '__ALL__') {
    return props.posts;
  }
  return props.posts.filter(p => p.category === selectedCategoryFilter.value);
});
</script>

<template>
  <div id="blog-section-container" class="space-y-12 animate-fade-in">
    <!-- HEADER DEL BLOG -->
    <div class="space-y-4 border-b border-white/5 pb-8">
      <p class="text-emerald-400 font-mono text-xs">{{ t('blog.log_label') }}</p>
      <h1 class="text-4xl font-extrabold text-white tracking-tight">{{ t('blog.title') }}</h1>
      <p class="text-[#94A3B8] max-w-2xl">
        {{ t('blog.subtitle') }}
      </p>
    </div>

    <!-- SECCIÓN SOBRE_MI.MD A TODO ANCHO -->
    <div id="sobre-mi-block" class="bg-[#14171C] border border-white/5 rounded-xl p-6 space-y-4 w-full transition-all hover:border-emerald-500/10">
      <h3 class="font-bold text-white text-base font-mono flex items-center space-x-2">
        <Terminal class="h-4 w-4 text-emerald-400" />
        <span>{{ t('blog.sidebar_title') }}</span>
      </h3>
      <p class="text-sm text-[#94A3B8] leading-relaxed">
        {{ t('blog.sidebar_text') }}
      </p>
      <div class="pt-2 border-t border-white/5 flex items-center space-x-2 text-xs text-slate-500">
        <Calendar class="h-3.5 w-3.5" />
        <span>{{ t('blog.sidebar_update') }}</span>
      </div>
    </div>

    <!-- SECCIÓN PRINCIPAL: FILTROS + GRID A TODO ANCHO -->
    <div class="space-y-8">
      <!-- Filtros Rápidos (Categorías) -->
      <div id="categories-filter-bar" class="flex flex-wrap gap-2">
        <button 
          v-for="cat in categories" 
          :key="cat"
          :id="'filter-btn-' + cat.toLowerCase().replace(/\s+/g, '-')"
          @click="selectedCategoryFilter = cat"
          :class="[selectedCategoryFilter === cat ? 'bg-emerald-500 text-black font-semibold' : 'bg-[#14171C] text-[#94A3B8] hover:text-white border border-white/5']"
          class="px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all"
        >
          {{ cat === '__ALL__' ? t('blog.filter_all') : (locale === 'en' ? (props.posts.find(p => p.category === cat)?.category_en || cat) : cat) }}
        </button>
      </div>

      <!-- Grid de Publicaciones -->
      <div v-if="filteredPosts.length > 0" id="posts-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="post in filteredPosts" 
          :key="post.id"
          :id="'post-card-' + post.id"
          class="bg-[#14171C] border border-white/5 hover:border-emerald-500/20 rounded-xl p-6 transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
          @click="selectedPost = post"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{{ locale === 'en' && post.category_en ? post.category_en : post.category }}</span>
              <span>{{ locale === 'en' && post.readTime_en ? post.readTime_en : (post.readTime + ' ' + t('blog.read_time_label')) }}</span>
            </div>
            
            <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
               {{ locale === 'en' && post.title_en ? post.title_en : post.title }}
            </h3>
            
            <p class="text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
              {{ locale === 'en' && post.summary_en ? post.summary_en : post.summary }}
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-[10px] font-mono border border-white/5"
              >
                #{{ tag }}
              </span>
            </div>
            <ChevronRight class="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </article>
      </div>

      <div v-else id="posts-empty-state" class="text-center py-16 bg-[#14171C] border border-white/5 rounded-xl">
        <BookOpen class="h-10 w-10 text-slate-600 mx-auto mb-3" />
        <p class="text-slate-400">{{ t('blog.empty') }}</p>
      </div>
    </div>

    <!-- PORTABLE POST READER (Lector Modal Completo) -->
    <div v-if="selectedPost" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-[#14171C] border border-white/5 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
        <!-- Header Sticky del modal -->
        <div class="sticky top-0 bg-[#14171C]/95 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <span class="text-xs font-mono text-emerald-400 uppercase font-bold">{{ locale === 'en' && selectedPost.category_en ? selectedPost.category_en : selectedPost.category }}</span>
          <button @click="selectedPost = null" class="p-1 rounded bg-[#1A1E26] text-slate-400 hover:text-white transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6 md:p-8 space-y-6">
          <div class="space-y-2">
            <div class="flex items-center space-x-3 text-xs text-slate-500 font-mono">
              <span>{{ selectedPost.date }}</span>
              <span>·</span>
              <span>{{ locale === 'en' && selectedPost.readTime_en ? selectedPost.readTime_en : (selectedPost.readTime + ' ' + t('blog.read_time_label')) }}</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{{ locale === 'en' && selectedPost.title_en ? selectedPost.title_en : selectedPost.title }}</h2>
          </div>

          <!-- Texto con Markdown Simulado -->
          <div class="text-sm md:text-base text-slate-300 space-y-4 leading-relaxed whitespace-pre-line font-sans border-t border-white/5 pt-6">
            {{ locale === 'en' && selectedPost.content_en ? selectedPost.content_en : selectedPost.content }}
          </div>

          <div class="pt-6 border-t border-white/5 flex items-center justify-between">
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in selectedPost.tags" :key="tag" class="px-2 py-0.5 bg-[#1A1E26] text-slate-300 rounded text-xs font-mono border border-white/5">
                #{{ tag }}
              </span>
            </div>
            <button @click="selectedPost = null" class="px-4 py-2 rounded-lg bg-[#1A1E26] hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors">
              {{ t('blog.modal_close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
