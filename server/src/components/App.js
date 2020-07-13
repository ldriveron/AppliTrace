import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// General component imports
import StartingPage from './StartingPage';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Header from './Header';

// Dashboard imports
import Dashboard from './dashboard/Dashboard';
import Notes from './notes/Notes';
import Contacts from './contacts/Contacts';
import Settings from './settings/Settings';

// Font-awesome react
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faStream,
	faCalendar,
	faStickyNote,
	faIdBadge,
	faSlidersH,
	faSignOutAlt,
	faChevronCircleUp,
	faChevronCircleDown,
	faChevronCircleRight,
	faBuilding,
	faPhoneSquareAlt,
	faMapPin,
	faAt
} from '@fortawesome/free-solid-svg-icons';
library.add(
	faStream,
	faCalendar,
	faStickyNote,
	faIdBadge,
	faSlidersH,
	faSignOutAlt,
	faChevronCircleUp,
	faChevronCircleDown,
	faChevronCircleRight,
	faBuilding,
	faPhoneSquareAlt,
	faMapPin,
	faAt
);

// API methods import
import * as api from '../api';
import { difference } from 'underscore';

// Main app starting point
class App extends Component {
	state = {
		user_id: '',
		isLoggedIn: false,
		user_data: {},
		search_term: null,
		search_type: 'all',
		search_order: '-date_added'
	};

	async componentDidMount() {
		await api.authUser().then(async (resp) => {
			if (resp.id) {
				this.setState({
					user_id: resp.id,
					isLoggedIn: true
				});

				// Fetch user data after their ID is retreived
				await api
					.fetchUser()
					.then((resp) => {
						this.setState({
							user_data: {
								user_id: this.state.user_id,
								username: resp.user.username,
								joindate: resp.user.joindate,
								occupation: resp.user.occupation,
								industry: resp.user.industry,
								desired_job_title: resp.user.desired_job_title,
								desired_job_types: resp.user.desired_job_types,
								desired_job_locations: resp.user.desired_job_locations,
								job_applications_total: resp.user.job_applications_total,
								region: resp.user.region,
								country: resp.user.country,
								private: resp.user.private
							}
						});
					})
					.catch(console.error);

				// Fetch all of the users applications and set the state
				await api.fetchAllJobs(this.state.search_order).then((resp) => {
					this.setState({
						apps_list: resp,
						apps_list_full: resp
					});
				});
			} else {
				this.setState({
					isLoggedIn: false
				});
			}
		});

		let today = new Date();
		let this_month = today.getMonth() == 11 ? 1 : today.getMonth() + 1;

		// Doing this here so that the user stats will only be calculated once
		await this.calculateWeekanMonthStats(today, this_month);
	}

	calculateWeekanMonthStats(today, this_month) {
		// Get the previous occuring Sunday
		let this_week_start = new Date(today.setDate(today.getDate() - today.getDay()));

		// Get the sunday from last week
		let last_week_start = new Date();
		last_week_start.setDate(this_week_start.getDate() - 7);

		// Calculate the last day of the current week (sunday to sunday)
		let this_week_end = new Date();
		this_week_end.setDate(this_week_start.getDate() + 6);

		// Last week's sunday
		let second_week_end = new Date(last_week_start.getTime());
		second_week_end.setDate(second_week_end.getDate() + 6);

		// Week totals
		let this_week_total = 0;
		let last_week_total = 0;

		// Month totals
		let this_month_total = 0;
		let last_month_total = 0;

		// Loop through all applications
		if (this.state.apps_list.total_results != 0) {
			for (let app = 0; app < this.state.apps_list.results.length; app++) {
				var application_date = new Date(this.state.apps_list.results[app].date_applied);

				// Count how many applications sent during the current week
				// Exact dates for some reason are not considered qual when using just the Date object
				// Using .toLocalDateString() for those cases
				if (
					(application_date >= this_week_start ||
						application_date.toLocaleDateString() == this_week_start.toLocaleDateString()) &&
					(application_date <= this_week_end ||
						application_date.toLocaleDateString() == this_week_end.toLocaleDateString())
				) {
					this_week_total++;
				}

				// Check how many applications the user has for the previous week
				if (
					(application_date >= last_week_start ||
						application_date.toLocaleDateString() == last_week_start.toLocaleDateString()) &&
					(application_date <= second_week_end ||
						application_date.toLocaleDateString() == second_week_end.toLocaleDateString())
				) {
					last_week_total++;
				}

				// Count how many applications sent during the current month
				if ((application_date.getMonth() == 11 ? 1 : application_date.getMonth() + 1) == this_month) {
					this_month_total++;
				}

				// Count how many applications sent during the previous month
				if (
					(application_date.getMonth() == 11 ? 1 : application_date.getMonth() + 1) ==
					(this_month == 1 ? 12 : this_month - 1)
				) {
					last_month_total++;
				}
			}
		}

		// Calculate the percentage difference between last week and this week
		let difference_between_weeks = 0;

		// Avoid division by 0
		if (last_week_total != 0) {
			difference_between_weeks = Math.abs(
				(this_week_total - last_week_total) / Math.abs(last_week_total) * 100.0
			).toFixed(2);
		} else {
			difference_between_weeks = this_week_total * 100.0;
		}

		// Calculate the percentage difference between last month and this month
		let difference_between_months = 0;

		// Avoid division by 0
		if (last_month_total != 0) {
			difference_between_months = Math.abs(
				(this_month_total - last_month_total) / Math.abs(last_month_total) * 100.0
			).toFixed(2);
		} else {
			difference_between_months = this_month_total * 100.0;
		}

		this.setState({
			user_stats: {
				last_week_total: last_week_total,
				total_this_week: this_week_total,
				total_last_month: last_month_total,
				total_this_month: this_month_total,
				difference_between_weeks: difference_between_weeks,
				difference_between_months: difference_between_months
			}
		});
	}

	// Handle search input from user
	handleSearch(term) {
		// If the search text input is not empty, then update the applications list
		// If it is empty, then get all applications list again
		if (this.state.search_term != term && term != '' && /^[a-z0-9]+$/i.test(term)) {
			api.fetchJobBySearch(term, this.state.search_type, this.state.search_order).then((resp) => {
				this.setState({
					apps_list: resp,
					search_term: term
				});
			});
		} else if (term == '') {
			api.fetchAllJobs(this.state.search_order).then((resp) => {
				this.setState({
					apps_list: resp,
					search_term: null
				});
			});
		}
	}

	// Handle search type change from user
	handleSearchTypeChange(type) {
		// If the search text input is not empty, then update the applications list
		// else, just update the search type
		if (this.state.search_term != null && this.state.search_term != '') {
			api.fetchJobBySearch(this.state.search_term, type, this.state.search_order).then((resp) => {
				this.setState({
					apps_list: resp,
					search_type: type
				});
			});
		} else {
			this.setState({ search_type: type });
		}
	}

	// Handle search order change from user
	handleSearchOrderChange(order) {
		if (this.state.search_term != null && this.state.search_term != '') {
			api.fetchJobBySearch(this.state.search_term, this.state.search_type, order).then((resp) => {
				this.setState({
					apps_list: resp,
					search_order: order
				});
			});
		} else {
			api.fetchAllJobs(order).then((resp) => {
				this.setState({ apps_list: resp, search_order: order });
			});
		}
	}

	// Use diffrent Routes for react based on if the user is authenticated
	render() {
		return (
			<Router>
				{this.state.user_data.user_id && (
					<Header isLoggedIn={this.state.isLoggedIn} user_data={this.state.user_data} />
				)}

				{/* Wait for the applications list and user stats to finish loading */}
				{this.state.user_data.user_id && this.state.apps_list && this.state.user_stats ? (
					<Switch>
						{/* Dashboard route */}
						<Route
							path="/users/dashboard"
							exact
							render={(props) => (
								<Dashboard
									{...props}
									user_data={this.state.user_data}
									user_stats={this.state.user_stats}
									apps_list={this.state.apps_list}
									search_term={this.state.search_term}
									search_type={this.state.search_type}
									search_order={this.state.search_order}
									handleSearch={this.handleSearch.bind(this)}
									handleSearchOrderChange={this.handleSearchOrderChange.bind(this)}
									handleSearchTypeChange={this.handleSearchTypeChange.bind(this)}
								/>
							)}
						/>

						{/* Notes route */}
						<Route
							path="/users/notes"
							exact
							render={(props) => (
								<Notes
									{...props}
									user_data={this.state.user_data}
									apps_list={this.state.apps_list_full}
								/>
							)}
						/>

						{/* Contacts route */}
						<Route
							path="/users/contacts"
							exact
							render={(props) => (
								<Contacts {...props} user_id={this.state.user_id} user_data={this.state.user_data} />
							)}
						/>

						{/* Settings route */}
						<Route
							path="/users/settings"
							render={(props) => <Settings {...props} user_data={this.state.user_data} />}
						/>
					</Switch>
				) : (
					<Switch>
						<Route path="/users/login" exact component={LoginForm} />
						<Route path="/users/register" exact component={RegisterForm} />
						<Route path="/" exact component={StartingPage} />
					</Switch>
				)}
			</Router>
		);
	}
}

export default App;
