// API server routes

import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

// MongoDB models for api search
import User from '../models/User';
import Job from '../models/Job';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// For email confirmation
import random_string from 'crypto-random-string';
import ConfirmEmail from './ConfirmEmailHelper';

// Return the current user's information
router.get('/userdata', async (req, res) => {
	if (req.isAuthenticated()) {
		await User.findOne({ _id: req.user.id }).then((user) =>
			res.send({
				user: {
					username: user.username,
					email: user.email,
					occupation: user.occupation,
					industry: user.industry,
					desired_job_title: user.desired_job_title,
					desired_job_types: user.desired_job_types,
					desired_job_locations: user.desired_job_locations,
					job_applications_total: user.job_applications_total,
					region: user.region,
					country: user.country,
					allow_email_notifier: user.allow_email_notifier,
					email_confirmed: user.email_confirmed,
					private: user.private
				}
			})
		);
	} else {
		res.redirect('/users/login');
	}
});

// If the user is authenticated, then return their ID
router.get('/auth/init', async (req, res) => {
	if (req.isAuthenticated()) {
		res.send({ id: req.user.id });
	} else {
		res.redirect('/users/login');
	}
});

// Get all the user's jobapplications from MongoDB sorted by date
// If there are none, then respond with total_results: 0
router.get('/jobs/all', (req, res) => {
	if (req.isAuthenticated()) {
		Job.find({ user_id: req.user.id }).sort('-date_added').then((jobs) => {
			if (jobs.length !== 0) {
				res.send({ total_results: jobs.length, results: jobs });
			} else {
				res.send({ total_results: 0 });
			}
		});
	} else {
		res.redirect('/users/login');
	}
});

// Add a job application for the user to MongoDB
router.post('/userdata/newjob/:source', async (req, res) => {
	if (req.isAuthenticated()) {
		// Get the application data from the form
		let {
			date_applied,
			company_name,
			title,
			location,
			phone_number,
			email_address,
			recruiter_name,
			notes,
			status,
			salary,
			benefits,
			description
		} = req.body;

		let source = req.params.source;

		let user_id = req.user.id;

		const newJob = new Job({
			user_id,
			source,
			date_applied,
			company_name,
			title,
			location,
			phone_number,
			email_address,
			recruiter_name,
			notes,
			status,
			salary,
			benefits,
			description
		});

		// Add job application information to database
		await newJob.save().catch(console.error);

		// Update the user's total applications count
		await User.findOne({ _id: req.user.id }).then(async (user) => {
			await user.updateOne({ job_applications_total: user.job_applications_total + 1 });
		});

		req.flash('user_alert', 'Job application added');
		res.redirect('/users/dashboard');
	} else {
		res.redirect('/users/login');
	}
});

// Change the user's profile
router.post('/userdata/editprofile', async (req, res) => {
	const { username, industry, occupation, region, country } = req.body;
	if (req.isAuthenticated()) {
		User.findOne({ username: username }).then(async (user) => {
			if (user && username != user.username) {
				req.flash('user_alert', "'" + username + "' is already taken");
				res.redirect('/users/dashboard');
			} else {
				await User.findOne({ _id: req.user.id }).then(async (user) => {
					if (
						user.username != username ||
						user.industry != industry ||
						user.occupation != occupation ||
						user.region != region ||
						user.country != country
					) {
						await user.updateOne({
							username: username,
							industry: industry,
							occupation: occupation,
							region: region,
							country: country
						});

						req.flash('user_alert', 'Your profile has been updated');
						res.redirect('/users/dashboard');
					}
				});
			}
		});
	} else {
		res.redirect('/users/login');
	}
});

// Edit uer's email address
router.post('/userdata/editemail', (req, res) => {
	if (req.isAuthenticated()) {
		// Get the new email entered by user
		let newEmail = req.body.newEmail;

		// If there is currently no user with the new email, then continue with updating
		User.findOne({ email: newEmail }).then(async (user) => {
			if (user) {
				req.flash('user_alert', 'Email entered is already registered');
				res.redirect('users/dashboard');
			} else {
				await User.findOne({ _id: req.user.id }).then(async (user) => {
					// This is the code that will be sent in the url to the user
					let confirmation_code = random_string({ length: 10, type: 'url-safe' });

					// This is for the encrypted version of the confirmation code
					let confirmation_code_secret;

					// Generate a hash for the confirmation code
					await bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(confirmation_code, salt, async (err, hash) => {
							if (err) throw err;

							confirmation_code_secret = hash;

							// Send email to user's new email containing confirmation url
							// Only update the user data if the email was actually sent
							if (ConfirmEmail.sendEmail(newEmail, confirmation_code, req.user.id) != 1) {
								// Set the user's email_confirmed field to false
								// Update confirmation code for user in database using hash version
								await user.updateOne({
									email: newEmail,
									email_confirmed: false,
									confirmation_code: confirmation_code_secret
								});

								// Alert the user of the change
								req.flash('user_alert', 'Check your new email for a confirmation link');
								res.redirect('/users/dashboard');
							} else {
								// Alert the user that the email change was not successful
								req.flash('user_alert', 'An error occurred. Try again or enter a different email.');
								res.redirect('/users/dashboard');
							}
						});
					});
				});
			}
		});
	} else {
		res.redirect('/users/login');
	}
});

// Resend email confirmation to user if requested
router.post('/userdata/confirmemail', (req, res) => {
	if (req.isAuthenticated()) {
		User.findOne({ _id: req.user.id }).then(async (user) => {
			// Only send an email confirmation if the user's email is not already confirmed
			if (user.email_confirmed != true) {
				let confirmation_code = random_string({ length: 10, type: 'url-safe' });

				// This is for the encrypted version of the confirmation code
				let confirmation_code_secret;

				// Generate a hash for the confirmation code
				await bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(confirmation_code, salt, async (err, hash) => {
						if (err) throw err;

						confirmation_code_secret = hash;

						// Send email to user containing confirmation email
						if (ConfirmEmail.sendEmail(req.user.email, confirmation_code, req.user.id) != 1) {
							// Update confirmation code for user in database using hash version
							await user.updateOne({ confirmation_code: confirmation_code_secret });

							req.flash('user_alert', 'Check your email for a new confirmation link');
							res.redirect('/users/dashboard');
						} else {
							req.flash('user_alert', 'An error occurred. Try again.');
							res.redirect('/users/dashboard');
						}
					})
				);
			} else {
				req.flash('user_alert', 'Your email is already confirmed');
				res.redirect('/users/dashboard');
			}
		});
	} else {
		res.redirect('/users/login');
	}
});

// Edit user's privacy setting
router.post('/userdata/editprivacy', (req, res) => {
	if (req.isAuthenticated()) {
		User.findOne({ _id: req.user.id }).then(async (user) => {
			// Check if the user's account is set to private
			if (user.private == true) {
				// If the user's account is set to private, set it to public by changing private to false
				await user.updateOne({ private: false });

				req.flash('user_alert', 'Your account is now public');
				res.redirect('/users/dashboard');
			} else if (user.private == false) {
				// If the user's account is set to public, set it to private by changing private to true
				await user.updateOne({ private: true });

				req.flash('user_alert', 'Your account is now private');
				res.redirect('/users/dashboard');
			}
		});
	} else {
		res.redirect('/users/login');
	}
});

// Change the user's password
router.post('/userdata/editpassword', async (req, res) => {
	let current_pw = req.body.current_pw;
	let new_pw = req.body.new_pw;

	if (req.isAuthenticated()) {
		await User.findOne({ _id: req.user.id })
			.then((user) => {
				//match password
				bcrypt.compare(current_pw, user.password, async (err, isMatch) => {
					if (err) throw err;

					if (isMatch) {
						// Secure the user's password
						await bcrypt.genSalt(10, (err, salt) =>
							bcrypt.hash(new_pw, salt, async (err, hash) => {
								if (err) throw err;
								//set the password to the generated hash
								new_pw = hash;

								// Save user's new password to mongodb
								await user.updateOne({ password: new_pw });
							})
						);

						req.flash('user_alert', 'Your password has been changed');
						res.redirect('/users/dashboard');
					} else {
						req.flash('user_error', 'Current password incorrect');
						res.redirect('/users/dashboard');
					}
				});
			})
			.catch((err) => console.log(err));
	} else {
		res.redirect('/users/login');
	}
});

// Delete the user's account
router.post('/userdata/deleteaccount', async (req, res) => {
	let pw = req.body.password;

	if (req.isAuthenticated()) {
		await User.findOne({ _id: req.user.id }).then((user) => {
			//match password
			bcrypt.compare(pw, user.password, async (err, isMatch) => {
				if (err) throw err;

				if (isMatch) {
					// Delete the user's account from MongoDB
					await User.deleteOne({ _id: req.user.id });

					// Delete all job applications by the user from MongoDB
					await Job.deleteMany({ user_id: req.user.id });

					// End passport session and redirect user to login page
					req.flash('success_msg', 'Your account and jobs applications have been deleted');
					req.logout();

					res.redirect('/users/login');
				} else {
					req.flash('user_error', 'Incorrect password');
					res.redirect('/users/dashboard');
				}
			});
		});
	} else {
		res.redirect('/users/login');
	}
});

export default router;
