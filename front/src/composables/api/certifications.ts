import { Certification } from '../../types';
import {
  backendUrl,
  getAuthHeaders,
  monitoredFetch,
  isRemoteActive
} from './base';

export const getCertifications = async (fallback: Certification[]): Promise<Certification[]> => {
  if (!isRemoteActive()) return fallback;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/certifications`, {
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });
    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.data || []);
      return rawList.map((c: any) => {
        const title_en = c.title_en || c.title || '';
        const description_en = c.description_en || c.description || '';
        return {
          ...c,
          id: String(c.id),
          title_en: title_en.trim() !== '' ? title_en : c.title,
          description_en: description_en.trim() !== '' ? description_en : c.description
        };
      });
    }
  } catch (e) {
    console.warn('API error during getCertifications', e);
  }
  return fallback;
};

export const createCertification = async (cert: Certification): Promise<{ success: boolean; id?: string }> => {
  if (!isRemoteActive()) return { success: false };
  try {
    const payload = {
      title: cert.title,
      title_en: cert.title_en,
      issuer: cert.issuer,
      date: cert.date,
      link: cert.link,
      description: cert.description,
      description_en: cert.description_en,
      status: cert.status
    };

    const res = await monitoredFetch(`${backendUrl.value}/certification/create`, {
      method: 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      try {
        const data = await res.json();
        const backendId = data?.id || data?.uuid || data?.data?.id || data?.data?.uuid || data?.certification?.id || data?.certification?.uuid;
        return { success: true, id: backendId ? String(backendId) : undefined };
      } catch {
        return { success: true };
      }
    }
    return { success: false };
  } catch (e) {
    console.error('API error creating certification:', e);
    return { success: false };
  }
};

export const updateCertification = async (cert: Certification): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const payload = {
      title: cert.title,
      title_en: cert.title_en,
      issuer: cert.issuer,
      date: cert.date,
      link: cert.link,
      description: cert.description,
      description_en: cert.description_en,
      status: cert.status
    };

    const res = await monitoredFetch(`${backendUrl.value}/certification/update/${cert.id}`, {
      method: 'PUT',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (e) {
    console.error('API error updating certification:', e);
    return false;
  }
};

export const deleteCertification = async (id: string): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/certification/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    return res.ok;
  } catch (e) {
    console.error('API error deleting certification:', e);
    return false;
  }
};
