import React, { Component } from 'react';
import axios from 'axios';
import './CharPicker.css';

class CharPicker extends Component {
	state = { characters: [], isLoading: false };

	async componentDidMount() {
		this.setState({ isLoading: true });
		const { data } = await axios.get('https://swapi.co/api/people');
		if (data) {
			const selectedCharacters = data.results;
			this.setState({
				characters: selectedCharacters.map((char, index) => ({
					name: char.name,
					id: index + 1
				})),
				isLoading: false
			});
			return;
		}
		throw new Error('Failed to fetch.');
	}

	render() {
		let content = <p>Loading characters...</p>;

		if (
			!this.state.isLoading &&
			this.state.characters &&
			this.state.characters.length > 0
		) {
			content = (
				<select
					onChange={this.props.onCharSelect}
					value={this.props.selectedChar}
					className={this.props.side}>
					{this.state.characters.map(char => (
						<option key={char.id} value={char.id}>
							{char.name}
						</option>
					))}
				</select>
			);
		} else if (
			!this.state.isLoading &&
			(!this.state.characters || this.state.characters.length === 0)
		) {
			content = <p>Could not fetch any data.</p>;
		}
		return content;
	}
}

export default CharPicker;
