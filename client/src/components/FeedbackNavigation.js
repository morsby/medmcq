import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { urls } from '../common';

import { Menu } from 'semantic-ui-react';

class FeedbackNavigation extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e, data) {
		this.props.history.push(data.path);
	}

	render() {
		return (
			<Menu>
				<Menu.Item
					header
					onClick={this.handleClick}
					path={urls.feedback}
				>
					Feedback og hjælp
				</Menu.Item>

				{this.props.id && (
					<Menu.Item
						onClick={this.handleClick}
						path={`${urls.feedback}/${this.props.id}`}
					>
						Forslag: {this.props.title}
					</Menu.Item>
				)}
				<Menu.Menu position="right">
					{this.props.match.path !== `${urls.feedback}/new` && (
						<Menu.Item
							onClick={this.handleClick}
							path={`${urls.feedback}/new`}
						>
							Kom med et forslag
						</Menu.Item>
					)}
					<Menu.Item header onClick={this.handleClick} path="/">
						Tilbage til forsiden
					</Menu.Item>
				</Menu.Menu>
			</Menu>
		);
	}
}

export default withRouter(FeedbackNavigation);
