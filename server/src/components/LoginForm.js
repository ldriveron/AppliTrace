import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = (props) => {
	return (
		<div className="container" style={{ width: '100%' }}>
			<div className="topnav">
				<div className="applitrace_logo" style={{ marginBottom: '20px' }}>
					<a href="/">AppliTrace</a>
				</div>
				<div className="links_holder">
					<a href="/">Home</a>
					<a href="/users/login" className="link_active">
						Login
					</a>
					<div className="register_link">
						<a href="/users/register">REGISTER</a>
					</div>
				</div>
			</div>
			<div className="form_box">
				<form action="/users/login" method="POST">
					<h1>Welcome</h1>
					<div className="email">
						<label htmlFor="email">Email</label>
						<br />
						<input
							type="text"
							id="email"
							name="email"
							placeholder="Enter your Email"
							defaultValue={props.email}
							required
						/>
					</div>
					<br />
					<div className="password">
						<label htmlFor="password">Password</label>
						<br />
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Enter your password"
							required
						/>
					</div>

					<button type="submit" className="formButton">
						LOGIN
					</button>
					<p>
						Don&apos;t have an account? <a href="register">Create one here.</a>
					</p>
				</form>
			</div>
		</div>
	);
};

LoginForm.propTypes = {
	email: PropTypes.array
};

export default LoginForm;
