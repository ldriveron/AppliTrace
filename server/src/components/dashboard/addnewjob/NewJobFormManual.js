import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Form validation
import { Formik } from 'formik';
import * as Yup from 'yup';

const NewJobFormManual = (props) => (
	<Formik
		initialValues={{
			date_applied: props.initialDate,
			company_name: '',
			title: '',
			location: '',
			phone_number: '',
			email_address: '',
			recruiter_name: '',
			notes: '',
			status: 'Applied',
			salary: '',
			benefits: '',
			description: ''
		}}
		onSubmit={(values, { setSubmitting }) => {
			setSubmitting(false);
		}}
		validationSchema={Yup.object().shape({
			date_applied: Yup.string()
				.required('Date applied is required')
				.min(10, 'Please use this format: mm/dd/yyyy')
				.max(10, 'Please use this format: mm/dd/yyyy')
				.matches(
					/(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,
					'Please use this format: mm/dd/yyyy'
				),
			title: Yup.string()
				.required('Title is required')
				.min(3, 'Title must be 3 characters or longer')
				.max(60, 'Title must be 60 characters or less'),
			company_name: Yup.string()
				.required('Company name is required')
				.min(2, 'Company name must be 2 characters or longer')
				.max(60, 'Company name must be 60 characters or less'),
			phone_number: Yup.string().matches(
				/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
				'Enter a valid phone number'
			),
			email_address: Yup.string().email('Email is not valid'),
			recruiter_name: Yup.string()
				.min(3, 'Recruiter name must be 3 characters or longer')
				.max(25, 'Recruiter name must be 25 characters or less'),
			location: Yup.string()
				.min(3, 'Location must be 3 characters or longer')
				.max(50, 'Location must be 50 characters or less'),
			notes: Yup.string()
				.min(3, 'Notes must be 3 characters or longer')
				.max(250, 'Notes must be 250 characters or less'),
			status: Yup.string().required('Status is required'),
			salary: Yup.string()
				.min(3, 'Enter at least three numbers')
				.max(25, 'Salary cannot exceed 25 characters')
				.matches(
					/^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/,
					'Use this format example: 11,000'
				),
			benefits: Yup.string()
				.min(3, 'Notes must be 3 characters or longer')
				.max(250, 'Notes must be 250 characters or less'),
			description: Yup.string()
				.min(10, 'Description must be 10 characters or longer')
				.max(600, 'Description must be 600 characters or less')
		})}
	>
		{(props) => {
			const { values, touched, errors, isSubmitting, handleChange, handleBlur } = props;

			function onDateChange(date) {
				values.date_applied = date;
			}

			return (
				<div
					className="form_box"
					style={{
						height: 'fit-content',
						marginLeft: '0',
						boxShadow: 'none',
						paddingBottom: '20px'
					}}
				>
					<form action={'/api/userdata/newjob/Manual'} method="POST" style={{ width: '90%' }}>
						<h1>Enter Application Details</h1>
						<div className="date_applied">
							<label htmlFor="date_applied">Date Applied</label>
							<br />
							<input
								type="text"
								id="date_applied"
								name="date_applied"
								placeholder="Enter the date you applied to this position"
								value={values.date_applied}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.date_applied && touched.date_applied && 'error'}
								required
							/>
							{errors.date_applied &&
							touched.date_applied && <div className="input_feedback">{errors.date_applied}</div>}
						</div>
						<br />
						<div className="company_name">
							<label htmlFor="company_name">Company Name</label>
							<br />
							<input
								type="text"
								id="company_name"
								name="company_name"
								value={values.company_name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.company_name && touched.company_name && 'error'}
								placeholder="Enter an company name"
								required
							/>
							{errors.company_name &&
							touched.company_name && <div className="input_feedback">{errors.company_name}</div>}
						</div>
						<br />
						<div className="title">
							<label htmlFor="title">Position Title</label>
							<br />
							<input
								type="text"
								id="title"
								name="title"
								placeholder="Enter a title"
								value={values.title}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.title && touched.title && 'error'}
								required
							/>
							{errors.title && touched.title && <div className="input_feedback">{errors.title}</div>}
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
								placeholder="Enter a location for the company"
							/>
							{errors.location &&
							touched.location && <div className="input_feedback">{errors.location}</div>}
						</div>
						<br />
						<div className="status">
							<label htmlFor="status">Status</label>
							<br />
							<select
								name="status"
								id="status"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.status}
							>
								<option key="Applied" value="Applied">
									Applied
								</option>
								<option key="Contacted" value="Contacted">
									Contacted
								</option>
								<option key="Screening Interview" value="Screening Interview">
									Screening Interview
								</option>
								<option key="Technical Interview" value="Technical Interview">
									Technical Interview
								</option>
								<option key="Offer" value="Offer">
									Offer
								</option>
								<option key="Rejected" value="Rejected">
									Rejected
								</option>
								<option key="Declired Offer" value="Contacted">
									Declined Offer
								</option>
							</select>
						</div>
						<br />
						<div className="recruiter_name">
							<label htmlFor="recruiter_name">Recruiter Name</label>
							<br />
							<input
								type="text"
								id="recruiter_name"
								name="recruiter_name"
								value={values.recruiter_name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.recruiter_name && touched.recruiter_name && 'error'}
								placeholder="Enter a recruiter name"
							/>
							{errors.recruiter_name &&
							touched.recruiter_name && <div className="input_feedback">{errors.recruiter_name}</div>}
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
								placeholder="Enter a phone number for the company"
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
								placeholder="Enter an email for the company"
							/>
							{errors.email_address &&
							touched.email_address && <div className="input_feedback">{errors.email_address}</div>}
						</div>
						<br />
						<div className="salary">
							<label htmlFor="salary">Salary</label>
							<br />
							<input
								type="text"
								id="salary"
								name="salary"
								value={values.salary}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.salary && touched.salary && 'error'}
								placeholder="Enter possible salary, hourly or yearly"
							/>
							{errors.salary && touched.salary && <div className="input_feedback">{errors.salary}</div>}
						</div>
						<br />
						<div className="description">
							<label htmlFor="description">Description</label>
							<br />
							<textarea
								type="text"
								id="description"
								name="description"
								value={values.description}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.description && touched.description && 'error'}
								placeholder="Enter job description"
							/>
							{errors.description &&
							touched.description && <div className="input_feedback">{errors.description}</div>}
						</div>
						<br />
						<div className="benefits">
							<label htmlFor="benefits">Benefits</label>
							<br />
							<textarea
								type="text"
								id="benefits"
								name="benefits"
								value={values.benefits}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.benefits && touched.benefits && 'error'}
								placeholder="Enter job benefits"
							/>
							{errors.benefits &&
							touched.benefits && <div className="input_feedback">{errors.benefits}</div>}
						</div>
						<br />
						<div className="notes">
							<label htmlFor="notes">Notes</label>
							<br />
							<textarea
								id="notes"
								name="notes"
								value={values.notes}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.notes && touched.notes && 'error'}
								placeholder="Enter any notes you'd like to keep"
							/>
							{errors.notes && touched.notes && <div className="input_feedback">{errors.notes}</div>}
						</div>
						<br />

						<div style={{ width: '100%', display: 'inline-block' }}>
							<button
								type="submit"
								className="formButton"
								disabled={
									errors.date_applied ||
									errors.title ||
									errors.company_name ||
									errors.phone_number ||
									errors.email_address ||
									errors.recruiter_name ||
									errors.notes ||
									errors.status ||
									errors.salary ||
									errors.benefits ||
									errors.description ||
									isSubmitting
								}
							>
								Add Application
							</button>
						</div>
					</form>
				</div>
			);
		}}
	</Formik>
);

NewJobFormManual.propTypes = {
	values: PropTypes.object,
	initialDate: PropTypes.string,
	touched: PropTypes.object,
	errors: PropTypes.object,
	isSubmitting: PropTypes.bool,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};

export default NewJobFormManual;
