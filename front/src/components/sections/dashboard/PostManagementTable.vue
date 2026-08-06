<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next';
import { Post } from '../../../types';
import { useI18n } from '../../../composables/useI18n';

defineProps<{
  posts: Post[];
}>();

defineEmits<{
  (e: 'edit-post', post: Post): void;
  (e: 'delete-post', id: string): void;
}>();

const { t, locale } = useI18n();
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <div class="bg-[#14171C] border border-white/5 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr class="border-b border-white/5 bg-[#1A1E26] text-slate-300 font-mono">
              <th class="p-4">{{ t('dashboard.th_title') }}</th>
              <th class="p-4 hidden md:table-cell">{{ t('dashboard.th_category') }}</th>
              <th class="p-4 hidden md:table-cell">{{ t('dashboard.th_date') }}</th>
              <th class="p-4 hidden lg:table-cell">{{ t('dashboard.th_tags') }}</th>
              <th class="p-4 text-right">{{ t('dashboard.th_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-slate-300">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-[#1A1E26]/50 transition-colors">
              <td class="p-4 font-semibold">
                <div>{{ post.title }}</div>
                <div class="text-xs text-[#94A3B8] font-normal md:hidden mt-1">{{ post.category }} · {{ post.date }}</div>
              </td>
              <td class="p-4 hidden md:table-cell">
                <span class="px-2 py-1 rounded bg-[#1A1E26] text-xs font-mono text-emerald-400 border border-white/5">
                  {{ post.category }}
                </span>
              </td>
              <td class="p-4 hidden md:table-cell font-mono text-xs">{{ post.date }}</td>
              <td class="p-4 hidden lg:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in post.tags" :key="tag" class="px-1.5 py-0.2 bg-[#1A1E26] border border-white/5 rounded text-[10px] text-slate-400">
                    #{{ tag }}
                  </span>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="inline-flex items-center space-x-2">
                  <button 
                    @click="$emit('edit-post', post)" 
                    class="p-1.5 rounded bg-[#1A1E26] text-slate-400 hover:text-white transition-colors"
                    :title="locale === 'es' ? 'Editar' : 'Edit'"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button 
                    @click="$emit('delete-post', post.id)" 
                    class="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    :title="locale === 'es' ? 'Eliminar' : 'Delete'"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="posts.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-500 text-xs">
                {{ t('dashboard.no_posts') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
