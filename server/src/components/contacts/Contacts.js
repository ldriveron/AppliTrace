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
		this.loadContacts(this.state.search_term);

		document.title = 'Contacts';
	}

	//Set the contacts search term
	handleContactsSearch(term) {
		if (this.state.search_term != term && /^[a-z0-9]+$/i.test(term) && term != '') {
			this.loadContacts(term);
			this.setState({ search_term: term });
		} else {
			this.loadContacts(null);
			this.setState({ search_term: null });
		}
	}

	loadContacts(term) {
		// Array to hold contacts
		let contacts_to_add = [];

		api.fetchUserContacts(term).then((contacts) => {
			if (contacts.total_results != 0) {
				// Loop through all contacts and add to array
				for (let contact = 0; contact < contacts.results.length; contact++) {
					contacts_to_add.unshift(
						<div
							className="single_contact"
							key={contacts.results[contact].name + contacts.results[contact].phone_number}
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

			this.setState({ contacts: contacts_to_add });
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
	apps_list: PropTypes.object
};

export default Contacts;
