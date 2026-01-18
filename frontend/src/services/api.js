// Konfiguracja adresu API
const API_URL = import.meta.env.VITE_API_URL || '/api';

if (import.meta.env.DEV) {
  console.log('API_URL:', API_URL);
}

// Helper do obsługi odpowiedzi i błędów
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

// Obiekt API Autentykacji
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
      if (error.message.includes('Server error')) throw error;
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
      if (error.message.includes('Server error')) throw error;
      throw new Error(error.message || 'Network error. Please check if the server is running.');
    }
  }
};