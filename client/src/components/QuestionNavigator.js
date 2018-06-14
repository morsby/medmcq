import React from 'react';

import { Container, Menu, Icon } from 'semantic-ui-react';

const QuestionNavigator = props => {
	return (
		<Container
			{...(props.position === 'top' ? { className: 'top-nav' } : {})}
		>
			<Menu
				size="large"
				fluid
				widths={3}
				{...(props.fixed ? { fixed: props.position } : {})}
			>
				<Menu.Item
					{...(props.qn <= 0 ? { disabled: true } : {})}
					onClick={() => props.clickHandler(props.qn - 1)}
				>
					<Icon name="step backward" />
					Forrige
				</Menu.Item>
				<Menu.Item header>
					{props.position === 'top' && (
						<span>
							Spørgsmål {props.qn + 1} af {props.qmax}
						</span>
					)}
				</Menu.Item>
				<Menu.Item
					{...(props.qn + 1 >= props.qmax ? { disabled: true } : {})}
					onClick={() => props.clickHandler(props.qn + 1)}
				>
					Næste
					<Icon name="step forward" />
				</Menu.Item>
			</Menu>
		</Container>
	);
};

export default QuestionNavigator;
