import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
  updateUserProfile: async () => false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Add an ID if it doesn't exist (for demo purposes)
          if (!parsedUser.id) {
            parsedUser.id = `user_${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call Firebase Auth
      // For now, we'll simulate a successful login
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user_${Math.random().toString(36).substring(2, 15)}`,
        email,
        fullName: email.split('@')[0],
        createdAt: new Date(),
        lastActiveAt: new Date(),
        isPremium: false,
        tags: ['new'],
        actions: []
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call Firebase Auth
      // For now, we'll simulate a successful signup
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: `user_${Math.random().toString(36).substring(2, 15)}`,
        email,
        fullName,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        isPremium: false,
        tags: ['new'],
        actions: []
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...userData, lastActiveAt: new Date() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
