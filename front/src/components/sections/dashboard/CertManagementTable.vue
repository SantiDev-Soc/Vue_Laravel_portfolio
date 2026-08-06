<script setup lang="ts">
import { Edit, Trash2, ShieldCheck, GraduationCap, Link } from 'lucide-vue-next';
import { Certification } from '../../../types';
import { useI18n } from '../../../composables/useI18n';

defineProps<{
  certifications: Certification[];
}>();

defineEmits<{
  (e: 'edit-certification', cert: Certification): void;
  (e: 'delete-certification', id: string): void;
}>();

const { locale } = useI18n();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, year, month, day] = match;
    const monthsEs = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const monthsEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = locale.value === 'es' ? monthsEs[monthIndex] : monthsEn[monthIndex];
      return `${monthName} ${year}`;
    }

    return locale.value === 'es' ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
  }
  return dateStr;
};
</script>

<template>
  <div class="space-y-4 animate-fade-in">
    <div class="bg-[#14171C] border border-white/5 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
          <tr class="border-b border-white/5 bg-[#1A1E26] text-slate-300 font-mono">
            <th class="p-4">{{ locale === 'es' ? 'Acreditación' : 'Credential' }}</th>
            <th class="p-4 hidden md:table-cell">{{ locale === 'es' ? 'Emisor' : 'Issuer' }}</th>
            <th class="p-4 hidden md:table-cell">{{ locale === 'es' ? 'Año / Fecha' : 'Year / Date' }}</th>
            <th class="p-4 hidden lg:table-cell">{{ locale === 'es' ? 'Estado' : 'Status' }}</th>
            <th class="p-4 text-right">{{ locale === 'es' ? 'Acciones' : 'Actions' }}</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-slate-300">
          <tr v-for="cert in certifications" :key="cert.id" class="hover:bg-[#1A1E26]/50 transition-colors">
            <td class="p-4">
              <div class="font-semibold flex items-center space-x-1.5">
                <span>{{ locale === 'en' && cert.title_en ? cert.title_en : cert.title }}</span>
                <a v-if="cert.link" :href="cert.link" target="_blank" class="text-emerald-400 hover:text-white transition-colors" title="Verificar enlace">
                  <Link class="h-3.5 w-3.5" />
                </a>
              </div>
              <div class="text-[10px] text-[#94A3B8] font-normal md:hidden mt-1">
                {{ cert.issuer }} · {{ formatDate(cert.date) }} · {{ cert.status.toUpperCase() }}
              </div>
            </td>
            <td class="p-4 hidden md:table-cell font-mono text-xs text-[#94A3B8]">
              {{ cert.issuer }}
            </td>
            <td class="p-4 hidden md:table-cell font-mono text-xs">{{ formatDate(cert.date) }}</td>
            <td class="p-4 hidden lg:table-cell">
                <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                    :class="[
                    cert.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  ]"
                >
                  {{ cert.status === 'completed' ? (locale === 'es' ? 'COMPLETADO' : 'COMPLETED') : (locale === 'es' ? 'EN CURSO' : 'IN PROGRESS') }}
                </span>
            </td>
            <td class="p-4 text-right">
              <div class="inline-flex items-center space-x-2">
                <button
                    @click="$emit('edit-certification', cert)"
                    class="p-1.5 rounded bg-[#1A1E26] text-slate-400 hover:text-white transition-colors"
                    :title="locale === 'es' ? 'Editar' : 'Edit'"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                    @click="$emit('delete-certification', cert.id)"
                    class="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    :title="locale === 'es' ? 'Eliminar' : 'Delete'"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="certifications.length === 0">
            <td colspan="5" class="p-8 text-center text-slate-500 text-xs font-mono">
              {{ locale === 'es' ? 'No hay certificaciones o acreditaciones registradas.' : 'No credentials or certifications registered.' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
