// Configuración base de la API con fetch nativo

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Función helper para manejar las respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error del servidor' }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
}

// Función helper para obtener el token
function getToken(): string | null {
  return localStorage.getItem('token');
}

// Función helper para headers con autenticación
function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// Funciones base para los diferentes métodos HTTP
export const api = {
  get: async <T>(endpoint: string, includeAuth = true): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(includeAuth),
      credentials: 'include',
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data?: any, includeAuth = true): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data?: any, includeAuth = true): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, includeAuth = true): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(includeAuth),
      credentials: 'include',
    });
    return handleResponse<T>(response);
  },

  // Para upload de archivos
  upload: async <T>(endpoint: string, formData: FormData, includeAuth = true): Promise<T> => {
    const headers: HeadersInit = {};
    if (includeAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    return handleResponse<T>(response);
  }
};

// Función para guardar el token
export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

// Función para eliminar el token
export function removeToken(): void {
  localStorage.removeItem('token');
}
