import React, { useState } from 'react';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';
import './login.css';

const Login = () => {
	const navigate = useNavigate();
	const { setId } = useUserContext();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log(user.uid);

			const response = await axios.post('http://localhost:3000/user', {
				uid: user.uid,
			});
			navigate('/');
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main className='login-container'>
			<section className='login-section'>
				<div>
					<p className='login-title'>NWHacks</p>

					<form className='login-form' onSubmit={onLogin}>
						<div className='login-form-group'>
							<label
								htmlFor='email-address'
								className='login-label'>
								Email address
							</label>
							<input
								id='email-address'
								name='email'
								type='email'
								className='login-input'
								required
								placeholder='Email address'
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className='login-form-group'>
							<label htmlFor='password' className='login-label'>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								className='login-input'
								required
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<div>
							<button type='submit' className='login-button'>
								Login
							</button>
						</div>
					</form>

					<p className='login-footer'>
						No account yet?{' '}
						<NavLink to='/signup' className='login-link'>
							Sign up
						</NavLink>
					</p>
				</div>
			</section>
		</main>
	);
};

export default Login;
