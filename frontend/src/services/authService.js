import API from './api';

export const authService = {
  login: async (temple_id, email, password) => {
    const response = await API.post('/auth/login', { temple_id, email, password });
    if (response.data.access_token) {
      localStorage.setItem('darshanai_token', response.data.access_token);
      localStorage.setItem('darshanai_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('darshanai_token');
    localStorage.removeItem('darshanai_user');
  }
};
