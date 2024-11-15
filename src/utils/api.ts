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

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: 'Unknown error' };
    }
    throw new Error(errorData.detail || 'Request failed');
  }

  try {
    return await response.json();
  } catch {
    return response;
  }
};

const loginUser = async (username: string, password: string) => {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

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
    throw new Error(errorData.detail || 'Login request failed');
  }

  return await response.json();
};

export { apiFetch as default, loginUser };
