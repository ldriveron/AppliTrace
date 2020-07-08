// API server routes

import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

// MongoDB models for api search
import User from '../models/User';
import Job from '../models/Job';
import Note from '../models/Note';
import Contact from '../models/Contact';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Return the current user's information
router.get('/userdata', async (req, res) => {
	if (req.isAuthenticated()) {
		await User.findOne({ _id: req.user.id }).then(async (user) => {
			await user.updateOne({
				last_activity: new Date().toLocaleDateString('en-US', { timeZone: user.timeZone })
			});

			res.send({
				user: {
					username: user.username,
					joindate: user.joindate,
					occupation: user.occupation,
					industry: user.industry,
					desired_job_title: user.desired_job_title,
					desired_job_types: user.desired_job_types,
					desired_job_locations: user.desired_job_locations,
					job_applications_total: user.job_applications_total,
					region: user.region,
					country: user.country,
					private: user.private
				}
			});
		});
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

// Get all the user's job applications from MongoDB sorted by date
// If there are none, then respond with total_results: 0
router.get('/jobs/all/:order', (req, res) => {
	let order = req.params.order;
	if (req.isAuthenticated()) {
		Job.find({ user_id: req.user.id }).sort(order).then((jobs) => {
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

// Search for job applications for the user based on search input from Dashboard
// If none are found, then respond with total_results: 0
router.get('/jobs/search/:term/:type/:order', (req, res) => {
	if (req.isAuthenticated()) {
		// Get term and type from url parameters
		let term = req.params.term;
		let type = req.params.type;
		let order = req.params.order;

		// If the user is searching for a term in all categories, then use the $or command
		if (type == 'all') {
			Job.find({
				$or: [
					{ company_name: { $regex: new RegExp(term, 'i') } },
					{ title: { $regex: new RegExp(term, 'i') } },
					{ status: { $regex: new RegExp(term, 'i') } },
					{ location: { $regex: new RegExp(term, 'i') } }
				]
			})
				.sort(order)
				.then((apps) => {
					if (apps.length !== 0) {
						res.send({ total_results: apps.length, results: apps });
					} else {
						res.send({ total_results: 0 });
					}
				});
		} else {
			// If the user selects a certain category, then change the type in query
			Job.find({ [type]: new RegExp(term, 'i') }).sort(order).then((apps) => {
				if (apps.length !== 0) {
					res.send({ total_results: apps.length, results: apps });
				} else {
					res.send({ total_results: 0 });
				}
			});
		}
	} else {
		res.redirect('/users/login');
	}
});

// Add a job application for the user to MongoDB
router.post('/userdata/newjob/:source', async (req, res) => {
	if (req.isAuthenticated()) {
		// Get the application data from the form
		let {
			source_url,
			date_applied,
			company_name,
			company_website,
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
			source_url,
			date_applied,
			company_name,
			company_website,
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

		req.flash('user_alert', 'Job application has been added');
		res.redirect('/users/dashboard');
	} else {
		res.redirect('/users/login');
	}
});

// Edit a job application for the user on MongoDB
router.post('/userdata/editjob/:id', async (req, res) => {
	if (req.isAuthenticated()) {
		let appid = req.params.id;
		// Get the application data from the form
		let {
			source_url,
			date_applied,
			company_name,
			company_website,
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

		// Add job application information to database
		await Job.findOne({ _id: appid }).then(async (app) => {
			if (app.user_id == req.user.id) {
				await app.updateOne({
					source_url: source_url,
					date_applied: date_applied,
					company_name: company_name,
					company_website: company_website,
					title: title,
					location: location,
					phone_number: phone_number,
					email_address: email_address,
					recruiter_name: recruiter_name,
					notes: notes,
					status: status,
					salary: salary,
					benefits: benefits,
					description: description
				});
			}
		});

		req.flash('user_alert', 'Job application has been edited');
		res.redirect('/users/dashboard');
	} else {
		res.redirect('/users/login');
	}
});

// Delete a job application for the user on MongoDB
router.post('/userdata/deletejob/:id', async (req, res) => {
	if (req.isAuthenticated()) {
		let appid = req.params.id;
		// Add job application information to database
		await Job.findOneAndDelete({ _id: appid }).then(async () => {
			await User.findOne({ _id: req.user.id }).then(async (user) => {
				await user.updateOne({ job_applications_total: user.job_applications_total - 1 });
			});
		});

		req.flash('user_alert', 'Job application has been deleted');
		res.redirect('/users/dashboard');
	} else {
		res.redirect('/users/login');
	}
});

// Get all notes
router.get('/userdata/notes/:term', (req, res) => {
	if (req.isAuthenticated()) {
		let term = req.params.term;

		if (term != 'null') {
			Note.find({
				$or: [ { note: { $regex: new RegExp(term, 'i') } }, { title: { $regex: new RegExp(term, 'i') } } ],
				$and: [ { user_id: req.user.id } ]
			}).then((notes) => {
				if (notes.length !== 0) {
					res.send({ total_results: notes.length, results: notes });
				} else {
					res.send({ total_results: 0 });
				}
			});
		} else {
			Note.find({ user_id: req.user.id }).then((notes) => {
				if (notes.length !== 0) {
					res.send({ total_results: notes.length, results: notes });
				} else {
					res.send({ total_results: 0 });
				}
			});
		}
	} else {
		res.redirect('/users/login');
	}
});

// Add a note
router.post('/userdata/addnote', async (req, res) => {
	if (req.isAuthenticated()) {
		let title = req.body.title;
		let note = req.body.note;
		let user_id = req.user.id;

		const newNote = new Note({ user_id, title, note });

		await newNote.save().catch(console.error);

		req.flash('user_alert', 'New note has been added');
		res.redirect('/users/dashboard');
	}
});

// Delete a note
router.post('/userdata/deletenote/:noteid', async (req, res) => {
	if (req.isAuthenticated()) {
		let noteid = req.params.noteid;

		await Note.findOneAndDelete({ _id: noteid });

		req.flash('user_alert', 'Note has been deleted');
		res.redirect('/users/dashboard');
	} else {
		res.redirect('/users/login');
	}
});

// Get all contacts
router.get('/userdata/contacts/:term', (req, res) => {
	if (req.isAuthenticated()) {
		let term = req.params.term;

		if (term != 'null') {
			Contact.find({
				$or: [
					{ name: { $regex: new RegExp(term, 'i') } },
					{ associated_company: { $regex: new RegExp(term, 'i') } },
					{ location: { $regex: new RegExp(term, 'i') } }
				],
				$and: [ { user_id: req.user.id } ]
			}).then((contacts) => {
				if (contacts.length !== 0) {
					res.send({ total_results: contacts.length, results: contacts });
				} else {
					res.send({ total_results: 0 });
				}
			});
		} else {
			Contact.find({ user_id: req.user.id }).then((contacts) => {
				if (contacts.length !== 0) {
					res.send({ total_results: contacts.length, results: contacts });
				} else {
					res.send({ total_results: 0 });
				}
			});
		}
	} else {
		res.redirect('/users/login');
	}
});

// Add a contact
router.post('/userdata/addcontact', async (req, res) => {
	if (req.isAuthenticated()) {
		let user_id = req.user.id;
		let name = req.body.name;
		let location = req.body.location;
		let phone_number = req.body.phone_number;
		let email_address = req.body.email_address;
		let associated_company = req.body.associated_company;

		const newContact = new Contact({ user_id, associated_company, location, phone_number, email_address, name });

		await newContact.save().catch(console.error);

		req.flash('user_alert', 'New contact has been added');
		res.redirect('/users/dashboard');
	}
});

// Delete a contact
router.post('/userdata/deletecontact/:contactid', async (req, res) => {
	if (req.isAuthenticated()) {
		let contactid = req.params.contactid;

		await Contact.findOneAndDelete({ _id: contactid });

		req.flash('user_alert', 'Contact has been deleted');
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

					// Delete all user notes
					await Note.deleteMany({ user_id: req.user.id });

					// Delete all user contacts
					await Contact.deleteMany({ user_id: req.user.id });

					// End passport session and redirect user to login page
					req.flash('success_msg', 'Your account and all related data has been deleted');
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
