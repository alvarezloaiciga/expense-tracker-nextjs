'use client';

import { useAuth0 } from '@auth0/auth0-react';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const login = () => loginWithRedirect();
  
  const logoutWithRedirect = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout: logoutWithRedirect,
    getAccessToken: getAccessTokenSilently,
  };
} 