import React from 'react';
import PropTypes from 'prop-types';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserStats = (props) => {
	let today = new Date();
	let this_month = today.getMonth() == 11 ? 1 : today.getMonth() + 1;

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

	let total_applied = 0;
	let total_viewed = 0;
	let total_under_review = 0;
	let total_contacted = 0;
	let total_screening_interview = 0;
	let total_technical_interview = 0;
	let total_offer = 0;
	let total_rejected = 0;
	let total_declined_offer = 0;

	// Loop through all applications
	if (props.apps_list_full.total_results != 0) {
		for (let app = 0; app < props.apps_list_full.results.length; app++) {
			var application_date = new Date(props.apps_list_full.results[app].date_applied);

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

			switch (props.apps_list_full.results[app].status) {
				case 'Applied':
					total_applied++;
					break;
				case 'Viewed':
					total_viewed++;
					break;
				case 'Under Review':
					total_under_review++;
					break;
				case 'Contacted':
					total_contacted++;
					break;
				case 'Screening Interview':
					total_screening_interview++;
					break;
				case 'Technical Interview':
					total_technical_interview++;
					break;
				case 'Offer':
					total_offer++;
					break;
				case 'Rejected':
					total_rejected++;
					break;
				case 'Declined Offer':
					total_declined_offer++;
					break;
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

	// Set the percentage class to use for percentage equal, drop or gain for the week
	// This changes the color of the percentage to either red or green
	// Also change the FontAwesome icon used
	let week_percent_class;
	let week_percent_icon;
	let week_plus_or_minus = '';
	if (last_week_total > this_week_total && difference_between_weeks != 0) {
		week_percent_class = 'percent_change percent_drop';
		week_percent_icon = 'chevron-circle-down';
		week_plus_or_minus = '-';
	} else if (last_week_total < this_week_total && difference_between_weeks != 0) {
		week_percent_class = 'percent_change percent_gain';
		week_percent_icon = 'chevron-circle-up';
		week_plus_or_minus = '+';
	} else if (last_week_total == this_week_total || difference_between_weeks == 0) {
		week_percent_class = 'percent_change';
		week_percent_icon = 'chevron-circle-right';
		week_plus_or_minus = '';
	}

	// Set the percentage class to use for percentage equal, drop or gain for the month
	// This changes the color of the percentage to either red or green
	// Also change the FontAwesome icon used
	let month_percent_class;
	let month_percent_icon;
	let month_plus_or_minus;
	if (last_month_total > this_month_total && difference_between_months != 0) {
		month_percent_class = 'percent_change percent_drop';
		month_percent_icon = 'chevron-circle-down';
		month_plus_or_minus = '-';
	} else if (last_month_total < this_month_total && difference_between_months != 0) {
		month_percent_class = 'percent_change percent_gain';
		month_percent_icon = 'chevron-circle-up';
		month_plus_or_minus = '+';
	} else if (last_month_total == this_month_total || difference_between_months == 0) {
		month_percent_class = 'percent_change';
		month_percent_icon = 'chevron-circle-right';
		month_plus_or_minus = '';
	}

	return (
		<div className="user_stats_holder">
			<div className="user_stats_compare">
				<div className="user_stat">
					<div className="type">Total Applications</div>
					<div className="count">{props.user_applications_total}</div>
					<div className="percent_change">Since {props.user_join_date}</div>
				</div>
				<div className="user_stat">
					<div className="tooltip bottom">
						<div className="type">Total This Week</div>
						<div className="count">{this_week_total}</div>
						<div className={week_percent_class}>
							<span style={{ marginRight: '5px' }}>
								<FontAwesomeIcon icon={week_percent_icon} />
							</span>
							{week_plus_or_minus + difference_between_weeks}%
						</div>
						<span className="tiptext" style={{ marginTop: '5px', marginLeft: '-83px' }}>
							Compared to {last_week_total} last week
						</span>
					</div>
				</div>
				<div className="user_stat">
					<div className="tooltip bottom">
						<div className="type">Total This Month</div>
						<div className="count">{this_month_total}</div>
						<div className={month_percent_class}>
							<span style={{ marginRight: '5px' }}>
								<FontAwesomeIcon icon={month_percent_icon} />
							</span>
							{month_plus_or_minus + difference_between_months}%
						</div>
						<span className="tiptext" style={{ marginTop: '5px', marginLeft: '-83px' }}>
							Compared to {last_month_total} last month
						</span>
					</div>
				</div>
			</div>
			<div className="user_stats_compare">
				<div className="status_total">
					<span className="status_name">Applied</span>
					<div className="status_number">{total_applied}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Viewed</div>
					<div className="status_number">{total_viewed}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Review</div>
					<div className="status_number">{total_under_review}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Contacted</div>
					<div className="status_number">{total_contacted}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Screening</div>
					<div className="status_number">{total_screening_interview}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Technical</div>
					<div className="status_number">{total_technical_interview}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Offer</div>
					<div className="status_number">{total_offer}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Rejected</div>
					<div className="status_number">{total_rejected}</div>
				</div>
				<div className="status_total">
					<div className="status_name">Declined</div>
					<div className="status_number">{total_declined_offer}</div>
				</div>
			</div>
		</div>
	);
};

UserStats.propTypes = {
	apps_list_full: PropTypes.object,
	user_applications_total: PropTypes.number,
	user_join_date: PropTypes.string
};

export default UserStats;
