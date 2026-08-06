<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Terminal, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  Database
} from 'lucide-vue-next';
import { apiLogs, ApiLog } from '../../../composables/useApi';
import { useI18n } from '../../../composables/useI18n';

const { locale } = useI18n();

const expandedLogs = ref<Record<string, boolean>>({});

const toggleExpand = (id: string) => {
  expandedLogs.value[id] = !expandedLogs.value[id];
};

const clearLogs = () => {
  apiLogs.value = [];
};

const getMethodColor = (method: string) => {
  const m = method.toUpperCase();
  if (m === 'GET') return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
  if (m === 'POST') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (m === 'PUT') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  if (m === 'DELETE') return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
};
</script>

<template>
  <div class="bg-[#0B0D11] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono animate-fade-in text-xs">
    <!-- CABECERA DE CONSOLA -->
    <div class="px-5 py-3 border-b border-white/10 bg-[#111419] flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md animate-pulse">
          <Terminal class="h-4 w-4" />
        </div>
        <div class="space-y-0.5">
          <h3 class="text-xs font-bold text-white uppercase tracking-wider">
            {{ locale === 'es' ? 'TERMINAL_TRAFICO_API.LOG' : 'API_TRAFFIC_MONITOR.LOG' }}
          </h3>
          <p class="text-[9px] text-slate-500 uppercase tracking-tight">
            {{ locale === 'es' ? 'Inspección de cargas útiles HTTP en tiempo real' : 'Real-time inspection of HTTP payloads' }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-1.5 text-[10px] text-[#94A3B8]">
          <Database class="h-3 w-3 text-emerald-400" />
          <span>Laravel Bridge</span>
        </div>
        
        <button 
          @click="clearLogs"
          :disabled="apiLogs.length === 0"
          class="p-1 px-2 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-white/5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-[10px] flex items-center space-x-1"
          :title="locale === 'es' ? 'Limpiar historial' : 'Clear history'"
        >
          <Trash2 class="h-3 w-3" />
          <span>{{ locale === 'es' ? 'Limpiar' : 'Clear' }}</span>
        </button>
      </div>
    </div>

    <!-- LISTA DE PETICIONES -->
    <div class="max-h-[380px] overflow-y-auto divide-y divide-white/5 bg-[#090B0E]">
      <div v-if="apiLogs.length === 0" class="px-6 py-12 text-center text-slate-500 font-mono text-[11px] uppercase">
        <p>📡 {{ locale === 'es' ? 'Escuchando peticiones HTTP en segundo plano...' : 'Listening for HTTP traffic in background...' }}</p>
        <p class="text-[9px] text-slate-600 mt-2">
          {{ locale === 'es' ? 'Haz clic en Guardar, Crear o Eliminar para ver el envío a la API.' : 'Click Save, Create, or Delete anywhere to inspect active API payloads.' }}
        </p>
      </div>

      <div 
        v-for="log in apiLogs" 
        :key="log.id"
        class="transition-colors"
        :class="[expandedLogs[log.id] ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]']"
      >
        <!-- CABECERA DE LOG -->
        <div 
          @click="toggleExpand(log.id)"
          class="px-5 py-3 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
        >
          <div class="flex items-center space-x-2.5 min-w-0 flex-1">
            <!-- Método HTTP -->
            <span 
              class="px-2 py-0.5 rounded font-bold text-[10px] border tracking-wide shrink-0 font-mono"
              :class="getMethodColor(log.method)"
            >
              {{ log.method }}
            </span>

            <!-- Path relativo -->
            <span class="text-white font-mono font-medium truncate text-xs">
              {{ log.url.replace(/https?:\/\/[^\/]+/, '') }}
            </span>
          </div>

          <!-- Detalles estado y hora -->
          <div class="flex items-center space-x-3 shrink-0 font-mono text-[10px]">
            <span class="text-slate-500 flex items-center space-x-1">
              <Clock class="h-3 w-3" />
              <span>{{ log.timestamp }}</span>
            </span>

            <!-- Status Code -->
            <span 
              v-if="log.status !== 'pending'"
              class="flex items-center space-x-1 font-bold"
              :class="[log.status === 'success' ? 'text-emerald-400' : 'text-rose-400']"
            >
              <CheckCircle2 v-if="log.status === 'success'" class="h-3.5 w-3.5" />
              <XCircle v-else class="h-3.5 w-3.5" />
              <span>{{ log.statusCode || 'ERR' }}</span>
            </span>

            <span v-else class="text-yellow-400 flex items-center space-x-1 font-bold animate-pulse">
              <span class="h-2 w-2 rounded-full bg-yellow-400 animate-ping"></span>
              <span>PENDING</span>
            </span>

            <!-- Toggle Arrow -->
            <component 
              :is="expandedLogs[log.id] ? ChevronUp : ChevronDown" 
              class="h-4 w-4 text-slate-500" 
            />
          </div>
        </div>

        <!-- DETALLES EXPANDIDOS (PAYLOAD Y RESPUESTA) -->
        <div 
          v-if="expandedLogs[log.id]" 
          class="px-5 pb-4 pt-1 border-t border-white/5 bg-black/40 text-[11px] leading-relaxed space-y-3 animate-fade-in"
        >
          <!-- URL ABSOLUTA -->
          <div class="flex items-center space-x-2 text-slate-500 pb-2 border-b border-white/5">
            <span class="uppercase font-bold text-[9px] text-emerald-400">Endpoint:</span>
            <span class="font-mono text-[10px] select-all break-all text-slate-400">{{ log.url }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- CARGA ÚTIL ENVIADA (JSON PAYLOAD) -->
            <div class="space-y-1">
              <div class="text-[9px] uppercase font-bold text-emerald-400 flex items-center space-x-1">
                <span>⚡</span>
                <span>{{ locale === 'es' ? 'CARGA ÚTIL ENVIADA (BODY PAYLOAD)' : 'SENT PAYLOAD (BODY PAYLOAD)' }}</span>
              </div>
              <div class="bg-[#111419] border border-white/5 rounded-lg p-3 text-slate-300 overflow-x-auto max-h-[220px]">
                <pre v-if="log.payload" class="font-mono text-[10px] select-all">{{ JSON.stringify(log.payload, null, 2) }}</pre>
                <span v-else class="text-slate-500 italic font-mono text-[10px]">{{ locale === 'es' ? '[Sin carga útil / Vacío]' : '[No Payload / Empty]' }}</span>
              </div>
            </div>

            <!-- RESPUESTA DEL BACKEND LARAVEL -->
            <div class="space-y-1">
              <div class="text-[9px] uppercase font-bold text-sky-400 flex items-center space-x-1">
                <span>📡</span>
                <span>{{ locale === 'es' ? 'RESPUESTA DEL SERVIDOR (BACKEND RESPONSE)' : 'SERVER RESPONSE (BACKEND RESPONSE)' }}</span>
              </div>
              <div class="bg-[#111419] border border-white/5 rounded-lg p-3 overflow-x-auto max-h-[220px]" :class="[log.status === 'error' ? 'text-rose-300 border-rose-500/10' : 'text-slate-300']">
                <pre v-if="log.response" class="font-mono text-[10px] select-all">{{ JSON.stringify(log.response, null, 2) }}</pre>
                <span v-else-if="log.status === 'pending'" class="text-yellow-400 italic font-mono text-[10px] animate-pulse">{{ locale === 'es' ? '[Esperando respuesta...]' : '[Awaiting response...]' }}</span>
                <span v-else class="text-slate-500 italic font-mono text-[10px]">{{ locale === 'es' ? '[Sin datos de respuesta]' : '[No response data]' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
