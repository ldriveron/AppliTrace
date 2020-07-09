import express from 'express';
import passport from 'passport';

// Passport starting
import initializePassport from '../passport-config';
initializePassport(passport);

// For encrypting passwords
import bcrypt from 'bcrypt';

import methodOverride from 'method-override';

// Set the server
const server = express.Router();

server.use(methodOverride('_method'));

// Import data modules
import User from '../models/User';

// Login routes
server.get('/login', checkAuthenticated, (req, res) => {
	res.render('login.ejs', {
		page_title: 'Login'
	});
});

server.post('/login', checkAuthenticated, (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/users/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Register routes
server.get('/register', checkAuthenticated, (req, res) => {
	res.render('register.ejs', {
		page_title: 'Register'
	});
});

server.post('/register/:region/:location', checkAuthenticated, async (req, res) => {
	// Create a user account using the form information
	let { username, password, industry, occupation, region, country } = req.body;

	// If occupation is left empty, set it to "Job Seeker"
	if (occupation == '') occupation = 'Job Seeker';

	// Get the timezone of the user
	const timezone = req.params.region + '/' + req.params.location;
	let joindate = new Date().toLocaleDateString('en-US', { timeZone: timezone });

	let errors = [];

	if (errors.length > 0) {
		res.render('register.ejs', {
			errors,
			page_title: 'Register'
		});
	} else {
		// Passed form validation
		let usernamereq = new RegExp(username, 'i');
		await User.findOne({ username: usernamereq }).then(async (user) => {
			if (user) {
				// User exists, show as an error
				req.flash('user_error', 'Username entered is already registered');
				res.redirect('/users/register');
			} else {
				// Create the new user object
				const newUser = new User({
					username,
					password,
					industry,
					occupation,
					region,
					country,
					timezone,
					joindate
				});

				// Secure the user's password
				await bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newUser.password, salt, async (err, hash) => {
						if (err) throw err;
						//set the password to the generated hash
						newUser.password = hash;

						// Save new user to mongodb and redirect to login page
						await newUser
							.save()
							.then((user) => {
								req.flash('success_msg', 'You account has been created');

								res.redirect('/users/login');
							})
							.catch((err) => console.log(err));
					})
				);
			}
		});
	}
});

// Dashboard route when user is logged in
server.get('/dashboard', checkNotAuthenticated, (req, res) => {
	res.render('dashboard.ejs', {
		page_title: 'Dashboard'
	});
});

// Log out the user and redirect them to the login page
server.post('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You have logged out');
	res.redirect('/users/login');
});

// Authenticating the user
// If the user is not logged in, redirect them to the login page
function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	req.flash('user_error', 'Log in to view your dashboard');
	res.redirect('/users/login');
}

// Check if not authenticated
// If the user is logged in, redirect them to the dashboard page
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/users/dashboard');
	}

	next();
}

module.exports = server;
