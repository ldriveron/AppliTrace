import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components import
import WeekView from '../weekview/WeekView';
import AddNote from './AddNote';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// API methods import
import * as api from '../../api';

class Notes extends Component {
	state = {
		user_data: this.props.user_data,
		selected_note: null,
		search_term: null,
		notes: [],
		current_view: 'view_notes'
	};

	componentDidMount() {
		// Call function to load notes from applications
		let app_notes = this.loadNotesFromApps();
		// Call function to load single submitted notes
		this.loadSingleNotes(app_notes, null);

		document.title = 'Notes';
	}

	//Set the notes search term
	handleNotesSearch(term) {
		if (this.state.search_term != term && /^[a-z0-9]+$/i.test(term)) {
			let app_notes = this.loadNotesFromApps(term);
			this.loadSingleNotes(app_notes, term);
		} else if (term == '') {
			let app_notes = this.loadNotesFromApps(null);
			this.loadSingleNotes(app_notes, null);
		}
	}

	loadNotesFromApps(term) {
		// Array to hold notes
		let notes_to_add = [];

		// Loop through all notes and add to side scroll bar
		for (let app = 0; app < this.props.apps_list.results.length; app++) {
			if (
				term != null
					? new RegExp(term, 'i').test(this.props.apps_list.results[app].notes)
					: this.props.apps_list.results[app].notes != '' && this.props.apps_list.results[app].notes != null
			) {
				notes_to_add.unshift(
					<div
						className="single_note"
						onClick={() =>
							this.setSelectedNote({
								company_name: this.props.apps_list.results[app].company_name,
								title: this.props.apps_list.results[app].title,
								note: this.props.apps_list.results[app].notes,
								date: this.props.apps_list.results[app].date_applied,
								from: 'apps'
							})}
						key={
							this.props.apps_list.results[app].company_name +
							this.props.apps_list.results[app].date_applied
						}
					>
						<div className="note_title">{this.props.apps_list.results[app].company_name}</div>
						<div className="notes_short_text">
							{this.props.apps_list.results[app].notes.length > 30 ? (
								this.props.apps_list.results[app].notes.substring(0, 30) + '...'
							) : (
								this.props.apps_list.results[app].notes
							)}
						</div>
					</div>
				);
			}
		}

		return notes_to_add;
	}

	loadSingleNotes(appnotes, term) {
		// Array to hold notes
		let notes_to_add = [];

		// Fetch all user notes from API
		api.fetchUserNotes(term).then((notes) => {
			if (notes.total_results != 0) {
				// Loop through all notes and add to side scroll bar
				for (let note = 0; note < notes.results.length; note++) {
					notes_to_add.unshift(
						<div
							className="single_note"
							onClick={() =>
								this.setSelectedNote({
									id: notes.results[note]._id,
									title: notes.results[note].title,
									date: notes.results[note].date_added,
									note: notes.results[note].note,
									from: 'notes'
								})}
							key={notes.results[note].title + notes.results[note].date_added}
						>
							<div className="note_title">{notes.results[note].title}</div>
							<div className="notes_short_text">
								{notes.results[note].note.length > 30 ? (
									notes.results[note].note.substring(0, 30) + '...'
								) : (
									notes.results[note].note
								)}
							</div>
						</div>
					);
				}
			}
			// Set the state with all compiled notes from applications and single submittes notes
			this.setState({ notes: appnotes.concat(notes_to_add) });
		});
	}

	setSelectedNote(info) {
		// Set a single selected app to display
		this.setState({ selected_note: info, current_view: 'view_notes' });
	}

	render() {
		return (
			<div className="dashboard">
				<WeekView />
				<div className="in_content" style={{ height: '100%' }}>
					<div className="notes_component">
						<div className="notes_scroller">
							{/* Search input for notes */}
							<input
								className="search_notes_input"
								type="text"
								name="search_notes_term"
								id="search_notes_term"
								placeholder="Search notes"
								onChange={(term) => this.handleNotesSearch(term.target.value)}
							/>

							{/* New note button */}
							<div
								className="add_note_button"
								onClick={() => {
									this.state.current_view == 'view_notes'
										? this.setState({ current_view: 'add_note' })
										: this.setState({ current_view: 'view_notes' });
								}}
							>
								+ New Note
							</div>

							{this.state.notes}
						</div>

						{/* If the user has not selected to view or added a note, then instruct them to select a note */}
						{/* If the user selects a note from applications then display it with company name and title */}
						{/* If the user selects a simple note then just show the title, date, and note */}
						{this.state.current_view == 'view_notes' ? this.state.selected_note == null ? (
							<div className="note_details">
								<div className="empty_apps_list">Select a note to view</div>
							</div>
						) : this.state.selected_note.from == 'apps' ? (
							<div className="note_details">
								<div className="note_title">
									Note From: {this.state.selected_note.title} at{' '}
									{this.state.selected_note.company_name}
								</div>
								<div className="note_date">{this.state.selected_note.date}</div>
								<div className="note_text">{this.state.selected_note.note}</div>
							</div>
						) : (
							<div className="note_details">
								<div className="note_title">{this.state.selected_note.title}</div>
								<div className="note_date">{this.state.selected_note.date}</div>
								<div className="note_text">{this.state.selected_note.note}</div>
								<form action={'/api/userdata/deletenote/' + this.state.selected_note.id} method="POST">
									<button className="delete_note_button">Delete Note</button>
								</form>
							</div>
						) : (
							// Show this component if the user selects to add a note
							<div className="note_details">
								<div className="add_note">
									<AddNote />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

Notes.propTypes = {
	user_id: PropTypes.string,
	user_data: PropTypes.object,
	apps_list: PropTypes.object
};

export default Notes;
