import React from 'react';
import PropTypes from 'prop-types';

// Form validation
import { Formik } from 'formik';
import * as Yup from 'yup';

const AddContact = (props) => (
	<Formik
		initialValues={{
			name: '',
			associated_company: '',
			location: '',
			phone_number: '',
			email_address: ''
		}}
		onSubmit={(values, { setSubmitting }) => {
			setSubmitting(false);
		}}
		validationSchema={Yup.object().shape({
			name: Yup.string()
				.required('Contact name is required')
				.min(3, 'Contact name must be 3 characters or longer')
				.max(50, 'Contact name must be 50 characters or less'),
			associated_company: Yup.string()
				.required('Company name is required')
				.min(2, 'Company name must be 2 characters or longer')
				.max(70, 'Company name must be 70 characters or less'),
			location: Yup.string()
				.required('Contact location is required')
				.min(3, 'Location must be 3 characters or longer')
				.max(70, 'Location must be 70 characters or less'),
			phone_number: Yup.string()
				.required('Contact phone number is required')
				.matches(
					/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
					'Enter a valid phone number'
				),
			email_address: Yup.string().required('Contact email address is required').email('Email is not valid')
		})}
	>
		{(props) => {
			const { values, touched, errors, isSubmitting, handleChange, handleBlur } = props;

			return (
				<div
					className="form_box"
					style={{
						height: 'fit-content',
						marginLeft: '0',
						boxShadow: 'none',
						paddingBottom: '20px',
						backgroundColor: 'transparent'
					}}
				>
					<form action={'/api/userdata/addcontact'} method="POST" style={{ width: '90%' }}>
						<h1>Add a Contact</h1>
						<div className="name">
							<label htmlFor="name">Name</label>
							<br />
							<input
								type="text"
								id="name"
								name="name"
								value={values.name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.name && touched.name && 'error'}
								placeholder="Enter a name"
								required
							/>
							{errors.name && touched.name && <div className="input_feedback">{errors.name}</div>}
						</div>
						<br />
						<div className="associated_company">
							<label htmlFor="associated_company">Company Name</label>
							<br />
							<input
								type="text"
								id="associated_company"
								name="associated_company"
								value={values.associated_company}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.associated_company && touched.associated_company && 'error'}
								placeholder="Enter a company name"
								required
							/>
							{errors.associated_company &&
							touched.associated_company && (
								<div className="input_feedback">{errors.associated_company}</div>
							)}
						</div>
						<br />
						<div className="location">
							<label htmlFor="location">Location</label>
							<br />
							<input
								type="text"
								id="location"
								name="location"
								value={values.location}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.location && touched.location && 'error'}
								placeholder="Enter a location for the contact"
								required
							/>
							{errors.location &&
							touched.location && <div className="input_feedback">{errors.location}</div>}
						</div>
						<br />
						<div className="phone_number">
							<label htmlFor="phone_number">Phone Number</label>
							<br />
							<input
								type="text"
								id="phone_number"
								name="phone_number"
								value={values.phone_number}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.phone_number && touched.phone_number && 'error'}
								placeholder="Enter a phone number for the contact"
								required
							/>
							{errors.phone_number &&
							touched.phone_number && <div className="input_feedback">{errors.phone_number}</div>}
						</div>
						<br />
						<div className="email_address">
							<label htmlFor="email_address">Email Address</label>
							<br />
							<input
								type="text"
								id="email_address"
								name="email_address"
								value={values.email_address}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.email_address && touched.email_address && 'error'}
								placeholder="Enter an email address for the contact"
								required
							/>
							{errors.email_address &&
							touched.email_address && <div className="input_feedback">{errors.email_address}</div>}
						</div>
						<br />

						<div style={{ width: '100%', display: 'inline-block' }}>
							<button
								type="submit"
								className="formButton"
								disabled={
									errors.name ||
									errors.location ||
									errors.associated_company ||
									errors.phone_number ||
									errors.email_address ||
									isSubmitting
								}
							>
								Save Contact
							</button>
						</div>
					</form>
				</div>
			);
		}}
	</Formik>
);

AddContact.propTypes = {
	values: PropTypes.object,
	touched: PropTypes.object,
	errors: PropTypes.object,
	isSubmitting: PropTypes.bool,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};

export default AddContact;
