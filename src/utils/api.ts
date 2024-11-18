export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: 'An unknown error occurred' };
      }
      throw {
        status: response.status,
        statusText: response.statusText,
        detail: errorData?.detail || response.statusText || 'Request failed',
        errors: errorData?.errors || null,
      };
    }

    try {
      return await response.json();
    } catch {
      return response;
    }
  } catch (error) {
    throw error; 
  }
};


const loginUser = async (username: string, password: string) => {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
  
    try {
      const response = await fetch(`${BASE_URL}/users/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: 'Unknown error' };
        }
  
        if (response.status === 401) {
          throw new Error(errorData.detail || 'Unauthorized: Incorrect username or password');
        } else {
          throw new Error(errorData.detail || `Error: ${response.status}`);
        }
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  

export { apiFetch as default, loginUser };
