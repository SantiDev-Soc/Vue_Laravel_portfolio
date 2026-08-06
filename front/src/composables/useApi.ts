import { 
  backendUrl, 
  apiMode, 
  connectionStatus, 
  apiLogs, 
  checkConnection, 
  isRemoteActive 
} from './api/base';

import { 
  getPosts, 
  createPost, 
  updatePost, 
  deletePost 
} from './api/publications';

import { 
  getMessages, 
  createMessage, 
  markMessageRead, 
  deleteMessage 
} from './api/messages';

import { 
  getCertifications, 
  createCertification, 
  updateCertification, 
  deleteCertification 
} from './api/certifications';

import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from './api/projects';

// Re-export type if anyone needs it directly from useApi
export type { ApiLog } from './api/base';

// Re-export state reactive variables
export { 
  backendUrl, 
  apiMode, 
  connectionStatus, 
  apiLogs 
};

export function useApi() {
  return {
    backendUrl,
    apiMode,
    connectionStatus,
    apiLogs,
    checkConnection,
    isRemoteActive,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getMessages,
    createMessage,
    markMessageRead,
    deleteMessage,
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    getProjects,
    createProject,
    updateProject,
    deleteProject
  };
}
