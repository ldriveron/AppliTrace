import React, { useState } from 'react';
import PropTypes from 'prop-types';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import components
import EditApplication from './EditApplication';

const ApplicationsList = (props) => {
	let [ selectedApp, setSelectedApp ] = useState(null);

	// Array to keep the days of the week
	let apps = [];

	let app_number = 0;

	// Loop through the object containing the applications
	// Add each application to the apps array
	for (let app = 0; app < props.list.results.length; app++) {
		// Increase app number because inserting application to array
		app_number++;

		apps.push(
			<div
				className="app_holder mouse_pointer"
				key={props.list.results[app].company_name + props.list.results[app].title}
				onClick={() => {
					setSelectedApp(props.list.results[app]);
				}}
			>
				<div className="app">
					<div className={'company_name'}>
						<div className={'source_circle ' + props.list.results[app].source}>
							{props.list.results[app].source.substring(0, 1)}
						</div>
						<span style={{ marginLeft: '20px' }}>{app_number}</span>
						<br />
						<span style={{ marginLeft: '20px' }}>
							{props.list.results[app].company_name.length > 20 ? (
								props.list.results[app].company_name.substring(0, 20) + '...'
							) : (
								props.list.results[app].company_name
							)}
						</span>
					</div>
					<div className="info_holder">
						<div className="info">
							<div className="label">Position Title</div>
							<div className="app_number">
								{props.list.results[app].title.length > 25 ? (
									props.list.results[app].title.substring(0, 25) + '...'
								) : (
									props.list.results[app].title
								)}
							</div>
						</div>
						<div className="info" style={{ width: '100%' }}>
							<div className="label">Source</div>
							<div className="app_number">{props.list.results[app].source}</div>
						</div>
						<div className="info" style={{ width: '40%' }}>
							<div className="label">Date Applied</div>
							<div className="app_number">{props.list.results[app].date_applied}</div>
						</div>
						<div className="info" style={{ width: '40%' }}>
							<div className="label">Date Added</div>
							<div className="app_number">{props.list.results[app].date_added}</div>
						</div>
						<div className="info" style={{ width: '100%' }}>
							<div className="label">Location</div>
							<div className="app_number">{props.list.results[app].location}</div>
						</div>
						<div className={'status ' + props.list.results[app].status}>
							{props.list.results[app].status}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Return the applications list in the component
	return selectedApp == null ? (
		<div className="apps_list">{apps}</div>
	) : (
		<div>
			<div className="app_edit_button_holder">
				<div className="close_button" onClick={() => setSelectedApp(null)}>
					Close
				</div>
				<form
					action={'/api/userdata/deletejob/' + selectedApp._id.toString()}
					method="POST"
					style={{ width: '20%', margin: '0 0' }}
				>
					<button className="delete_button">Delete Application</button>
				</form>
			</div>
			<EditApplication application={selectedApp} />
		</div>
	);
};

ApplicationsList.propTypes = {
	list: PropTypes.object,
	search_term: PropTypes.string
};

export default ApplicationsList;
