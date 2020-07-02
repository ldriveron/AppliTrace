import React from 'react';
import PropTypes from 'prop-types';

const EditPrivacy = (props) => {
	document.title = 'Edit Privacy';

	return (
		<div>
			<form action="/api/userdata/editprivacy" method="POST">
				<div className="panel_title">Edit Privacy</div>
				{props.account_private == true ? (
					'Make your profile public and job search public to other users.'
				) : (
					'Make your profile private and job search hidden from other users.'
				)}
				<br />
				<br />
				<div>
					<button type="submit" className="formButton">
						{props.account_private == true ? 'Unprivate Overview' : 'Private Overview'}
					</button>
				</div>
			</form>
		</div>
	);
};

EditPrivacy.propTypes = {
	account_private: PropTypes.bool
};

export default EditPrivacy;
