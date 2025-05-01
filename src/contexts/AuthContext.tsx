import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data - In a real application, this would come from an API
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Operator User', email: 'operator@example.com', password: 'operator123', role: 'operator' }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful!');
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      toast.error('You must be logged in to change your password');
      throw new Error('Not authenticated');
    }
    
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1 && mockUsers[userIndex].password === currentPassword) {
      // In a real app, this would be an API call to update the password
      mockUsers[userIndex].password = newPassword;
      toast.success('Password updated successfully');
    } else {
      toast.error('Current password is incorrect');
      throw new Error('Current password is incorrect');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};