import { Post } from '../../types';
import {
  backendUrl,
  getAuthHeaders,
  monitoredFetch,
  isRemoteActive
} from './base';

export const getPosts = async (fallback: Post[]): Promise<Post[]> => {
  if (!isRemoteActive()) return fallback;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/publications?per_page=100`, {
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.data || []);
      if (!rawList || rawList.length === 0) {
        return fallback;
      }
      return rawList.map((p: any) => {
        const title_en = p.title_en || p.title || '';
        const summary_en = p.summary_en || p.summary || '';
        const content_en = p.content_en || p.content || '';
        const category_en = p.category_en || p.category || '';
        const readTime = p.readTime || p.read_time || '';
        const readTime_en = p.readTime_en || p.read_time_en || readTime;

        return {
          ...p,
          id: String(p.id),
          title_en: title_en.trim() !== '' ? title_en : p.title,
          summary_en: summary_en.trim() !== '' ? summary_en : p.summary,
          content_en: content_en.trim() !== '' ? content_en : p.content,
          category_en: category_en.trim() !== '' ? category_en : p.category,
          readTime: readTime,
          readTime_en: readTime_en.trim() !== '' ? readTime_en : readTime,
          tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags) : [])
        };
      });
    }
  } catch (e) {
    console.warn('API error during getPosts', e);
  }
  return fallback;
};

export const createPost = async (post: Post): Promise<{ success: boolean; id?: string }> => {
  if (!isRemoteActive()) return { success: false };
  try {
    const payload = {
      title: post.title,
      title_en: post.title_en,
      summary: post.summary,
      summary_en: post.summary_en,
      content: post.content,
      content_en: post.content_en,
      category: post.category,
      category_en: post.category_en,
      read_time: post.readTime,
      read_time_en: post.readTime_en,
      tags: post.tags
    };

    const res = await monitoredFetch(`${backendUrl.value}/publication/create`, {
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
        const backendId = data?.id || data?.uuid || data?.data?.id || data?.data?.uuid || data?.publication?.id || data?.publication?.uuid || data?.post?.id || data?.post?.uuid;
        return { success: true, id: backendId ? String(backendId) : undefined };
      } catch {
        return { success: true };
      }
    }
    return { success: false };
  } catch (e) {
    console.error('API error creating post:', e);
    return { success: false };
  }
};

export const updatePost = async (post: Post): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const payload = {
      title: post.title,
      title_en: post.title_en,
      summary: post.summary,
      summary_en: post.summary_en,
      content: post.content,
      content_en: post.content_en,
      category: post.category,
      category_en: post.category_en,
      read_time: post.readTime,
      read_time_en: post.readTime_en,
      tags: post.tags
    };

    const res = await monitoredFetch(`${backendUrl.value}/publication/update/${post.id}`, {
      method: 'PUT',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (e) {
    console.error('API error updating post:', e);
    return false;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  if (!isRemoteActive()) return false;
  try {
    const res = await monitoredFetch(`${backendUrl.value}/publication/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders({ 'Accept': 'application/json' })
    });

    return res.ok;
  } catch (e) {
    console.error('API error deleting post:', e);
    return false;
  }
};
