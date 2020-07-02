import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// General component imports
import StartingPage from './StartingPage';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Header from './Header';

// Dashboard imports
import Dashboard from './dashboard/Dashboard';
import WeekView from './weekview/WeekView';
import Settings from './settings/Settings';

// Font-awesome react
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faStream,
	faCalendar,
	faStickyNote,
	faIdBadge,
	faSlidersH,
	faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
library.add(faStream, faCalendar, faStickyNote, faIdBadge, faSlidersH, faSignOutAlt);

// API methods import
import * as api from '../api';

// Main app starting point
class App extends Component {
	state = {
		user_id: '',
		isLoggedIn: false,
		user_data: {}
	};

	componentDidMount() {
		api.authUser().then((resp) => {
			if (resp.id) {
				this.setState({
					user_id: resp.id,
					isLoggedIn: true
				});

				// Fetch user data after their ID is retreived
				api
					.fetchUser()
					.then((resp) => {
						this.setState({
							user_data: {
								user_id: this.state.user_id,
								username: resp.user.username,
								email: resp.user.email,
								occupation: resp.user.occupation,
								industry: resp.user.industry,
								desired_job_title: resp.user.desired_job_title,
								desired_job_types: resp.user.desired_job_types,
								desired_job_locations: resp.user.desired_job_locations,
								job_applications_total: resp.user.job_applications_total,
								region: resp.user.region,
								country: resp.user.country,
								allow_email_notifier: resp.user.allow_email_notifier,
								email_confirmed: resp.user.email_confirmed,
								private: resp.user.private
							}
						});
					})
					.catch(console.error);
			} else {
				this.setState({
					isLoggedIn: false
				});
			}
		});
	}

	// Use diffrent Routes for react based on if the user is authenticated
	render() {
		return (
			<Router>
				{this.state.user_data.user_id && (
					<Header isLoggedIn={this.state.isLoggedIn} user_data={this.state.user_data} />
				)}

				{this.state.user_data.user_id ? (
					<Switch>
						<Route
							path="/users/dashboard"
							exact
							render={(props) => <Dashboard {...props} user_data={this.state.user_data} />}
						/>
						<Route
							path="/users/settings"
							render={(props) => <Settings {...props} user_data={this.state.user_data} />}
						/>

						{/* <Route
							path="/users/overview"
							render={(props) => <Overview {...props} user_data={this.state.user_data} />}
						/> */}
						{/* <Route path="/:username" render={(props) => <PublicOverview {...props} />} /> */}
					</Switch>
				) : (
					<Switch>
						<Route path="/users/login" exact component={LoginForm} />
						<Route path="/users/register" exact component={RegisterForm} />
						<Route path="/" exact component={StartingPage} />
						{/* <Route path="/:username" exact render={(props) => <PublicOverview {...props} />} /> */}
					</Switch>
				)}
			</Router>
		);
	}
}

export default App;
