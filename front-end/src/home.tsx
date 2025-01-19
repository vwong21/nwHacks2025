import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Calendar from './components/Calendar';
import './globals.css';
import { useUserContext } from './UserContext';
import calenderIcon from './assets/calenderIcon.png'

const Home = () => {
	// userId persists here. Can use later for axios request
	const { id } = useUserContext();
	useEffect(() => {
		console.log(id);
	});
	const navigate = useNavigate();

	// Role state: either "student" or "organizer"
	const [role, setRole] = useState<'student' | 'organizer'>('student');

	// Logout handler
	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				navigate('/');
				console.log('Signed out successfully');
			})
			.catch((error: unknown) => {
				if (error instanceof Error) {
					console.error('Logout error:', error.message);
				} else {
					console.error('An unknown error occurred during logout.');
				}
			});
	};

	return (
		<>
			<nav
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					padding: '0px 20px',
					backgroundColor: '#f8f9fa',
				}}>
				<div style = {{display:'flex', justifyContent:'center', alignItems:'center', fontWeight:"bold", fontSize:"30px"}}>
					<img src={calenderIcon} 
					alt="Calendar Icon" 
					style={{ width: '100px', height: '100px' }}
				/>
				<p>Welcome Home</p>
				</div>
				<div>
					<button
						style={{
							padding: '10px 15px',
							backgroundColor: '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginTop: '30px'
						}}
						onClick={handleLogout}>
						Logout
					</button>
				</div>
			</nav>

			{/* Role Switcher */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: '1rem',
				}}>
				<button
					style={{
						padding: '10px 20px',
						margin: '0 10px',
						backgroundColor:
							role === 'student' ? '#007bff' : '#000',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
					onClick={() => setRole('student')}>
					Student
				</button>
				<button
					style={{
						padding: '10px 20px',
						margin: '0 10px',
						backgroundColor:
							role === 'organizer' ? '#007bff' : '#000',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
					onClick={() => setRole('organizer')}>
					Organizer
				</button>
			</div>

			{/* Calendar Component with Role */}
			<div style={{ padding: '20px', marginTop: '2rem' }}>
				<Calendar role={role} />
			</div>
		</>
	);
};

export default Home;
