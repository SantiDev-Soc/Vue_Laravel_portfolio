import { Project } from '../../types';
import {
  backendUrl,
  getAuthHeaders,
  monitoredFetch,
  isRemoteActive
} from './base';

export const getProjects = async (fallback: Project[]): Promise<Project[]> => {
  if (!isRemoteActive()) return fallback;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/projects?per_page=100`, {
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.data || []);
      if (!rawList || rawList.length === 0) {
        return fallback;
      }
      return rawList.map((p: any) => {
        return {
          ...p,
          id: String(p.id),
          technologies: Array.isArray(p.technologies)
              ? p.technologies
              : (typeof p.technologies === 'string' ? JSON.parse(p.technologies) : [])
        };
      });
    }
  } catch (e) {
    console.warn('API error during getProjects', e);
  }
  return fallback;
};

export const createProject = async (project: Project): Promise<{ success: boolean; id?: string }> => {
  if (!isRemoteActive()) return { success: false };
  try {
    const res = await monitoredFetch(`${backendUrl.value}/projects/create`, {
      method: 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify({
        title: project.title,
        title_en: project.title_en,
        description: project.description,
        description_en: project.description_en,
        status: project.status,
        status_en: project.status_en,
        technologies: project.technologies,
        link_label: project.link_label,
        link_label_en: project.link_label_en,
        link_url: project.link_url,
        category: project.category
      })
    });

    if (res.ok) {
      try {
        const data = await res.json();
        const backendId = data?.id || data?.uuid || data?.data?.id || data?.data?.uuid || data?.project?.id || data?.project?.uuid;
        return { success: true, id: backendId ? String(backendId) : undefined };
      } catch {
        return { success: true };
      }
    }
    return { success: false };
  } catch (e) {
    console.error('API error creating project:', e);
    return { success: false };
  }
};

export const updateProject = async (project: Project): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const payload = {
      title: project.title,
      title_en: project.title_en,
      description: project.description,
      description_en: project.description_en,
      status: project.status,
      status_en: project.status_en,
      technologies: project.technologies,
      link_label: project.link_label,
      link_label_en: project.link_label_en,
      link_url: project.link_url,
      category: project.category
    };

    const res = await monitoredFetch(`${backendUrl.value}/projects/update/${project.id}`, {
      method: 'PUT',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (e) {
    console.error('API error updating project:', e);
    return false;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/projects/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    return res.ok;
  } catch (e) {
    console.error('API error deleting project:', e);
    return false;
  }
};
