import React from 'react';

import { Container, Menu, Divider } from 'semantic-ui-react';

const MainNavigation = props => {
	let widths = props.set === 'set' ? 1 : 2;
	return (
		<Container>
			<Divider hidden />
			<Menu widths={widths}>
				<Menu.Item color="red" onClick={props.toSelection}>
					Tilbage til oversigten
				</Menu.Item>
				{props.set !== 'set' && (
					<Menu.Item color="yellow" onClick={props.newQuestions}>
						Nye spørgsmål (senest valgte indstillinger)
					</Menu.Item>
				)}
			</Menu>
		</Container>
	);
};

export default MainNavigation;
