import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Form validation
import { Formik } from 'formik';
import * as Yup from 'yup';

// Country and region selector
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

const RegisterForm = () => (
	<Formik
		initialValues={{
			username: '',
			email: '',
			industry: '',
			occupation: '',
			country: '',
			region: '',
			password: '',
			password2: ''
		}}
		onSubmit={(values, { setSubmitting }) => {
			setSubmitting(false);
		}}
		validationSchema={Yup.object().shape({
			username: Yup.string()
				.required('Username is required')
				.min(3, 'Username must be 3 characters or longer')
				.max(15, 'Username must be 15 characters or less'),
			email: Yup.string().required('Email is required').email('Email is not valid'),
			password: Yup.string()
				.required('Password is required')
				.min(8, 'Password must be 8 characters or longer')
				.matches(
					/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
					'Use at least: one number and one special character'
				),
			password2: Yup.string()
				.required('Matching password is required')
				.test('passwords-match', 'Passwords must match', function(value) {
					return this.parent.password === value;
				})
		})}
	>
		{(props) => {
			let [ country, setCountry ] = useState();
			let [ region, setRegion ] = useState();

			const { values, touched, errors, isSubmitting, handleChange, handleBlur } = props;

			function selectCountry(val) {
				setCountry(val);
				values.country = country;
			}

			function selectRegion(val) {
				setRegion(val);
				values.region = region;
			}

			return (
				<div className="container" style={{ width: '100%' }}>
					<div className="topnav">
						<div className="applitrace_logo" style={{ marginBottom: '20px' }}>
							<a href="/">AppliTrace</a>
						</div>
						<div className="links_holder">
							<a href="/">Home</a>
							<a href="/users/login">Login</a>
							<div className="register_link">
								<a href="/users/register">REGISTER</a>
							</div>
						</div>
					</div>
					<div className="form_box">
						<form
							action={
								'/users/register/' +
								Intl.DateTimeFormat().resolvedOptions().timeZone +
								'?email={values.username}'
							}
							method="POST"
						>
							<h1>Begin Your Journey</h1>
							<div className="username">
								<label htmlFor="username">Username</label>
								<br />
								<input
									type="text"
									id="username"
									name="username"
									placeholder="Enter a username"
									value={values.username}
									onChange={handleChange}
									onBlur={handleBlur}
									autoComplete="new-password"
									className={errors.username && touched.username && 'error'}
									required
								/>
								{errors.username &&
								touched.username && <div className="input_feedback">{errors.username}</div>}
							</div>
							<br />
							<div className="email">
								<label htmlFor="email">Email</label>
								<br />
								<input
									type="text"
									id="email"
									name="email"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									className={errors.email && touched.email && 'error'}
									placeholder="Enter an Email"
									required
								/>
								{errors.email && touched.email && <div className="input_feedback">{errors.email}</div>}
							</div>
							<br />
							<div className="password">
								<label htmlFor="password">Password</label>
								<br />
								<input
									type="password"
									id="password"
									name="password"
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									autoComplete="new-password"
									className={errors.password && touched.password && 'error'}
									placeholder="Enter a password"
									required
								/>
								{errors.password &&
								touched.password && <div className="input_feedback">{errors.password}</div>}
							</div>
							<br />
							<div className="password">
								<label htmlFor="password">Re-enter Password</label>
								<br />
								<input
									type="password"
									id="password2"
									name="password2"
									value={values.password2}
									onChange={handleChange}
									onBlur={handleBlur}
									autoComplete="new-password"
									className={errors.password2 && touched.password2 && 'error'}
									placeholder="Confirm password"
									required
								/>
								{errors.password2 &&
								touched.password2 && <div className="input_feedback">{errors.password2}</div>}
							</div>
							<br />
							<div className="Industry" style={{ width: '250px', float: 'left' }}>
								<label htmlFor="industry">Industry (Optional)</label>
								<br />
								<input
									type="text"
									id="industry"
									name="industry"
									value={values.industry}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Enter your desired industry"
								/>
							</div>

							<div className="Occupation" style={{ width: '250px', float: 'left', marginLeft: '50px' }}>
								<label htmlFor="occupation">Occupation (Optional)</label>
								<br />
								<input
									type="text"
									id="occupation"
									name="occupation"
									value={values.occupation}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Enter your current occupation, if any"
								/>
							</div>
							<br />
							<br />
							<br />
							<br />
							<br />

							<div className="Country" style={{ width: '250px', float: 'left' }}>
								<label htmlFor="country">Country (Optional)</label>
								<br />
								<CountryDropdown
									name="country"
									id="country"
									value={values.country}
									onBlur={handleBlur}
									onChange={(val) => {
										selectCountry(val), (values.country = val);
									}}
								/>
							</div>

							<div className="Region" style={{ width: '250px', float: 'left', marginLeft: '50px' }}>
								<label htmlFor="region">Region (Optional)</label>
								<br />
								<RegionDropdown
									name="region"
									id="region"
									value={values.region}
									onBlur={handleBlur}
									country={values.country}
									disableWhenEmpty="true"
									onChange={(val) => {
										selectRegion(val), (values.region = val);
									}}
								/>
							</div>

							<div style={{ width: '100%', display: 'inline-block' }}>
								<button
									type="submit"
									className="formButton"
									disabled={
										errors.username ||
										errors.email ||
										errors.password ||
										errors.password2 ||
										isSubmitting
									}
								>
									CREATE ACCOUNT
								</button>
								<p>
									Already have an account? <a href="login">Login here.</a>
								</p>
							</div>
						</form>
					</div>
				</div>
			);
		}}
	</Formik>
);

RegisterForm.propTypes = {
	values: PropTypes.object,
	touched: PropTypes.object,
	errors: PropTypes.object,
	isSubmitting: PropTypes.bool,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};

export default RegisterForm;
