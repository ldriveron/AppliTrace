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
						<label>Industry</label>
						<select
							name="industry"
							id="industry"
							defaultValue={values.industry}
							onChange={handleChange}
							onBlur={handleBlur}
						>
							{industry_list}
						</select>

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
						<label>Country</label>
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
						<label>State</label>
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
