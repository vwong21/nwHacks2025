import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import axios from 'axios';
import './signup.css';

const Signup = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [type, setType] = useState('student');
	const [username, setUserName] = useState('');

	const onSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log(user);
			navigate('/login');

			// Save additional user data to the database
			const userData = {
				uid: user.uid,
				email,
				username,
				firstName,
				lastName,
				type,
				password,
			};
			const apiUrl = 'http://localhost:3000/newUser';

			const sendData = await axios.post(apiUrl, userData);

			console.log('User saved successfully:', sendData);
			navigate('/login');
		} catch (error: any) {
			console.error('Error creating user:', error.code, error.message);
		}
	};

	return (
		<main className='signup-container'>
			<section className='signup-section'>
				<div>
					<h1 className='signup-title'>NWhacks</h1>
					<form className='signup-form' onSubmit={onSubmit}>
						<div className='signup-form-group'>
							<label
								htmlFor='email-address'
								className='signup-label'>
								Email address
							</label>
							<input
								type='email'
								className='signup-input'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className='signup-form-group'>
							<label htmlFor='firstName' className='signup-label'>
								First Name
							</label>
							<input
								type='text'
								className='signup-input'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
							/>
						</div>

						<div className='signup-form-group'>
							<label htmlFor='lastName' className='signup-label'>
								Last Name
							</label>
							<input
								type='text'
								className='signup-input'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
							/>
						</div>

						<div className='signup-form-group'>
							<label htmlFor='username' className='signup-label'>
								User Name
							</label>
							<input
								type='text'
								className='signup-input'
								value={username}
								onChange={(e) => setUserName(e.target.value)}
								required
								placeholder='username'
							/>
						</div>

						<div className='signup-form-group'>
							<label htmlFor='type' className='signup-label'>
								User Type
							</label>
							<select
								className='signup-select'
								value={type}
								onChange={(e) => setType(e.target.value)}
								required>
								<option value='student'>Student</option>
								<option value='organizer'>Organizers</option>
							</select>
						</div>

						<div className='signup-form-group'>
							<label htmlFor='password' className='signup-label'>
								Password
							</label>
							<input
								type='password'
								className='signup-input'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<button type='submit' className='signup-button'>
							Sign up
						</button>
					</form>

					<p className='signup-footer'>
						Already have an account?{' '}
						<NavLink to='/login' className='signup-link'>
							Sign in
						</NavLink>
					</p>
				</div>
			</section>
		</main>
	);
};

export default Signup;
