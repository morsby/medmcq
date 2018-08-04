import React from 'react';
import { withRouter } from 'react-router';
import { Container } from 'semantic-ui-react';
import { urls } from '../common';

const Footer = props => {
	const handleClick = path => {
		props.history.push(path);
	};
	return (
		<footer className="main-footer">
			<Container>
				Siden er lavet med tilladelse fra Institut for Klinisk Medicin,
				Health, Aarhus Universitet.
				{props.history.location.pathname.substr(1, 8) !==
					'feedback' && (
					<div
						style={{
							float: 'right',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
						onClick={() => handleClick(urls.feedback)}
					>
						Feedback og hjælp
					</div>
				)}
			</Container>
		</footer>
	);
};

export default withRouter(Footer);
