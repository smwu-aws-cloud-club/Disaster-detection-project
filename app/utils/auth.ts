export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const reissueToken = async () => {
  try {
    const response = await fetch('/api/auth/reissue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: getRefreshToken(),
      }),
    });

    if (!response.ok) {
      throw new Error('Token reissue failed');
    }

    const { accessToken, refreshToken } = await response.json();
    setTokens(accessToken, refreshToken);
    return true;
  } catch (error) {
    console.error('Error reissuing token:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    clearTokens();
    // Clear FCM permission status
    localStorage.removeItem('fcm_permission_status');
  }
}; 