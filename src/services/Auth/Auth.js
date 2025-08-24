
import React, { useEffect, useState } from 'react';
import { Navigate, } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routesConfig';
import { ClearUserData, GetUserDetails } from '../Storage/LocalStorage';

export function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state

  useEffect(() => {
    // Simulate an async auth check, such as calling an API
    const checkAuth = async () => {
      // Example: Replace this with your actual async authentication logic
      const authResult = await new Promise((resolve) => {
        let userDetails = GetUserDetails();
        if (userDetails == null) {
          resolve(false)
        }
        let expirationTime = userDetails?.expirationTimeIST;
        const expiryDT = new Date(expirationTime);

        // Get the current time in UTC
        const now = new Date();
        if (now > expiryDT) {
          resolve(false)
        }
        else {
          resolve(true)
        }
      });

      setIsAuthenticated(authResult);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // You could render a loading spinner here while the auth check is in progress
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to={ROUTE_PATHS.LOGIN} />;
}

export const GetHashedLoginPath = () => {
  return "#" + ROUTE_PATHS.LOGIN;
}

export const USER_DETAILS = "USER_DETAILS"
export const USER_ID = "USER_ID"
export const USER_PASSWORD = "USER_PASSWORD"

export const LogoutClicked = () => {
  ClearUserData()
  window.location.href = GetHashedLoginPath();

}

