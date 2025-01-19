import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { User, signOut } from 'firebase/auth'; // Import Firebase's User type and signOut function
import Home from './home';
import Signup from './signup';
import Login from './login';
import './App.css';
function App() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true); // Track loading state

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false); // Set loading to false once Firebase finishes checking auth status
			console.log(user);
		});

		return () => unsubscribe(); // Cleanup the listener on unmount
	}, []);



	if (loading) {
		// Show loading state while checking auth status
		return <div>Loading...</div>;
	}

	return (
		<Router>
			<div>
				<section>
					<Routes>
						{user ? (
							<Route
								path='/'
								element={
									<>
										<Home />
									</>
								}
							/>
						) : (
							<Route path='/' element={<Login />} />
						)}
						<Route path='/signup' element={<Signup />} />
						<Route path='/login' element={<Login />} />
					</Routes>
				</section>
			</div>
		</Router>
	);
}

export default App;
