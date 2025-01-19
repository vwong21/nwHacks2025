import React, { useState } from 'react';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const details: { token?: string; id?: string } = {};
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			const accessToken = await user.getIdToken();
			details['token'] = accessToken;
			details['id'] = user.uid;
			console.log(details);

			const response = await axios.post('http://localhost:3000/user', {
				details,
			});
			navigate('/');
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<main>
				<section>
					<div>
						<p> FocusApp </p>

						<form onSubmit={onLogin}>
							<div>
								<label htmlFor='email-address'>
									Email address
								</label>
								<input
									id='email-address'
									name='email'
									type='email'
									required
									placeholder='Email address'
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div>
								<label htmlFor='password'>Password</label>
								<input
									id='password'
									name='password'
									type='password'
									required
									placeholder='Password'
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>

							<div>
								<button type='submit'>Login</button>
							</div>
						</form>

						<p className='text-sm text-white text-center'>
							No account yet?{' '}
							<NavLink to='/signup'>Sign up</NavLink>
						</p>
					</div>
				</section>
			</main>
		</>
	);
};

export default Login;
