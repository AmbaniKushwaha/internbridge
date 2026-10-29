/**
 * InternBridge API Client
 * Centralized fetch wrapper communicating with Express backend via /api
 */

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('internbridge_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('internbridge_auth_token', data.token);
      }
      return data;
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('internbridge_auth_token', data.token);
      }
      return data;
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    logout: () => {
      localStorage.removeItem('internbridge_auth_token');
    },
  },

  // Projects
  projects: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/projects${query ? `?${query}` : ''}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      return handleResponse(res);
    },
    create: async (projectData) => {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${API_BASE}/projects/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },
    getMyListed: async () => {
      const res = await fetch(`${API_BASE}/projects/my/listed`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Applications
  applications: {
    submit: async (appData) => {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(appData),
      });
      return handleResponse(res);
    },
    getMy: async () => {
      const res = await fetch(`${API_BASE}/applications/my`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getProjectApplicants: async (projectId) => {
      const res = await fetch(`${API_BASE}/applications/project/${projectId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${API_BASE}/applications/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },
  },

  // Teams & Squads
  teams: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/teams`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/teams/${id}`);
      return handleResponse(res);
    },
    create: async (teamData) => {
      const res = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(teamData),
      });
      return handleResponse(res);
    },
    getMySquads: async () => {
      const res = await fetch(`${API_BASE}/teams/my/squads`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    requestJoin: async (teamId) => {
      const res = await fetch(`${API_BASE}/teams/${teamId}/join-request`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    respondJoin: async (teamId, studentId, accept) => {
      const res = await fetch(`${API_BASE}/teams/${teamId}/respond-request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ studentId, accept }),
      });
      return handleResponse(res);
    },
  },

  // Students
  students: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/students${query ? `?${query}` : ''}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/students/${id}`);
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${API_BASE}/students/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
    addPortfolioItem: async (itemData) => {
      const res = await fetch(`${API_BASE}/students/portfolio`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData),
      });
      return handleResponse(res);
    },
    updatePortfolioItem: async (itemId, itemData) => {
      const res = await fetch(`${API_BASE}/students/portfolio/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData),
      });
      return handleResponse(res);
    },
    deletePortfolioItem: async (itemId) => {
      const res = await fetch(`${API_BASE}/students/portfolio/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Businesses
  businesses: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/businesses`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/businesses/${id}`);
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${API_BASE}/businesses/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
  },

  // Notifications
  notifications: {
    getMy: async () => {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    markRead: async (id) => {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    markAllRead: async () => {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
