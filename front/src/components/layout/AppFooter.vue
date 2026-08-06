<script setup lang="ts">
import { computed } from 'vue';
import { Lock } from 'lucide-vue-next';
import { useI18n } from '../../composables/useI18n';

defineProps<{
  currentTime: string;
}>();

defineEmits<{
  (e: 'navigate', tab: 'home' | 'blog' | 'dashboard' | 'contact'): void;
}>();

const { t } = useI18n();

// Detección automática de la ubicación del usuario según su zona horaria del navegador
const userLocation = computed(() => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return 'MADRID, ESP';

    const tzMap: Record<string, string> = {
      'Europe/Amsterdam': 'AMSTERDAM, NLD',
      'Europe/Brussels': 'BRUSSELS, BEL',
      'Europe/Madrid': 'MADRID, ESP',
      'Europe/Berlin': 'BERLIN, DEU',
      'Europe/Paris': 'PARIS, FRA',
      'Europe/London': 'LONDON, GBR',
      'Europe/Rome': 'ROME, ITA',
      'Europe/Lisbon': 'LISBON, PRT',
      'Europe/Vienna': 'VIENNA, AUT',
      'Europe/Zurich': 'ZURICH, CHE',
      'America/New_York': 'NEW YORK, USA',
      'America/Los_Angeles': 'LOS ANGELES, USA',
      'America/Chicago': 'CHICAGO, USA',
      'America/Argentina/Buenos_Aires': 'BUENOS AIRES, ARG',
      'America/Bogota': 'BOGOTA, COL',
      'America/Mexico_City': 'MEXICO CITY, MEX',
      'America/Santiago': 'SANTIAGO, CHL',
    };

    if (tzMap[tz]) return tzMap[tz];

    // Extraer la ciudad si no está en la lista (ej: Europe/Amsterdam -> AMSTERDAM)
    const parts = tz.split('/');
    if (parts.length >= 2) {
      const city = parts[parts.length - 1].replace(/_/g, ' ').toUpperCase();
      return city;
    }
  } catch (e) {
    // Fallback silencioso
  }
  return 'MADRID, ESP';
});
</script>

<template>
  <footer class="h-10 bg-[#0F1116] border-t border-white/5 flex items-center justify-between px-6 text-[10px] text-slate-500 font-mono mt-24 relative z-20">
    <div class="flex space-x-6">
      <span>LOC: {{ userLocation }}</span>
      <span>TIME: {{ currentTime }}</span>
      <span class="text-emerald-500/80">UPTIME: 99.98%</span>
    </div>
    <div class="flex items-center space-x-4">
      <a href="https://github.com/SantiDev-Soc" target="_blank" class="hover:text-emerald-400 transition-colors">GITHUB</a>
      <a href="https://www.linkedin.com/in/rsantdev" target="_blank" class="hover:text-emerald-400 transition-colors">LINKEDIN</a>
      <button @click="$emit('navigate', 'dashboard')" class="hover:text-emerald-400 transition-colors flex items-center space-x-1">
        <Lock class="h-3 w-3" />
        <span>{{ t('footer.status') }}</span>
      </button>
      <span class="animate-pulse text-emerald-500">●</span>
      <span>READY</span>
    </div>
  </footer>
</template>
