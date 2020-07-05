import React, { useState } from 'react';
import NewJobFormManual from './NewJobFormManual';
import NewJobFormExternal from './NewJobFormExternal';

const AddNewJob = () => {
	// Use this state to keep track of the job type the user selects
	let [ jobType, setJobType ] = useState(null);

	// Use this state variable to change the required url regular expression
	let [ urlregex, setUrlRegex ] = useState(new RegExp());

	// Close the form if one is currently open
	// Also hide applications list div when adding a new application
	function setClose() {
		if (jobType != null) {
			setJobType(null);
			document.getElementById('apps').style.display = 'initial';
		} else {
			document.getElementById('apps').style.display = 'none';
		}
	}

	// Use the current day as the intial value for Date Applied
	let date = new Date();

	// Add 0 in front of month or day if needed
	let initialDate =
		(date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
		'/' +
		(date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
		'/' +
		date.getFullYear();

	let content = (
		<div style={{ width: '100%' }}>
			<div className="add_new_job">
				<div
					className="job_type"
					onClick={() => {
						setJobType('manual'), setClose();
					}}
				>
					<div className="job_circle normal">+</div>
					<div className="job_text">Manually</div>
				</div>

				<div
					className="job_type"
					onClick={() => {
						setJobType('Indeed'),
							setUrlRegex(
								new RegExp(
									/https:\/\/(www\.)?indeed\.com([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))?/gi
								)
							),
							setClose();
					}}
				>
					<div className="job_circle indeed">+</div>
					<div className="job_text">Indeed</div>
				</div>

				{/* Hiding LinkedIn option for now <div
					className="job_type"
					onClick={() => {
						setJobType('LinkedIn'),
							setUrlRegex(
								new RegExp(
									/https:\/\/(www\.)?linkedin\.com([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))?/gi
								)
							),
							setClose();
					}}
				>
					<div className="job_circle linkedin">+</div>
					<div className="job_text">LinkedIn</div>
				</div> */}

				<div
					className="job_type"
					onClick={() => {
						setJobType('ZipRecruiter'),
							setUrlRegex(
								new RegExp(
									/https:\/\/(www\.)?ziprecruiter\.com([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))?/gi
								)
							),
							setClose();
					}}
				>
					<div className="job_circle ziprecruiter">+</div>
					<div className="job_text">ZipRecruiter</div>
				</div>

				<div
					className="job_type"
					onClick={() => {
						setJobType('Snagajob'),
							setUrlRegex(
								new RegExp(
									/https:\/\/(www\.)?snagajob\.com([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))?/gi
								)
							),
							setClose();
					}}
				>
					<div className="job_circle snagajob">+</div>
					<div className="job_text">snagajob</div>
				</div>
			</div>
			<div style={{ width: '100%' }}>
				{jobType == 'manual' && <NewJobFormManual initialDate={initialDate} />}
				{jobType != 'manual' && jobType != null && <NewJobFormExternal source={jobType} urlregex={urlregex} />}
			</div>
		</div>
	);

	return content;
};

AddNewJob.propTypes = {};

export default AddNewJob;
