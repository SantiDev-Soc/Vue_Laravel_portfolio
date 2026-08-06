import { ref } from 'vue';
import { useAuth } from '../useAuth';

export interface ApiLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  payload?: any;
  status: 'pending' | 'success' | 'error';
  statusCode?: number;
  response?: any;
}

// Global state for live API request logging
export const apiLogs = ref<ApiLog[]>([]);

const defaultUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';
export const backendUrl = ref<string>(defaultUrl);
export const apiMode = ref<'auto' | 'local' | 'remote'>('auto');
export const connectionStatus = ref<'connected' | 'disconnected' | 'checking'>('disconnected');

// Helper to record requests
export const recordRequest = (method: string, url: string, payload?: any) => {
  const id = Math.random().toString(36).substring(2, 11);
  const log: ApiLog = {
    id,
    timestamp: new Date().toLocaleTimeString(),
    method,
    url,
    payload,
    status: 'pending'
  };
  apiLogs.value.unshift(log);
  if (apiLogs.value.length > 30) {
    apiLogs.value.pop();
  }
  return {
    success: (statusCode: number, response?: any) => {
      const found = apiLogs.value.find(l => l.id === id);
      if (found) {
        found.status = 'success';
        found.statusCode = statusCode;
        found.response = response;
      }
    },
    error: (statusCode?: number, errorResponse?: any) => {
      const found = apiLogs.value.find(l => l.id === id);
      if (found) {
        found.status = 'error';
        found.statusCode = statusCode;
        found.response = errorResponse;
      }
    }
  };
};

export const getAuthHeaders = (additional: Record<string, string> = {}): Record<string, string> => {
  const { token } = useAuth();
  const headers: Record<string, string> = { ...additional };
  if (token.value) {
    headers['Authorization'] = `Bearer ${token.value}`;
  }
  return headers;
};

// Monitored fetch that intercepts and logs HTTP traffic to the API console
export const monitoredFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const method = options.method || 'GET';
  let parsedPayload: any = undefined;
  if (options.body && typeof options.body === 'string') {
    try {
      parsedPayload = JSON.parse(options.body);
    } catch {
      parsedPayload = options.body;
    }
  }
  const recorder = recordRequest(method, url, parsedPayload);
  try {
    const res = await fetch(url, options);
    let responseData: any = null;
    try {
      const clone = res.clone();
      responseData = await clone.json();
    } catch {
      // Not JSON
    }
    if (res.ok) {
      recorder.success(res.status, responseData);
    } else {
      recorder.error(res.status, responseData || res.statusText);
    }
    return res;
  } catch (err: any) {
    recorder.error(0, err.message || err);
    throw err;
  }
};

export const isRemoteActive = (): boolean => {
  if (apiMode.value === 'local') return false;
  return true;
};

export const checkConnection = async (): Promise<boolean> => {
  if (apiMode.value === 'local') {
    connectionStatus.value = 'disconnected';
    return false;
  }

  connectionStatus.value = 'checking';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await monitoredFetch(`${backendUrl.value}/health`, {
      signal: controller.signal,
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      connectionStatus.value = 'connected';
      return true;
    }
  } catch (e) {
    // Ignored
  }

  connectionStatus.value = 'disconnected';
  return false;
};
