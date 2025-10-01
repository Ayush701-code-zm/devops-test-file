// Environment Configuration
export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
};

// API Endpoints
export const API_ENDPOINTS = {
  TODOS: `${config.API_URL}/api/todos`,
  HEALTH: `${config.API_URL}/api/health`,
};

export default config;
