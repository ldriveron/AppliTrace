import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components import
import WeekView from '../weekview/WeekView';
import AddContact from './AddContact';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// API methods import
import * as api from '../../api';
import { faBuilding, faPhoneAlt, faMapPin, faAt } from '@fortawesome/free-solid-svg-icons';

class Contacts extends Component {
	state = {
		user_data: this.props.user_data,
		search_term: null,
		contacts: [],
		current_view: 'view_all'
	};

	componentDidMount() {
		//this.loadContacts(this.state.search_term);

		let contacts_from_apps = this.loadContactsFromApps();

		this.loadContacts(contacts_from_apps, null);

		document.title = 'Contacts';
	}

	//Set the contacts search term
	handleContactsSearch(term) {
		if (this.state.search_term != term && /^[a-z0-9]+$/i.test(term) && term != '') {
			//this.loadContacts(term);
			//this.setState({ search_term: term });

			let contacts_from_apps = this.loadContactsFromApps(term);
			this.loadContacts(contacts_from_apps, term);
		} else {
			//this.loadContacts(null);
			//this.setState({ search_term: null });
			let contacts_from_apps = this.loadContactsFromApps(null);
			this.loadContacts(contacts_from_apps, null);
		}
	}

	loadContactsFromApps(term) {
		// Array to hold contacts
		let contacts_to_add = [];

		// Loop through all applications if the apps_list is not empty
		if (this.props.apps_list_full.total_results != 0) {
			for (let app = 0; app < this.props.apps_list_full.results.length; app++) {
				// Only add to contacts list from application if recruiter name, company name, location, phone number,
				// and email address are included
				if (
					this.props.apps_list_full.results[app].recruiter_name != '' &&
					this.props.apps_list_full.results[app].company_name != '' &&
					this.props.apps_list_full.results[app].location != '' &&
					this.props.apps_list_full.results[app].phone_number != '' &&
					this.props.apps_list_full.results[app].email_address != ''
				) {
					// If the term is not null, then compare the contact to the search term
					// If there is a match, then add it to the contacts list
					// If there no search term, then just set if statement to true
					if (
						term != null
							? new RegExp(term, 'i').test(this.props.apps_list_full.results[app].recruiter_name) ||
								new RegExp(term, 'i').test(this.props.apps_list_full.results[app].company_name) ||
								new RegExp(term, 'i').test(this.props.apps_list_full.results[app].location) ||
								new RegExp(term, 'i').test(this.props.apps_list_full.results[app].phone_number) ||
								new RegExp(term, 'i').test(this.props.apps_list_full.results[app].email_address)
							: true
					) {
						contacts_to_add.unshift(
							<div
								className="single_contact"
								key={
									this.props.apps_list_full.results[app]._id
								}
							>
								<div className="contact_name">
									<div className="name_circle">
										{this.props.apps_list_full.results[app].recruiter_name.substring(0, 1)}
									</div>
									<span style={{ marginLeft: '20px' }}>
										{this.props.apps_list_full.results[app].recruiter_name}
									</span>
								</div>
								<div className="contact_details">
									<FontAwesomeIcon icon={faBuilding} />
									<span className="detail_text">
										{this.props.apps_list_full.results[app].company_name}
									</span>
									<br />
									<br />
									<FontAwesomeIcon icon={faPhoneAlt} />
									<span className="detail_text">
										{this.props.apps_list_full.results[app].phone_number}
									</span>
									<br />
									<br />
									<FontAwesomeIcon icon={faMapPin} />
									<span className="detail_text">
										{this.props.apps_list_full.results[app].location}
									</span>
									<br />
									<br />
									<FontAwesomeIcon icon={faAt} />
									<span className="detail_text">
										{this.props.apps_list_full.results[app].email_address}
									</span>
								</div>
							</div>
						);
					}
				}
			}
		}

		return contacts_to_add;
	}

	loadContacts(contacts_from_apps, term) {
		// Array to hold contacts
		let contacts_to_add = [];

		api.fetchUserContacts(term).then((contacts) => {
			if (contacts.total_results != 0) {
				// Loop through all contacts and add to array
				for (let contact = 0; contact < contacts.results.length; contact++) {
					contacts_to_add.unshift(
						<div
							className="single_contact"
							key={contacts.results[contact]._id}
						>
							<div className="contact_name">
								<div className="name_circle">{contacts.results[contact].name.substring(0, 1)}</div>
								<span style={{ marginLeft: '20px', marginTop: '10px' }}>
									{contacts.results[contact].name}
								</span>
								<form
									action={'/api/userdata/deletecontact/' + contacts.results[contact]._id}
									method="POST"
								>
									<button className="delete_contact_button">Delete</button>
								</form>
							</div>
							<div className="contact_details">
								<FontAwesomeIcon icon={faBuilding} />
								<span className="detail_text">{contacts.results[contact].associated_company}</span>
								<br />
								<br />
								<FontAwesomeIcon icon={faPhoneAlt} />
								<span className="detail_text">{contacts.results[contact].phone_number}</span>
								<br />
								<br />
								<FontAwesomeIcon icon={faMapPin} />
								<span className="detail_text">{contacts.results[contact].location}</span>
								<br />
								<br />
								<FontAwesomeIcon icon={faAt} />
								<span className="detail_text">{contacts.results[contact].email_address}</span>
							</div>
						</div>
					);
				}
			}

			this.setState({ contacts: contacts_from_apps.concat(contacts_to_add) });
		});
	}

	render() {
		return (
			<div className="dashboard">
				<WeekView />
				<div className="in_content" style={{ height: '100%' }}>
					<div className="contacts_compontent">
						{/* Search input for contacts */}
						<input
							className="search_contacts_input"
							type="text"
							name="search_contacts_term"
							id="search_contacts_term"
							placeholder="Search contacts"
							onChange={(term) => this.handleContactsSearch(term.target.value)}
						/>

						{/* New contact button */}
						{/* Clicking this will change the current_view state to either add_contact or view_all */}
						<div
							className="add_contact_button"
							onClick={() => {
								this.state.current_view == 'view_all'
									? this.setState({ current_view: 'add_contact' })
									: this.setState({ current_view: 'view_all' });
							}}
						>
							+ New Contact
						</div>

						{/* If the user has no contacts, then say no contacts found, else show the list of contacts */}
						{this.state.current_view == 'view_all' ? this.state.contacts.length == 0 ? (
							<div className="empty_contacts">No contacts found</div>
						) : (
							<div className="contacts_list">{this.state.contacts}</div>
						) : (
							// Show this component if the user selects to add a contact
							<div className="contacts_list">
								<div className="add_contact">
									<AddContact />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

Contacts.propTypes = {
	user_id: PropTypes.string,
	user_data: PropTypes.object,
	apps_list_full: PropTypes.object
};

export default Contacts;
