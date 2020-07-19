import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components import
import WeekView from '../weekview/WeekView';
import AddNewJob from './addnewjob/AddNewJob';
import Search from './Search';
import UserStats from './UserStats';
import ApplicationsList from './applicationslist/ApplicationsList';

class Dashboard extends Component {
	state = {
		user_data: this.props.user_data,
		apps_list: this.props.apps_list,
		apps_list_full: this.props.apps_list_full
	};

	async componentDidMount() {
		document.title = 'Dashboard';
	}

	render() {
		return (
			<div className="dashboard">
				<WeekView />
				<AddNewJob total_results={this.state.apps_list_full.total_results} />
				<div className="in_content">
					{/* Show list of applications when loaded */}
					{/* If the user has not added any applications, then display a message */}
					{/* When there are no application results and the search input is empty, then that means
					    the user has no applications added */}
					{this.props.apps_list_full ? this.state.apps_list_full.total_results == 0 &&
					(this.props.search_term == null || this.props.search_term == '') ? (
						<div className="empty_apps_list">Add applications to track</div>
					) : (
						<div id="apps">
							{/* Search Component */}

							<Search
								search_term={this.props.search_term}
								search_type={this.props.search_type}
								search_order={this.props.search_order}
								handleSearch={this.props.handleSearch.bind(this)}
								handleSearchTypeChange={this.props.handleSearchTypeChange.bind(this)}
								handleSearchOrderChange={this.props.handleSearchOrderChange.bind(this)}
							/>

							{/* User Stats Component */}
							{/* User Stats uses the apps_list_full object to calculate the user statistics */}
							<UserStats
								apps_list_full={this.props.apps_list_full}
								user_applications_total={this.state.user_data.job_applications_total}
								user_join_date={this.state.user_data.joindate}
							/>

							{/* If the search input is not empty and total results is 0, then the search came back empty */}
							{/* ApplicationsList uses the apps_list object that changes depending on user search */}
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
	apps_list: PropTypes.object,
	apps_list_full: PropTypes.object,
	search_term: PropTypes.string,
	search_type: PropTypes.string,
	search_order: PropTypes.string,
	handleSearch: PropTypes.func,
	handleSearchTypeChange: PropTypes.func,
	handleSearchOrderChange: PropTypes.func
};

export default Dashboard;
