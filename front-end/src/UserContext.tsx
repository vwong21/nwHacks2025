import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  id: string | null;
  setId: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string | null>(localStorage.getItem('id') || null);

  // Persist uid in localStorage when it's updated
  const updateId = (newId: string) => {
    setId(newId);
    localStorage.setItem('id', newId); 
  };

  return (
    <UserContext.Provider value={{ id, setId: updateId }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export {
	UserProvider,
	useUserContext
}