export interface Post {
  id: string;
  title: string;
  title_en?: string;
  summary: string;
  summary_en?: string;
  content: string;
  content_en?: string;
  category: string;
  category_en?: string;
  readTime: string;
  readTime_en?: string;
  date: string;
  tags: string[];
  github_url?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Certification {
  id: string;
  title: string;
  title_en?: string;
  issuer: string;
  date: string;
  link?: string;
  description?: string;
  description_en?: string;
  status: 'completed' | 'in_progress';
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  status: string;
  status_en?: string;
  technologies: string[];
  link_label?: string;
  link_label_en?: string;
  link_url?: string;
  github_url?: string;
  category?: 'Globe' | 'Layers' | 'Terminal' | 'Code';
}

