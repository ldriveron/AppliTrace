import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Form validation
import { Formik } from 'formik';
import * as Yup from 'yup';

const NewJobFormExternal = (props) => (
	<Formik
		initialValues={{
			date_applied: props.initialDate,
			source_url: '',
			notes: '',
			recruiter_name: '',
			phone_number: '',
			email_address: '',
			status: 'Applied',
			salary: '',
			source: props.source,
			urlregex: props.urlregex
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
			source_url: Yup.string()
				.required('Link is required')
				.min(5, 'Link must be 5 characters or longer')
				.max(300, 'Link must be 300 characters or less')
				.matches(
					props.urlregex,
					'A link in the proper format is required [https://(www.)' + props.source.toLowerCase() + '.com]'
				),
			notes: Yup.string()
				.min(3, 'Notes must be 3 characters or longer')
				.max(2000, 'Notes must be 2000 characters or less'),
			salary: Yup.string()
				.min(3, 'Enter at least three numbers')
				.max(25, 'Salary cannot exceed 25 characters')
				.matches(/^\$?[1-9]\d?(?:,\d{3})*(?:\.\d{2})?$/, 'Use this format example: $50,000'),
			phone_number: Yup.string().matches(
				/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
				'Enter a valid phone number'
			),
			email_address: Yup.string().email('Email is not valid')
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
					<form
						action={'/api/userdata/newjobexternal/' + values.source}
						method="POST"
						style={{ width: '90%' }}
					>
						<h1>Enter a Job Application From {values.source}</h1>
						<div className="source_url">
							<label htmlFor="source_url">Link to Application</label>
							<br />
							<input
								type="text"
								id="source_url"
								name="source_url"
								placeholder="Enter a link to the application"
								value={values.source_url}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.source_url && touched.source_url && 'error'}
								required
							/>
							{errors.source_url &&
							touched.source_url && <div className="input_feedback">{errors.source_url}</div>}
						</div>
						<br />
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
						<div className="status">
							<label htmlFor="status">Status</label>
							<br />
							<div className="select_wrapper_long">
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
									errors.source_url ||
									errors.date_applied ||
									errors.recruiter_name ||
									errors.notes ||
									errors.salary ||
									isSubmitting
								}
							>
								Add Application
							</button>
							<br />
							<br />
							Please review the data gathered after adding the application as it might not be perfect.
						</div>
					</form>
				</div>
			);
		}}
	</Formik>
);

NewJobFormExternal.propTypes = {
	values: PropTypes.object,
	initialDate: PropTypes.string,
	source: PropTypes.string,
	urlregex: PropTypes.object,
	touched: PropTypes.object,
	errors: PropTypes.object,
	isSubmitting: PropTypes.bool,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};

export default NewJobFormExternal;
