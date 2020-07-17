import React, { useState } from 'react';
import PropTypes from 'prop-types';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Edit application component
import EditApplication from './EditApplication';

const SingleApplication = (props) => {
	// Return the applications list in the component
	return (
		<div className="apps_list">
			<div
				className="app_holder"
				style={{ width: '90%', margin: '0 auto' }}
				key={props.application.company_name + props.application.title}
			>
				<div className="app">
					<div className={'company_name'}>
						<div
							className={'source_circle mouse_pointer ' + props.application.source}
							onClick={() => props.setSelectedApp(null)}
						>
							<FontAwesomeIcon icon="times-circle" />
						</div>
						<span style={{ marginLeft: '20px' }}>{props.application.company_name}</span>
					</div>
					<div className="info_holder">
						<div className="info">
							<div className="label">Position Title</div>
							<div className="app_number">{props.application.title}</div>
						</div>
						<div className="info">
							<div className="label">Source</div>
							<div className="app_number">{props.application.source}</div>
						</div>
						<div className="info" style={{ width: '100%' }}>
							<div className="label">Date Applied</div>
							<div className="app_number">{props.application.date_applied}</div>
						</div>
						<div className="info" style={{ width: '100%' }}>
							<div className="label">Location</div>
							<div className="app_number">{props.application.location}</div>
						</div>
						<div className="info">
							<div className="label">Date Added</div>
							<div className="app_number">{props.application.date_added}</div>
						</div>
						<div className="status">{props.application.status}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

SingleApplication.propTypes = {
	application: PropTypes.object,
	setSelectedApp: PropTypes.func
};

export default SingleApplication;
