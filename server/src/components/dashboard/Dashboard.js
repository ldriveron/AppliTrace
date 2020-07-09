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
		user_stats: this.props.user_stats
	};

	async componentDidMount() {
		document.title = 'Dashboard';
	}

	render() {
		// Set the percentage class to use for percentage equal, drop or gain for the week
		let week_percent_class;
		let week_percent_icon;
		let week_plus_or_minus;
		if (
			this.state.user_stats.last_week_total > this.state.user_stats.total_this_week &&
			this.state.user_stats.difference_between_weeks != 0
		) {
			week_percent_class = 'percent_change percent_drop';
			week_percent_icon = 'chevron-circle-down';
			week_plus_or_minus = '-';
		} else if (
			this.state.user_stats.last_week_total < this.state.user_stats.total_this_week &&
			this.state.user_stats.difference_between_weeks != 0
		) {
			week_percent_class = 'percent_change percent_gain';
			week_percent_icon = 'chevron-circle-up';
			week_plus_or_minus = '+';
		} else if (
			this.state.user_stats.last_week_total == this.state.user_stats.total_this_week ||
			this.state.user_stats.difference_between_weeks == 0
		) {
			week_percent_class = 'percent_change';
			week_percent_icon = 'chevron-circle-right';
			week_plus_or_minus = '';
		}

		// Set the percentage class to use for percentage equal, drop or gain for the month
		let month_percent_class;
		let month_percent_icon;
		let month_plus_or_minus;
		if (
			this.state.user_stats.total_last_month > this.state.user_stats.total_this_month &&
			this.state.user_stats.difference_between_months != 0
		) {
			month_percent_class = 'percent_change percent_drop';
			month_percent_icon = 'chevron-circle-down';
			month_plus_or_minus = '-';
		} else if (
			this.state.user_stats.total_last_month < this.state.user_stats.total_this_month &&
			this.state.difference_between_months != 0
		) {
			month_percent_class = 'percent_change percent_gain';
			month_percent_icon = 'chevron-circle-up';
			month_plus_or_minus = '+';
		} else if (
			this.state.user_stats.total_last_month == this.state.user_stats.total_this_month ||
			this.state.user_stats.difference_between_months == 0
		) {
			month_percent_class = 'percent_change';
			month_percent_icon = 'chevron-circle-right';
			month_plus_or_minus = '';
		}

		// Set the percentage class to use for percentage drop or gain for month

		return (
			<div className="dashboard">
				<WeekView />
				<AddNewJob total_results={this.props.apps_list.total_results} />
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
									defaultValue={this.props.search_term}
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
									<div className="tooltip bottom">
										<div className="type">Total This Week</div>
										<div className="count">{this.state.user_stats.total_this_week}</div>
										<div className={week_percent_class}>
											<span style={{ marginRight: '5px' }}>
												<FontAwesomeIcon icon={week_percent_icon} />
											</span>
											{week_plus_or_minus + this.state.user_stats.difference_between_weeks}%
										</div>
										<span className="tiptext" style={{ marginTop: '5px', marginLeft: '-83px' }}>
											Compared to {this.state.user_stats.last_week_total} last week
										</span>
									</div>
								</div>
								<div className="user_stat">
									<div className="tooltip bottom">
										<div className="type">Total This Month</div>
										<div className="count">{this.state.user_stats.total_this_month}</div>
										<div className={month_percent_class}>
											<span style={{ marginRight: '5px' }}>
												<FontAwesomeIcon icon={month_percent_icon} />
											</span>
											{month_plus_or_minus + this.state.user_stats.difference_between_months}%
										</div>
										<span className="tiptext" style={{ marginTop: '5px', marginLeft: '-83px' }}>
											Compared to {this.state.user_stats.total_last_month} last month
										</span>
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
						<div className="apps_loader" />
					)}
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
	user_id: PropTypes.string,
	user_data: PropTypes.object,
	user_stats: PropTypes.object,
	apps_list: PropTypes.object,
	search_term: PropTypes.string,
	search_type: PropTypes.string,
	search_order: PropTypes.string,
	handleSearch: PropTypes.func,
	handleSearchTypeChange: PropTypes.func,
	handleSearchOrderChange: PropTypes.func
};

export default Dashboard;
