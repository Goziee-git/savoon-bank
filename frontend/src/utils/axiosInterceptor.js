import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Function to check if token is expired or about to expire
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token expires in the next 5 minutes (300 seconds)
    return payload.exp < (currentTime + 300);
  } catch (error) {
    return true;
  }
};

// Function to refresh token
const refreshToken = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token available');
  }

  try {
    const response = await axios.post('/api/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const { token: newToken, user } = response.data;
    
    // Update localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update axios default headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    return newToken;
  } catch (error) {
    // If refresh fails, clear everything and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirect to login page
    window.location.href = '/login';
    
    throw error;
  }
};

// Request interceptor to check token before each request
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check if token is expired or about to expire
      if (isTokenExpired(token) && !isRefreshing) {
        isRefreshing = true;
        
        try {
          const newToken = await refreshToken();
          config.headers['Authorization'] = `Bearer ${newToken}`;
          isRefreshing = false;
          processQueue(null, newToken);
        } catch (error) {
          isRefreshing = false;
          processQueue(error, null);
          return Promise.reject(error);
        }
      } else if (isRefreshing) {
        // If refresh is in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers['Authorization'] = `Bearer ${token}`;
          return config;
        }).catch(err => {
          return Promise.reject(err);
        });
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
