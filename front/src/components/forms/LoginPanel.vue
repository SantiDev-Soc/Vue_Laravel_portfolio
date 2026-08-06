<script setup lang="ts">
import { ref } from 'vue';
import { Terminal, Lock, Mail, ArrowRight, ShieldAlert, Sparkles } from 'lucide-vue-next';
import { useAuth } from '../../composables/useAuth';
import { useApi } from '../../composables/useApi';
import { useI18n } from '../../composables/useI18n';

const { t, locale } = useI18n();
const { loginLocal, loginRemote } = useAuth();
const { backendUrl, isRemoteActive } = useApi();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const handleLoginSubmit = async () => {
  errorMsg.value = '';
  
  if (!password.value) {
    errorMsg.value = locale.value === 'es' 
      ? 'La contraseña es requerida' 
      : 'Password is required';
    return;
  }

  isLoading.value = true;

  try {
    const trimmedEmail = email.value.trim();
    if (trimmedEmail) {
      // Intento de login real remoto en Laravel API si se ingresó un correo electrónico
      const success = await loginRemote(backendUrl.value, trimmedEmail, password.value);
      if (!success) {
        errorMsg.value = locale.value === 'es' 
          ? 'Credenciales de Laravel incorrectas o API desconectada. Verifica que el correo y contraseña sean correctos.' 
          : 'Invalid Laravel credentials or API offline. Verify that your email and password are correct.';
      }
    } else {
      // Login offline/local si el correo se dejó vacío (ej: para entrar como "guest")
      const success = loginLocal(password.value);
      if (!success) {
        errorMsg.value = locale.value === 'es' 
          ? 'Contraseña local incorrecta. Introduce tu correo de administrador o usa "guest" para ingresar.' 
          : 'Invalid local password. Enter your admin email or use "guest" to enter.';
      }
    }
  } catch (e) {
    errorMsg.value = locale.value === 'es' 
      ? 'Fallo en la comunicación con el servidor' 
      : 'Server communication failure';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto my-12 animate-fade-in">
    <div class="relative">
      <!-- Decoración de fondo difuminado -->
      <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-20 blur-xl"></div>
      
      <div class="relative bg-[#14171C] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <!-- Cabecera de Consola -->
        <div class="flex items-center justify-between border-b border-white/5 pb-4">
          <div class="flex items-center space-x-2">
            <span class="h-3 w-3 rounded-full bg-red-500/70"></span>
            <span class="h-3 w-3 rounded-full bg-yellow-500/70"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-500/70"></span>
          </div>
          <span class="text-xs font-mono text-slate-500">SANTI_AUTH_GATEWAY v1.0.0</span>
        </div>

        <div class="space-y-2 text-center">
          <div class="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Terminal class="h-6 w-6" />
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">
            {{ locale === 'es' ? 'Acceso al Panel de Control' : 'Control Panel Access' }}
          </h2>
          <p class="text-xs text-[#94A3B8] max-w-xs mx-auto">
            {{ 
              isRemoteActive() 
                ? (locale === 'es' ? 'Modo API activo. Inicia sesión con tus credenciales de Laravel.' : 'API Mode active. Login with your Laravel credentials.')
                : (locale === 'es' ? 'Modo Local. Introduce la clave de demostración para explorar el portafolio.' : 'Local Mode. Enter the demo key to explore the portfolio.')
            }}
          </p>
        </div>

        <!-- Alerta de Error -->
        <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-mono flex items-start space-x-2">
          <ShieldAlert class="h-4 w-4 shrink-0 mt-0.5" />
          <span>{{ errorMsg }}</span>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLoginSubmit" class="space-y-4">
          <!-- Campo Email -->
          <div class="space-y-1.5">
            <label class="block text-xs font-mono text-emerald-400 uppercase">
              {{ locale === 'es' ? 'Correo Electrónico (Admin)' : 'Email (Admin)' }}
            </label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input 
                v-model="email"
                type="email"
                placeholder="santiago9605es@gmail.com"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <!-- Campo Contraseña -->
          <div class="space-y-1.5">
            <label class="block text-xs font-mono text-emerald-400 uppercase">
              {{ locale === 'es' ? 'Contraseña' : 'Password' }}
            </label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input 
                v-model="password"
                type="password"
                required
                :placeholder="locale === 'es' ? 'Contraseña o guest' : 'Password or guest'"
                class="w-full bg-[#1A1E26] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <!-- Botón de Envío -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 text-xs font-mono uppercase"
          >
            <span>{{ isLoading ? (locale === 'es' ? 'Iniciando...' : 'Authorizing...') : (locale === 'es' ? 'Desbloquear Panel' : 'Unlock Dashboard') }}</span>
            <ArrowRight v-if="!isLoading" class="h-4 w-4" />
          </button>
        </form>

        <!-- Pista para el portafolio (Offline) -->
        <div v-if="!isRemoteActive()" class="bg-[#1A1E26] p-4 rounded-lg border border-emerald-500/10 text-[11px] leading-relaxed text-[#94A3B8] flex items-start space-x-2.5">
          <Sparkles class="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
          <div class="space-y-1">
            <span class="text-emerald-400 font-bold block">{{ locale === 'es' ? 'Acceso de Invitado' : 'Guest Access' }}</span>
            <p class="text-[11px]">
              {{ locale === 'es' 
                ? 'Introduce la clave de abajo para ingresar al panel en modo de solo lectura:' 
                : 'Enter the password below to access the panel in read-only mode:' 
              }}
            </p>
            <ul class="list-disc pl-4 mt-1 space-y-1 text-[11px] text-slate-300">
              <li>
                <strong class="text-emerald-300 font-mono">guest</strong> / <strong class="text-emerald-300 font-mono">invitado</strong>:
                <span>{{ locale === 'es' ? ' Modo Invitado (Solo lectura, ideal para ver el Dashboard sin modificar nada).' : ' Guest Mode (Read-only, perfect for checking the dashboard safely).' }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
