import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components import
import WeekView from '../weekview/WeekView';
import AddNewJob from './addnewjob/AddNewJob';
import ApplicationsList from './applicationslist/ApplicationsList';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dashboard extends Component {
	state = {
		user_data: this.props.user_data,
		total_this_week: 0,
		last_week_total: 0,
		total_this_month: 0,
		total_last_month: 0,
		difference_between_weeks: 0,
		difference_between_months: 0
	};

	componentDidMount() {
		let today = new Date();
		let this_month = today.getMonth() + 1;

		this.calculateWeekanMonthStats(today, this_month);

		document.title = 'Dashboard';
	}

	calculateWeekanMonthStats(today, this_month) {
		// Get the previous occuring Sunday
		let this_week_start = new Date(today.setDate(today.getDate() - today.getDay()));

		// Get the sunday from last week
		let last_week_start = new Date();
		last_week_start.setDate(this_week_start.getDay() - 9);

		// Calculate the last day of the current week (sunday to sunday)
		let week_end = new Date();
		week_end.setDate(this_week_start.getDay() + 4);

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
		for (let app = 0; app < this.props.apps_list.results.length; app++) {
			var application_date = new Date(this.props.apps_list.results[app].date_applied);

			// Count how many applications sent during the current week
			// Exact dates for some reason are not considered qual when using just the Date object
			// Using .toLocalDateString() for those cases
			if (
				(application_date >= this_week_start ||
					application_date.toLocaleDateString() == this_week_start.toLocaleDateString()) &&
				(application_date <= week_end || application_date.toLocaleDateString() == week_end.toLocaleDateString())
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

			// Count how many applications sent during the previous month
			if (application_date.getMonth() + 1 == this_month) {
				this_month_total++;
			}

			if (application_date.getMonth() + 1 == this_month - 1) {
				last_month_total++;
			}
		}

		// Calculate the percentage difference between last week and this week
		let difference_between_weeks = 0;

		difference_between_weeks = (100 *
			Math.abs((last_week_total - this_week_total) / (last_week_total + this_week_total / 2))).toFixed(2);

		// Calculate the percentage difference between last month and this month
		let difference_between_months = 0;

		difference_between_months = (100 *
			Math.abs((last_month_total - this_month_total) / (last_month_total + this_month_total / 2))).toFixed(2);

		this.setState({
			last_week_total: last_week_total,
			total_this_week: this_week_total,
			total_last_month: last_month_total,
			total_this_month: this_month_total,
			difference_between_weeks: difference_between_weeks,
			difference_between_months: difference_between_months
		});
	}

	render() {
		// Set the percentage class to use for percentage equal, drop or gain for the week
		let week_percent_class;
		let week_percent_icon;
		let week_plus_or_minus;
		if (this.state.last_week_total > this.state.total_this_week && this.state.difference_between_weeks != 0) {
			week_percent_class = 'percent_change percent_drop';
			week_percent_icon = 'chevron-circle-down';
			week_plus_or_minus = '-';
		} else if (
			this.state.last_week_total < this.state.total_this_week &&
			this.state.difference_between_weeks != 0
		) {
			week_percent_class = 'percent_change percent_gain';
			week_percent_icon = 'chevron-circle-up';
			week_plus_or_minus = '+';
		} else if (
			this.state.last_week_total == this.state.total_this_week ||
			this.state.difference_between_weeks == 0
		) {
			week_percent_class = 'percent_change';
			week_percent_icon = 'chevron-circle-right';
			week_plus_or_minus = '';
		}

		// Set the percentage class to use for percentage equal, drop or gain for the month
		let month_percent_class;
		let month_percent_icon;
		let month_plus_or_minus;
		if (this.state.total_last_month > this.state.total_this_month && this.state.difference_between_months != 0) {
			month_percent_class = 'percent_change percent_drop';
			month_percent_icon = 'chevron-circle-down';
			month_plus_or_minus = '-';
		} else if (
			this.state.total_last_month < this.state.total_this_month &&
			this.state.difference_between_months != 0
		) {
			month_percent_class = 'percent_change percent_gain';
			month_percent_icon = 'chevron-circle-up';
			month_plus_or_minus = '+';
		} else if (
			this.state.total_last_month == this.state.total_this_month ||
			this.state.difference_between_months == 0
		) {
			month_percent_class = 'percent_change';
			month_percent_icon = 'chevron-circle-right';
			month_plus_or_minus = '';
		}

		// Set the percentage class to use for percentage drop or gain for month

		return (
			<div className="dashboard">
				<WeekView />
				<AddNewJob />
				<div className="in_content">
					{/* Show list of applications when loaded */}
					{/* If the user has not added any applications, then display a message */}
					{/* When there are not application results and the search input is empty, then that means
					    the user has no applications added */}
					{this.props.apps_list ? this.props.apps_list.total_results == 0 &&
					(this.props.search_term == null || this.props.search_term == '') ? (
						<div className="empty_apps_list">Add applications to track</div>
					) : (
						<div id="apps">
							<div className="search_holder">
								<input
									className="search_input"
									type="text"
									name="search_term"
									id="search_term"
									placeholder="Search applications..."
									onChange={(term) => this.props.handleSearch(term.target.value)}
								/>
								<select
									className="search_type"
									name="search_type"
									id="search_type"
									value={this.props.search_type}
									onChange={(e) => this.props.handleSearchTypeChange(e.target.value)}
								>
									<option key="all" value="all">
										All
									</option>
									<option key="status" value="status">
										Status
									</option>
									<option key="title" value="title">
										Position Title
									</option>
									<option key="company_name" value="company_name">
										Company Name
									</option>
									<option key="location" value="location">
										Location
									</option>
								</select>
								<select
									className="search_type"
									name="search_order"
									id="search_order"
									value={this.props.search_order}
									onChange={(e) => this.props.handleSearchOrderChange(e.target.value)}
								>
									<option key="date_added" value="-date_added">
										Date Added
									</option>
									<option key="date_applied" value="date_applied">
										Date Applied
									</option>
									<option key="company_name" value="company_name">
										Company Name
									</option>
									<option key="source" value="source">
										Source
									</option>
								</select>
							</div>

							{/* User Stats */}

							<div className="user_stats_holder">
								<div className="user_stat">
									<div className="type">Total Applications</div>
									<div className="count">{this.props.user_data.job_applications_total}</div>
									<div className="percent_change">Since {this.props.user_data.joindate}</div>
								</div>
								<div className="user_stat">
									<div className="type">Total This Week</div>
									<div className="count">{this.state.total_this_week}</div>
									<div className={week_percent_class}>
										<span style={{ marginRight: '5px' }}>
											<FontAwesomeIcon icon={week_percent_icon} />
										</span>
										{week_plus_or_minus + this.state.difference_between_weeks}%
									</div>
								</div>
								<div className="user_stat">
									<div className="type">Total This Month</div>
									<div className="count">{this.state.total_this_month}</div>
									<div className={month_percent_class}>
										<span style={{ marginRight: '5px' }}>
											<FontAwesomeIcon icon={month_percent_icon} />
										</span>
										{month_plus_or_minus + this.state.difference_between_months}%
									</div>
								</div>
							</div>

							{/* If the search input is not empty and total results is 0, then the search came back empty */}
							{(this.props.search_term != null || this.props.search_term != '') &&
							this.props.apps_list.total_results == 0 ? (
								<div className="empty_apps_list">
									No applications found using the term '{this.props.search_term}'
								</div>
							) : (
								<ApplicationsList list={this.props.apps_list} search_term={this.props.search_term} />
							)}
						</div>
					) : (
						<div className="month_loader" />
					)}
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
	user_id: PropTypes.string,
	user_data: PropTypes.object,
	apps_list: PropTypes.object,
	search_term: PropTypes.string,
	search_type: PropTypes.string,
	search_order: PropTypes.string,
	handleSearch: PropTypes.func,
	handleSearchTypeChange: PropTypes.func,
	handleSearchOrderChange: PropTypes.func
};

export default Dashboard;
