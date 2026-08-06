<script setup lang="ts">
import { ref } from 'vue';
import { Mail, Trash2 } from 'lucide-vue-next';
import { Message } from '../../../types';
import { useI18n } from '../../../composables/useI18n';

const props = defineProps<{
  messages: Message[];
}>();

const emit = defineEmits<{
  (e: 'delete-message', id: string): void;
  (e: 'mark-message-read', id: string): void;
}>();

const { t, locale } = useI18n();

const activeMessage = ref<Message | null>(null);

const selectInboxMessage = (msg: Message) => {
  activeMessage.value = msg;
  if (!msg.read) {
    emit('mark-message-read', msg.id);
  }
};

const handleDeleteMessage = (id: string) => {
  const confirmMsg = locale.value === 'es' 
    ? '¿Deseas borrar este mensaje del buzón?'
    : 'Do you want to delete this message from the inbox?';
  if (confirm(confirmMsg)) {
    emit('delete-message', id);
    if (activeMessage.value?.id === id) {
      activeMessage.value = null;
    }
  }
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
    <!-- Lista de mensajes -->
    <div class="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        @click="selectInboxMessage(msg)"
        :class="[
          activeMessage?.id === msg.id ? 'bg-[#1A1E26] border-emerald-500/50' : 'bg-[#14171C] border-white/5',
          !msg.read ? 'border-l-4 border-l-emerald-400' : ''
        ]"
        class="border rounded-xl p-4 cursor-pointer transition-all hover:border-slate-700/60 flex flex-col justify-between space-y-2"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-white truncate max-w-[150px]">{{ msg.name }}</span>
          <span class="text-[10px] font-mono text-slate-500">{{ msg.date.substring(5, 16) }}</span>
        </div>
        <div class="text-xs text-emerald-300 font-mono truncate">{{ msg.subject }}</div>
        <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{{ msg.message }}</p>
      </div>

      <div v-if="messages.length === 0" class="text-center py-10 bg-[#14171C] rounded-xl text-slate-500 text-xs">
        {{ t('dashboard.empty_inbox') }}
      </div>
    </div>

    <!-- Detalles del mensaje seleccionado -->
    <div class="lg:col-span-7 bg-[#14171C] border border-white/5 rounded-xl p-5 min-h-[300px]">
      <div v-if="activeMessage" class="space-y-6">
        <div class="flex items-center justify-between border-b border-white/5 pb-4">
          <div class="space-y-1">
            <h4 class="font-bold text-white text-base">{{ activeMessage.name }}</h4>
            <p class="text-xs text-emerald-400 font-mono">{{ activeMessage.email }}</p>
          </div>
          <button 
            @click="handleDeleteMessage(activeMessage.id)"
            class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <Trash2 class="h-3.5 w-3.5" />
            <span>{{ t('dashboard.delete_message') }}</span>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <span class="text-[10px] font-mono text-slate-500 uppercase">{{ t('dashboard.msg_subject_label') }}</span>
            <p class="text-white text-sm font-semibold pt-1">{{ activeMessage.subject }}</p>
            <p class="text-xs font-mono text-slate-400 pt-0.5">{{ activeMessage.date }}</p>
          </div>

          <div class="bg-[#1A1E26] rounded-xl p-4 border border-white/5">
            <span class="text-[10px] font-mono text-slate-500 uppercase">{{ t('dashboard.msg_body_label') }}</span>
            <p class="text-slate-300 text-xs md:text-sm pt-2 leading-relaxed whitespace-pre-line">{{ activeMessage.message }}</p>
          </div>
        </div>
      </div>

      <div v-else class="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 py-16">
        <Mail class="h-8 w-8 text-slate-600" />
        <p class="text-xs font-mono">{{ t('dashboard.select_msg_prompt') }}</p>
      </div>
    </div>
  </div>
</template>
