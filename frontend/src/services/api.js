const API_URL = import.meta.env.VITE_API_URL || '/api';

if (import.meta.env.DEV) {
  console.log('API_URL:', API_URL);
}

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
    const data = await response.json();
    return data;
  } else {
    const text = await response.text();
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
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
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  }
};

// Boats API
export const boatsAPI = {
  getAll: async (status = 'all') => {
    try {
      const url = status !== 'all' ? `${API_URL}/boats?status=${status}` : `${API_URL}/boats`;
      const response = await fetch(url);
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch boats');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/boats/${id}`);
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch boat');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  create: async (boatData) => {
    try {
      const response = await fetch(`${API_URL}/boats`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(boatData)
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create boat');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  update: async (id, boatData) => {
    try {
      const response = await fetch(`${API_URL}/boats/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(boatData)
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update boat');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/boats/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete boat');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  }
};

// Reservations API
export const reservationsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        headers: getAuthHeaders()
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch reservations');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  getByUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/reservations/user/${userId}`, {
        headers: getAuthHeaders()
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch reservations');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  create: async (reservationData) => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reservationData)
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create reservation');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update reservation');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await parseResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to cancel reservation');
      }
      return data;
    } catch (error) {
      if (error.message.includes('Server error')) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  }
};

