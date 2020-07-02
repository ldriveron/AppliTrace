import React, { Component } from 'react';
import PropTypes from 'prop-types';

// API methods import
import * as api from '../../api';

// Components import
import CurrentDay from './today/CurrentDay';
import WeekView from '../weekview/WeekView';
import AddNewJob from './addnewjob/AddNewJob';
import ApplicationsList from './applicationslist/ApplicationsList';

class Dashboard extends Component {
	state = {
		user_data: this.props.user_data,
		current_hour: 0
	};

	componentDidMount() {
		// Update state with current date class and hour
		let today = new Date();

		// Fetch all of the users applications and set the state
		api.fetchAllJobs().then((resp) => {
			this.setState({
				apps_list: resp,
				current_hour: today.getHours
			});
		});

		document.title = 'Dashboard';
	}

	render() {
		return (
			<div className="dashboard">
				<WeekView />
				<AddNewJob />
				<div className="in_content">
					{/* <CurrentDay
					disableSatisSetter={this.disableSatisSetter.bind(this)}
					work_days={this.state.user_data.work_days}
					user_works_today={this.state.user_works_today}
					last_report_date={this.state.user_data.last_report_date}
					work_end_hour={this.state.user_data.work_end_hour}
					day_is_set={this.state.display_satis_setter}
					work_paused={this.state.user_data.work_paused}
				/> */}

					{/* Show list of applications when loaded */}
					{/* If the user has not added any applications, then display a message */}
					{this.state.apps_list ? this.state.apps_list.total_results == 0 ? (
						<div className="empty_apps_list">Add applications to track with the links above</div>
					) : (
						<ApplicationsList list={this.state.apps_list} />
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
	user_data: PropTypes.object
};

export default Dashboard;
