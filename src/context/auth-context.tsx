import React, { createContext, useContext, useState } from 'react';

export interface UserAccess {
  id: string;
  is_super_admin: boolean;
  allowedServices: string[]; // e.g. ['users', 'customers']
}

const AuthContext = createContext<{ user: UserAccess | null, setUser: (u: UserAccess | null) => void }>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserAccess | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);