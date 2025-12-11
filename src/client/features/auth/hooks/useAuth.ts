// src\client\features\auth\hooks\useAuth.ts

import { useDispatch } from "react-redux";
import { setAuthenticated, setUnauthenticated, setOffline } from "@auth/store/sessionSlice";
import { clearUserProfile } from "@auth/store/userSlice";
import { useState } from "react";

/**
 * Custom hook for handling authentication operations
 * Manages login/logout functionality and authentication state
 * 
 * @returns {Object} Authentication methods and state
 * @property {(email: string, password: string) => Promise<boolean>} login - Handles user login
 * @property {() => Promise<boolean>} logout - Handles user logout
 * @property {string | null} error - Current error message, if any
 * @property {boolean} isLoading - Loading state indicator
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles user login
   * Sends credentials to the API and updates authentication state
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<boolean>} Success status of login attempt
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Update Redux store with authentication state
      dispatch(setAuthenticated());
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    }
  };

  /**
   * Handles user logout
   * Calls logout API and clears authentication state
   * 
   * @returns {Promise<boolean>} Success status of logout attempt
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }

      // Clear authentication and user data from Redux store
      dispatch(setUnauthenticated());
      dispatch(setOffline());
      dispatch(clearUserProfile());
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return false;
    }
  };

  return {
    login,
    logout,
    error,
    isLoading,
  };
};

export default useAuth;