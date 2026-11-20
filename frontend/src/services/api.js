// API Base URL
// Reads from Vite environment variable VITE_API_URL with fallback to local development server
const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return 'http://localhost:5000/api';
  }
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getBaseApiUrl();

// Visitor ID persistence key
const VISITOR_ID_KEY = 'recipehub_visitor_id';

/**
 * Retrieves the persistent anonymous visitor ID from localStorage,
 * or generates and saves a new unique ID if not already present.
 */
export function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    // Generate UUID-like unique identifier for this browser/device
    visitorId = 'visitor_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

/**
 * Base fetch wrapper with default JSON headers, X-Visitor-ID header,
 * and unified error parsing.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const visitorId = getVisitorId();

  const headers = {
    'Content-Type': 'application/json',
    'X-Visitor-ID': visitorId,
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    let data = null;

    // Try parsing JSON response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, message: text };
    }

    if (!response.ok) {
      const errorMessage = data?.message || `HTTP error! Status: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend is not reachable (network offline / server down)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const connError = new Error(`Cannot connect to RecipeHub server (${API_BASE_URL}). Please ensure the backend is running and accessible.`);
      connError.status = 0;
      throw connError;
    }
    throw error;
  }
}

export default apiRequest;
