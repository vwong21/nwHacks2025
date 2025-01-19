import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserDetails {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	type: 'student' | 'organizer';
}

interface UserContextType {
	details: UserDetails | null;
	setDetails: (details: UserDetails) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [details, setDetails] = useState<UserDetails | null>(
		localStorage.getItem('details')
			? JSON.parse(localStorage.getItem('details')!)
			: null
	);

	// Persist details in localStorage when it's updated
	const updateDetails = (newDetails: UserDetails) => {
		setDetails(newDetails);
		localStorage.setItem('details', JSON.stringify(newDetails));
	};

	return (
		<UserContext.Provider value={{ details, setDetails: updateDetails }}>
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

export { UserProvider, useUserContext };
