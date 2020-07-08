import React from 'react';
import { NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import components
import WeekView from '../weekview/WeekView';
import EditProfile from './EditProfile';
import EditPrivacy from './EditPrivacy';
import EditPassword from './EditPassword';
import DeleteAccount from './DeleteAccount';

const Settings = (props) => {
	let username = props.user_data.username;
	let industry = props.user_data.industry;
	let occupation = props.user_data.occupation;
	let region = props.user_data.region;
	let country = props.user_data.country;
	let account_private = props.user_data.private;

	return (
		<div className="settings">
			<WeekView />
			<div className="in_content left_padding">
				<div className="page_title">Settings</div>
				<Router>
					<div className="settings_links">
						<NavLink key="edit_profile" to="/users/settings/profile" activeClassName="active_link">
							<div className="link middle_link">Edit Profile</div>
						</NavLink>

						<NavLink key="edit_privacy" to="/users/settings/privacy" activeClassName="active_link">
							<div className="link middle_link">Edit Privacy</div>
						</NavLink>

						<NavLink key="edit_password" to="/users/settings/password" activeClassName="active_link">
							<div className="link middle_link">Edit Password</div>
						</NavLink>

						<NavLink key="delete_account" to="/users/settings/delete" activeClassName="active_link">
							<div className="link middle_link">Delete Account</div>
						</NavLink>
					</div>
					<div className="settings_form_holder" style={{ margin: '0px 0px', width: '80%' }}>
						<Switch>
							{/* Edit Profile Route */}
							<Route
								path="/users/settings/profile"
								exact
								render={(props) => (
									<EditProfile
										{...props}
										username={username}
										industry={industry}
										occupation={occupation}
										region={region}
										country={country}
									/>
								)}
							/>

							{/* Edit Privacy Route */}
							<Route
								path="/users/settings/privacy"
								exact
								render={(props) => <EditPrivacy {...props} account_private={account_private} />}
							/>

							{/* Edit Password Route */}
							<Route
								path="/users/settings/password"
								exact
								render={(props) => <EditPassword {...props} />}
							/>

							{/* Delete Profile Route */}
							<Route
								path="/users/settings/delete"
								exact
								render={(props) => <DeleteAccount {...props} username={username} />}
							/>
						</Switch>
					</div>
				</Router>
			</div>
		</div>
	);
};

Settings.propTypes = {
	user_data: PropTypes.object
};

export default Settings;
