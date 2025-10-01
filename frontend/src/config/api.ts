// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  TODOS: `${API_BASE_URL}/api/todos`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Debug function to check API configuration
export const debugAPI = () => {
  console.log('API Configuration:');
  console.log('- API_BASE_URL:', API_BASE_URL);
  console.log('- TODOS_ENDPOINT:', API_ENDPOINTS.TODOS);
  console.log('- Environment:', process.env.NODE_ENV);
};

export default API_BASE_URL;
