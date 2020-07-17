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
			industry: 'Information Technology and Services',
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
			occupation: Yup.string()
				.min(3, 'Occupation must be 3 characters or longer')
				.max(15, 'Occupation must be 150 characters or less'),
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

			// Array with industry names
			let industry_names = [
				'Information Technology and Services',
				'Hospital & Health Care',
				'Construction',
				'Education Management',
				'Retail',
				'Financial Services',
				'Accounting',
				'Computer Software',
				'Automotive',
				'Higher Education',
				'Marketing & Advertising',
				'Government Administration',
				'Banking',
				'Health, Welness & Fitness',
				'Real Estate',
				'Telecommunications',
				'Oil & Energy',
				'Food & Beverages',
				'Hospitality',
				'Mechanical or Industrial Engineering',
				'Electrical & Electronic Manufacturing',
				'Primary / Secondary Education',
				'Insurance',
				'Internet',
				'Human Resources',
				'Medical Practice',
				'Transportation / Trucking / Railroad',
				'Consumer Services',
				'Management Consulting',
				'Pharmaceuticals',
				'Civil Engineering',
				'Design',
				'Research',
				'Restaurants',
				'Logistics & Supply Chain',
				'Architecture & Planning',
				'Law Practice',
				'Apparel & Fashion',
				'Consumer Goods',
				'Facilities Services',
				'Food Production',
				'Non - profit Organization Management',
				'Entertainment',
				'Machinery',
				'Chemicals',
				'Arts & Crafts',
				'Wholesale',
				'Utilities',
				'Legal Services',
				'Farming',
				'Mining & Metals',
				'Airlines / Aviation',
				'Leisure, Travel & Turism',
				'Building Materials',
				'Music',
				'Enviromental Services',
				'Professional Training & Coaching',
				'Medical Device',
				'Individual & Family Services',
				'Cosmetics',
				'Mental Health Care',
				'Aviation and Aerospace',
				'Staffing & Recruiting',
				'Industrial Automation',
				'Graphic Design',
				'Security & Investigations',
				'Import and Export',
				'Public Relations and Communications',
				'Textiles',
				'Military',
				'Broadcast Media',
				'Biotechnology',
				'Media Production',
				'Business Supplies & Equipment',
				'Computer Networking',
				'Writing & Editing',
				'Consumer Elecronics',
				'International Trade and Development',
				'Events Services',
				'Photography',
				'Renewables & Envirnoment',
				'Computer Hardware',
				'Civic and Social Organization',
				'Furniture',
				'Defense & Space',
				'Computer & Network Security',
				'Printing',
				'Fine Art',
				'Religious Institutions',
				'Investmend Management',
				'Law Enforcement',
				'Publishing',
				'Information Services',
				'Maritime',
				'Outsourcing / Offshoring',
				'Warehousing',
				'E - learning',
				'Executive Office',
				'Government Relations',
				'Animation',
				'Semiconducs',
				'Supermarkets',
				'Program Development',
				'Public Safety',
				'Plastics',
				'Alternative Medicine',
				'Performing Arts',
				'Online Media',
				'Motion Pictures & Film',
				'Commercial Real Estate',
				'Judiciary',
				'Packaging and Containers',
				'Luxury Goods & Jewelry',
				'Veterinary',
				'Computer Games',
				'Investment Banking',
				'Market Research',
				'International Affairs',
				'Wine & Spirits',
				'Newspapers',
				'Translation & Localisation',
				'Recreational Facilities & Services',
				'Sporting Goods',
				'Paper & Forest Products',
				'Capital Markets',
				'Public Policy',
				'Package / Freight Delivery',
				'Libraries',
				'Wireless',
				'Gambling & Casinos',
				'Venture Capital & Private Equity',
				'Glass, Ceramics & Concrete',
				'Philanthropy',
				'Ranching',
				'Dairy',
				'Museums and Institutions',
				'Shipbuilding',
				'Think Thanks',
				'Political Organization',
				'Fishery',
				'Fund - Raising',
				'Tobacco',
				'Railroad Manufacture',
				'Alternative Dispute Resolution',
				'Nanotechnology',
				'Legislative Office'
			];

			// Populate industry_list array with options for the industry select dropdowwn
			let industry_list = [];
			for (let i = 0; i < industry_names.length; i++) {
				industry_list.push(
					<option key={industry_names[i]} value={industry_names[i]}>
						{industry_names[i]}
					</option>
				);
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
							<div className="Industry" style={{ width: '315px', float: 'left' }}>
								<label htmlFor="industry">Industry</label>
								<br />
								<select
									name="industry"
									id="industry"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.industry}
								>
									{industry_list}
								</select>
								{errors.industry &&
								touched.industry && <div className="input_feedback">{errors.industry}</div>}
							</div>

							<div className="Occupation" style={{ width: '315px', float: 'left', marginLeft: '50px' }}>
								<label htmlFor="occupation">Occupation (Optional)</label>
								<br />
								<input
									type="text"
									id="occupation"
									name="occupation"
									value={values.occupation}
									onChange={handleChange}
									className={errors.occupation && touched.occupation && 'error'}
									onBlur={handleBlur}
									placeholder="Enter your current occupation, if any"
								/>
								{errors.occupation &&
								touched.occupation && <div className="input_feedback">{errors.occupation}</div>}
							</div>
							<br />
							<br />
							<br />
							<br />
							<br />

							<div className="Country" style={{ width: '315px', float: 'left' }}>
								<label htmlFor="country">Country</label>
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

							<div className="Region" style={{ width: '315px', float: 'left', marginLeft: '50px' }}>
								<label htmlFor="region">Region</label>
								<br />
								<RegionDropdown
									name="region"
									id="region"
									value={values.region}
									onBlur={handleBlur}
									country={values.country}
									disableWhenEmpty={true}
									onChange={(val) => {
										selectRegion(val), (values.region = val);
									}}
								/>
							</div>

							<div style={{ width: '100%', display: 'inline-block' }}>
								<button
									type="submit"
									className="formButton"
									disabled={errors.username || errors.password || errors.password2 || isSubmitting}
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
