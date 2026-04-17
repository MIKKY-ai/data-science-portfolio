// Fake Store API Client
// Axios instance configured for the Fake Store REST API
// Demonstrates RESTful web service consumption with interceptors

import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

// Create axios instance with base configuration
export const fakeStoreApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - logs outgoing requests (useful for debugging)
fakeStoreApi.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles common error scenarios
fakeStoreApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('[API] Unauthorized - session may have expired');
    } else if (!error.response) {
      console.log('[API] Network error - device may be offline');
    }
    return Promise.reject(error);
  }
);
