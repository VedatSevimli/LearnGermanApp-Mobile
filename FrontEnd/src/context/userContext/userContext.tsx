import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Login, UserData } from '../../modules/login/login.type';
import { doLogin, loginWithToken } from '../../API/Login/login';

// Define the shape of the context state
interface UserContextType {
    userData: UserData | null;
    error: string | null; // To store any login error messages
    loading: boolean; // To indicate login state
    loginUser: (email: string, password: string) => Promise<Login | null>;
    logout: () => void;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to access the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to handle login
    const loginUser = async (
        email: string,
        password: string
    ): Promise<Login | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await doLogin({ email, password });

            if (response.success) {
                setUserData(response.data);
                setError(null);

                sessionStorage.setItem('authToken', response.data?.token ?? '');
                return response;
            } else {
                setError(response.message);
                return response;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }

        return null;
    };

    const loginWithSavedToken = async () => {
        setLoading(true);

        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const response = await loginWithToken({ token });
                if (response.success) {
                    setUserData(response.data);
                } else {
                    logout();
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Token validation error:', error);
                logout();
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = () => {
        setUserData(null);
        localStorage.removeItem('token');
    };

    React.useEffect(() => {
        void loginWithSavedToken();
    }, []);

    return (
        <UserContext.Provider
            value={{
                userData,
                loginUser,
                logout,
                error,
                loading
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
