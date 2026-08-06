import { Message } from '../../types';
import {
  backendUrl,
  getAuthHeaders,
  monitoredFetch,
  isRemoteActive
} from './base';

export const getMessages = async (fallback: Message[]): Promise<Message[]> => {
  if (!isRemoteActive()) return fallback;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/contacts`, {
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.data || []);
      return rawList.map((m: any) => {
        // Formatear fecha de created_at si viene de Laravel (ej: 2026-07-26T10:15:30.000000Z -> 2026-07-26)
        let formattedDate = m.date || m.created_at || new Date().toISOString().split('T')[0];
        if (formattedDate && typeof formattedDate === 'string' && formattedDate.includes('T')) {
          formattedDate = formattedDate.split('T')[0];
        }

        return {
          id: String(m.id || ''),
          name: m.name || m.nombre || 'Anónimo',
          email: m.email || '',
          subject: m.subject || m.asunto || 'Sin asunto',
          message: m.message || m.mensaje || m.body || '',
          date: formattedDate,
          read: Boolean(m.read === 1 || m.read === true || m.read === '1' || m.is_read || m.read_at !== null && m.read_at !== undefined)
        };
      });
    }
  } catch (err) {
    console.warn('API error during getMessages/Contacts', err);
  }
  return fallback;
};

export const createMessage = async (msg: Message): Promise<{ success: boolean; id?: string }> => {
  if (!isRemoteActive()) return { success: false };
  try {
    const payload = {
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message
    };

    const res = await monitoredFetch(`${backendUrl.value}/contacts/create`, {
      method: 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: true,
        id: data.id ? String(data.id) : (data.data && data.data.id ? String(data.data.id) : undefined)
      };
    }
  } catch (e) {
    console.error('API error creating contact:', e);
  }
  return { success: false };
};

export const markMessageRead = async (id: string): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/contacts/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify({ read: true })
    });

    return res.ok;
  } catch (e) {
    console.error('API error updating contact status:', e);
    return false;
  }
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/contacts/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    return res.ok;
  } catch (e) {
    console.error('API error deleting contact:', e);
    return false;
  }
};

