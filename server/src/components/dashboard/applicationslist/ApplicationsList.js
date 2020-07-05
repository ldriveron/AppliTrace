import React from 'react';
import PropTypes from 'prop-types';

const ApplicationsList = (props) => {
	// Array to keep the days of the week
	let apps = [];

	let app_number = 0;

	// Loop through the object containing the applications
	// Add each application to the apps array
	for (let app = 0; app < props.list.results.length; app++) {
		// Increase app number because inserting application to array
		app_number++;

		apps.push(
			<div className="app_holder" key={props.list.results[app].company_name + props.list.results[app].title}>
				<div className="app">
					<div className={'company_name ' + props.list.results[app].source}>
						<span style={{ marginLeft: '20px' }}>{app_number}</span>
						<br />
						<span style={{ marginLeft: '20px' }}>{props.list.results[app].company_name}</span>
					</div>
					<div className="info">
						<div className="label">Status</div>
						<div className="app_number">{props.list.results[app].status}</div>
					</div>
					<div className="info">
						<div className="label">Position Title</div>
						<div className="app_number">
							{props.list.results[app].title.length > 40 ? (
								props.list.results[app].title.substring(0, 40) + '...'
							) : (
								props.list.results[app].title
							)}
						</div>
					</div>
					<div className="info">
						<div className="label">Date Applied</div>
						<div className="app_number">{props.list.results[app].date_applied}</div>
					</div>
					<div className="info">
						<div className="label">Source</div>
						<div className="app_number">{props.list.results[app].source}</div>
					</div>
					<div className="info">
						<div className="label">Date Added</div>
						<div className="app_number">{props.list.results[app].date_added}</div>
					</div>
				</div>
			</div>
		);
	}

	// Return the applications list in the component
	return <div className="apps_list">{apps}</div>;
};

ApplicationsList.propTypes = {
	list: PropTypes.object,
	search_term: PropTypes.string
};

export default ApplicationsList;
