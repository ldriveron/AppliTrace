import React from 'react';
import PropTypes from 'prop-types';

const Search = (props) => {
	return (
		<div className="search_holder">
			<input
				className="search_input"
				type="text"
				name="search_term"
				id="search_term"
				defaultValue={props.search_term}
				placeholder="Search applications..."
				onChange={(term) => props.handleSearch(term.target.value)}
			/>
			<select
				className="search_type"
				name="search_type"
				id="search_type"
				value={props.search_type}
				onChange={(e) => props.handleSearchTypeChange(e.target.value)}
			>
				<option key="all" value="all">
					All
				</option>
				<option key="status" value="status">
					Status
				</option>
				<option key="title" value="title">
					Position Title
				</option>
				<option key="company_name" value="company_name">
					Company Name
				</option>
				<option key="location" value="location">
					Location
				</option>
			</select>
			<select
				className="search_type"
				name="search_order"
				id="search_order"
				value={props.search_order}
				onChange={(e) => props.handleSearchOrderChange(e.target.value)}
			>
				<option key="date_applied" value="-date_applied">
					Date Applied
				</option>
				<option key="date_added" value="-date_added">
					Date Added
				</option>
				<option key="company_name" value="company_name">
					Company Name
				</option>
				<option key="source" value="source">
					Source
				</option>
			</select>
		</div>
	);
};

Search.propTypes = {
	search_type: PropTypes.string,
	search_term: PropTypes.string,
	handleSearch: PropTypes.func,
	handleSearchTypeChange: PropTypes.func,
	handleSearchOrderChange: PropTypes.func
};

export default Search;
