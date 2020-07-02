import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Form validation
import { Formik } from 'formik';
import * as Yup from 'yup';

// Country and region selector
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

const EditProfile = (props) => (
	<Formik
		initialValues={{
			username: props.username,
			industry: props.industry,
			occupation: props.occupation,
			region: props.region,
			country: props.country
		}}
		onSubmit={(values, { setSubmitting }) => {
			setSubmitting(false);
		}}
		validationSchema={Yup.object().shape({
			username: Yup.string()
				.required('New username is required')
				.min(3, 'Username must be 3 characters or longer')
				.max(15, 'Username must be 15 characters or less')
			// .test('username-match', 'This is your current username', function(value) {
			// 	return props.username != value;
			// })
		})}
	>
		{(props) => {
			document.title = 'Edit Profile';

			let [ countrySelect, setCountry ] = useState();
			let [ regionSelect, setRegion ] = useState();

			const {
				values,
				username,
				industry,
				occupation,
				region,
				country,
				touched,
				errors,
				isSubmitting,
				handleChange,
				handleBlur
			} = props;

			function selectCountry(val) {
				setCountry(val);
				values.country = val;
			}

			function selectRegion(val) {
				setRegion(val);
				values.region = val;
			}

			return (
				<div>
					<form action="/api/userdata/editprofile" method="POST">
						<div className="panel_title">Profile</div>
						<label>Username</label>
						<input
							type="text"
							name="username"
							id="username"
							value={values.username}
							onBlur={handleBlur}
							className={errors.username && touched.username && 'error'}
							onChange={handleChange}
							defaultValue={username}
						/>
						{errors.username && touched.username && <div className="input_feedback">{errors.username}</div>}

						<br />
						<br />
						<label>Industry (Optional)</label>
						<input
							type="text"
							name="industry"
							id="industry"
							value={values.industry}
							onBlur={handleBlur}
							onChange={handleChange}
							defaultValue={industry}
							placeholder="Enter your desired industry"
						/>

						<br />
						<br />
						<label>Occupation (Optional)</label>
						<input
							type="text"
							name="occupation"
							id="occupation"
							value={values.occupation}
							onBlur={handleBlur}
							onChange={handleChange}
							defaultValue={occupation}
							placeholder="Enter your current occupation"
						/>

						<br />
						<br />
						<label>Country (Optional)</label>
						<CountryDropdown
							name="country"
							id="country"
							value={values.country}
							onBlur={handleBlur}
							onChange={(val) => {
								selectCountry(val), (values.country = val);
							}}
						/>

						<br />
						<br />
						<label>State (Optional)</label>
						<RegionDropdown
							name="region"
							id="region"
							value={values.region}
							onBlur={handleBlur}
							country={values.country}
							onChange={(val) => {
								selectRegion(val), (values.region = val);
							}}
						/>

						<button type="submit" className="formButton" disabled={errors.username || isSubmitting}>
							Update Profile
						</button>
					</form>
				</div>
			);
		}}
	</Formik>
);

EditProfile.propTypes = {
	username: PropTypes.string,
	industry: PropTypes.string,
	occupation: PropTypes.string,
	region: PropTypes.string,
	country: PropTypes.string,
	values: PropTypes.object,
	touched: PropTypes.object,
	errors: PropTypes.object,
	isSubmitting: PropTypes.bool,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func,
	handleSubmit: PropTypes.func
};

export default EditProfile;
