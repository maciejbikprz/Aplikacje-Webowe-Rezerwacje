// services/api.js

const API_URL = import.meta.env.VITE_API_URL || '/api';

// --- 1. TO JEST FUNKCJA, KTÓREJ BRAKOWAŁO ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }
};

// --- API AUTENTYKACJI ---
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (firstName, lastName, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// --- API ŁODZI (WYMAGANE PRZEZ ADMIN PANEL) ---
export const boatsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/boats`);
    return await parseResponse(response);
  },

  create: async (boatData) => {
    const response = await fetch(`${API_URL}/boats`, {
      method: 'POST',
      headers: getAuthHeaders(), // Tutaj używamy brakującej funkcji
      body: JSON.stringify(boatData)
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || 'Failed to create boat');
    return data;
  },

  update: async (id, boatData) => {
    const response = await fetch(`${API_URL}/boats/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Tutaj też
      body: JSON.stringify(boatData)
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || 'Failed to update boat');
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/boats/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders() // I tutaj
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || 'Failed to delete boat');
    return data;
  }
};