import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = (props) => {
	let userLinks = [];

	let current_hour = new Date().getHours();

	// Select a day of time greeting
	let greeting = '';
	if (current_hour >= 0 && current_hour <= 11) {
		greeting = 'Good morning,';
	} else if (current_hour >= 12 && current_hour <= 17) {
		greeting = 'Good afternoon,';
	} else if (current_hour >= 18 && current_hour <= 23) {
		greeting = 'Good evening,';
	}

	userLinks.push(
		<div key="header" className="topnav" id="myTopnav">
			<div className="applitrace_logo">
				<a href="/">AppliTrace</a>
			</div>

			<div className="username">
				<span className="greeting">{greeting}</span>
				<br />
				{props.user_data.username}
				<div className="occupation_text">{props.user_data.occupation}</div>
			</div>

			<NavLink key="dashboard" to="/users/dashboard" className="links_holder" activeClassName="link_active">
				<span className="link_icon">
					<FontAwesomeIcon icon="stream" />
				</span>
				<span className="link_name">Dashboard</span>
			</NavLink>
			<NavLink key="notes" to="/users/notes" className="links_holder" activeClassName="link_active">
				<span className="link_icon">
					<FontAwesomeIcon icon="sticky-note" />
				</span>
				<span className="link_name">Notes</span>
			</NavLink>
			<NavLink key="contacts" to="/users/contacts" className="links_holder" activeClassName="link_active">
				<span className="link_icon">
					<FontAwesomeIcon icon="id-badge" />
				</span>
				<span className="link_name">Contacts</span>
			</NavLink>
			<NavLink key="events" to="/users/events" className="links_holder" activeClassName="link_active">
				<span className="link_icon">
					<FontAwesomeIcon icon="calendar" />
				</span>
				<span className="link_name">Events</span>
			</NavLink>
			<NavLink key="settings" to="/users/settings/profile" className="links_holder" activeClassName="link_active">
				<span className="link_icon">
					<FontAwesomeIcon icon="sliders-h" />
				</span>
				<span className="link_name">Settings</span>
			</NavLink>

			<form key="logout" action="/users/logout" method="POST">
				<button type="submit" className="logout_button">
					<span className="link_icon">
						<FontAwesomeIcon icon="sign-out-alt" />
					</span>
					<span className="link_name">Logout</span>
				</button>
			</form>
		</div>
	);

	return userLinks;
};

Header.propTypes = {
	isLoggedIn: PropTypes.bool,
	user_data: PropTypes.object
};

export default Header;
