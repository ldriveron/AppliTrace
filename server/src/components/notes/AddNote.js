import React from 'react';
import PropTypes from 'prop-types';

// Form validation
import { Formik } from 'formik';
import * as Yup from 'yup';

const AddNote = (props) => (
	<Formik
		initialValues={{
			title: '',
			note: ''
		}}
		onSubmit={(values, { setSubmitting }) => {
			setSubmitting(false);
		}}
		validationSchema={Yup.object().shape({
			note: Yup.string()
				.min(3, 'Note must be 3 characters or longer')
				.max(500, 'Note must be 500 characters or less'),
			title: Yup.string()
				.min(3, 'Title must be 3 characters or longer')
				.max(150, 'Title must be 150 characters or less')
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
					<form action={'/api/userdata/addnote/'} method="POST" style={{ width: '90%' }}>
						<h1>Add a Note</h1>
						<div className="note">
							<div className="title">
								<label htmlFor="title">Note Title</label>
								<br />
								<input
									type="text"
									id="title"
									name="title"
									value={values.title}
									onChange={handleChange}
									onBlur={handleBlur}
									className={errors.title && touched.title && 'error'}
									placeholder="Enter a note title"
									required
								/>
								{errors.title && touched.title && <div className="input_feedback">{errors.title}</div>}
							</div>
							<br />
							<label htmlFor="note">Note</label>
							<br />
							<textarea
								id="note"
								name="note"
								value={values.note}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.note && touched.note && 'error'}
								placeholder="Enter any note you'd like to keep"
								required
							/>
							{errors.note && touched.note && <div className="input_feedback">{errors.note}</div>}
						</div>
						<br />

						<div style={{ width: '100%', display: 'inline-block' }}>
							<button
								type="submit"
								className="formButton"
								disabled={errors.notes || errors.title || isSubmitting}
							>
								Save note
							</button>
						</div>
					</form>
				</div>
			);
		}}
	</Formik>
);

AddNote.propTypes = {
	values: PropTypes.object,
	touched: PropTypes.object,
	errors: PropTypes.object,
	isSubmitting: PropTypes.bool,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func
};

export default AddNote;
