// utils/api.js
const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

export const verifyMFA = async (email, code) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-mfa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'MFA verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('MFA verification error:', error);
    throw error;
  }
};

export const getAccountBalance = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/account/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch account balance');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching account balance:', error);
    throw error;
  }
};

export const getTransactions = async (limit = null) => {
  try {
    const token = localStorage.getItem('token');
    let url = `${API_URL}/account/transactions`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const transferFunds = async (transferData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/account/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transferData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transfer failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Transfer error:', error);
    throw error;
  }
};

export const getLoginHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/security/login-history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch login history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw error;
  }
};

export const refreshSession = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Session refresh failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Session refresh error:', error);
    throw error;
  }
};
