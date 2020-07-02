import React from 'react';
import PropTypes from 'prop-types';

const WeekView = () => {
	// Array to keep the days of the week
	let days = [];

	// Current day data
	let today = new Date();

	// Get the starting day of the month (ex: 1-31)
	let day_number = today.getDate();

	// Get the current month
	let compare_month = today.getMonth();

	// Figure out what week of the month the day is in
	// Considering Sunday as first day of the week
	Date.prototype.week_of_month = function(date) {
		var first_weekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
		if (first_weekday < 0) first_weekday = 6;
		var date_offset = date.getDate() + first_weekday - 2;
		return Math.floor(date_offset / 7);
	};

	// Adjust day_number for beginning of month
	// If the day_number is 6 or less, the day does not land on a sunday, and is during the first week of the month,
	// then day_number needs to be set to the previous month's days
	if (day_number < 7 && today.getDay() != 0 && Date.prototype.week_of_month(today) == 0) {
		// Figure out how many days of the previous month need to be displayed
		let fillInDays = new Date(compare_month + 1 + '/' + '1' + '/' + today.getFullYear()).getDay();
		// If fillInDays equals 7, then the first sunday of the month is lands on day 1
		fillInDays = fillInDays == 7 ? 0 : fillInDays - 1;
		// set day_number at the previous month's total days minus fillInDays
		day_number = new Date(today.getFullYear(), compare_month, 0).getDate() - fillInDays;
	} else {
		// In the case of any week besides the first of the month, begin the day_number count for the first day of the week
		// by substracting the total number of days in the month by the week day number
		day_number = today.getDate() - today.getDay();
		compare_month = today.getMonth() + 1;
	}

	let day_names = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];
	for (let i = 0; i < 7; i++) {
		// Adjust day_number back to start of month after previous month's total days is reached
		if (day_number > new Date(today.getFullYear(), compare_month, 0).getDate()) day_number = 1;

		// Set current_day css class to the current day of the week
		let class_name = today.getDate() == day_number ? ' current_day' : '';

		// Add sunday or saturday class for rounded edges
		if (day_names[i] == 'sunday') {
			class_name = class_name + ' sunday';
		} else if (day_names[i] == 'saturday') {
			class_name = class_name + ' saturday';
		}

		// If the day of the week is not a work day, set off_day class
		days.push(
			<div className={'week_day' + ' ' + class_name} key={day_names[i]}>
				{day_names[i].substring(0, 3).toUpperCase()}
				<div className="day_number">{day_number}</div>
			</div>
		);

		// Continue to the next day
		day_number++;
	}

	return <div className="week_view">{days}</div>;
};

WeekView.propTypes = {};

export default WeekView;
