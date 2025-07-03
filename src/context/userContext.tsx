import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserData, Login } from '../api/types/login.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

interface UserContextType {
  userData: UserData | null;
  error: string | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<Login | null>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loginUser = async (email: string, password: string): Promise<Login | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api<Login>(`/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.success) {
        setUserData(response.data);
        setError(null);
        await AsyncStorage.setItem('authToken', response.data?.token ?? '');
        return response;
      } else {
        setError(response.message);
        return response;
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
    return null;
  };

  const loginWithSavedToken = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        const response = await api<Login>(`/login-with-token`, {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
        if (response.success) {
          setUserData(response.data);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUserData(null);
    await AsyncStorage.removeItem('authToken');
  };

  useEffect(() => {
    loginWithSavedToken();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loginUser, logout, error, loading }}>
      {children}
    </UserContext.Provider>
  );
}; 