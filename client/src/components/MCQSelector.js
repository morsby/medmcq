import React, { Component } from 'react';
import {
	Container,
	Header,
	Dropdown,
	Divider,
	Button
} from 'semantic-ui-react';

import MCQSelectorNumber from './MCQSelectorNumber';

class MCQSelector extends Component {
	constructor(props) {
		super(props);

		this.state = { type: 'random', n: 10 };

		this.onTypeChange = this.onTypeChange.bind(this);
		this.onNChange = this.onNChange.bind(this);
	}

	onTypeChange(e, data) {
		this.setState({ type: data.name });
	}

	onNChange(e, { value }) {
		this.setState({ n: value });
	}

	render() {
		console.log(this.state);
		const semestre = [
			{ text: '7. semester', value: '7' },
			{ text: '8. semester', value: '8' },
			{ text: '9. semester', value: '9' },
			{ text: '11. semester', value: '11' }
		];

		return (
			<Container>
				<Header as="h1">
					MCQ'er fra kandidaten på medicin ved Aarhus Universitet
				</Header>
				<Header as="h3">Indtast dine valg nedenfor</Header>
				<Dropdown
					placeholder="Vælg semester"
					fluid
					selection
					options={semestre}
				/>
				<Divider hidden />
				<Button.Group fluid widths={3}>
					<Button
						name="random"
						active={this.state.type === 'random'}
						onClick={this.onTypeChange}
					>
						Tilfældige spørgsmål
					</Button>
					<Button
						name="set"
						active={this.state.type === 'set'}
						onClick={this.onTypeChange}
					>
						Fulde eksamenssæt
					</Button>
					<Button
						name="specialer"
						active={this.state.type === 'specialer'}
						onClick={this.onTypeChange}
					>
						Specialer
					</Button>
				</Button.Group>
				<Divider hidden />
				{this.state.type !== 'set' && (
					<MCQSelectorNumber
						n={this.state.n}
						onNChange={this.onNChange}
					/>
				)}
			</Container>
		);
	}
}

export default MCQSelector;
