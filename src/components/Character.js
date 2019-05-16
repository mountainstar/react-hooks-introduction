import React, { Component } from 'react';
import axios from 'axios';
import Summary from './Summary';

class Character extends Component {
	state = { loadedCharacter: {}, isLoading: false };

	shouldComponentUpdate(nextProps, nextState) {
		console.log('shouldComponentUpdate');
		return (
			nextProps.selectedChar !== this.props.selectedChar ||
			nextState.loadedCharacter.id !== this.state.loadedCharacter.id ||
			nextState.isLoading !== this.state.isLoading
		);
	}

	componentDidUpdate(prevProps) {
		console.log('Component did update');
		if (prevProps.selectedChar !== this.props.selectedChar) {
			this.fetchData();
		}
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = async () => {
		console.log(
			'Sending Http request for new character with id ' +
				this.props.selectedChar
		);
		this.setState({ isLoading: true });
		const { data } = await axios.get(
			`https://swapi.co/api/people/${this.props.selectedChar}`
		);
		if (data) {
			const selectedCharacters = data.results;
			const loadedCharacter = {
				id: this.props.selectedChar,
				name: data.name,
				height: data.height,
				colors: {
					hair: data.hair_color,
					skin: data.skin_color
				},
				gender: data.gender,
				movieCount: data.films.length
			};
			this.setState({ loadedCharacter: loadedCharacter, isLoading: false });
			return;
		}
		throw new Error('Failed to fetch.');
	};

	componentWillUnmount() {
		console.log('Too soon...');
	}

	render() {
		let content = <p>Loading Character...</p>;

		if (!this.state.isLoading && this.state.loadedCharacter.id) {
			content = (
				<Summary
					name={this.state.loadedCharacter.name}
					gender={this.state.loadedCharacter.gender}
					height={this.state.loadedCharacter.height}
					hairColor={this.state.loadedCharacter.colors.hair}
					skinColor={this.state.loadedCharacter.colors.skin}
					movieCount={this.state.loadedCharacter.movieCount}
				/>
			);
		} else if (!this.state.isLoading && !this.state.loadedCharacter.id) {
			content = <p>Failed to fetch character.</p>;
		}
		return content;
	}
}

export default Character;
