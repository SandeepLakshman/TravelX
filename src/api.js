// Final Integration Version: Pointing to Real Spring Boot Backend
const BASE_URL = 'http://localhost:8081';

/**
 * Custom fetch wrapper to communicate with the Spring Boot backend.
 * Uses standard fetch to ensure maximum compatibility.
 */
async function fetchWrapper(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      const error = new Error(data.error || data.message || 'API Error');
      error.response = { data: data.error || data.message || 'Unknown error', status: response.status };
      throw error;
    }

    return { data };
  } catch (error) {
    console.error(`Link to Backend [${endpoint}] failed:`, error);
    throw error;
  }
}

const api = {
  get: (endpoint, options = {}) => fetchWrapper(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => fetchWrapper(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => fetchWrapper(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => fetchWrapper(endpoint, { ...options, method: 'DELETE' }),
};

export const authApi = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
};

export const flightApi = {
  getAll: () => api.get('/flights'),
  search: (from, to, date, passengers) => api.get(`/flights?from=${from}&to=${to}&date=${date}&passengers=${passengers}`),
  getByRoute: (from, to) => api.get(`/flights/route?from=${from}&to=${to}`),
};

export const tourApi = {
  getAll: () => api.get('/tours'),
  getById: (id) => api.get(`/tours/${id}`),
};

export const bookingApi = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings'),
};

export default api;
