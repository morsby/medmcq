import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
class LoaderRetry extends Component {
	constructor(props) {
		super(props);
		this.state = { seconds: 0 };
	}

	componentDidMount() {
		this.interval = setInterval(() => this.tick(), 1000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	tick() {
		this.setState(prevState => ({
			seconds: prevState.seconds + 1
		}));
	}
	render() {
		if (this.state.seconds >= 2) {
			return (
				<div style={{ margin: '5px 0' }}>
					<p>Hm, det tager længere end vanligt.</p>
					<p>Har du en dårlig forbindelse?</p>
					<p>
						Det kan selvfølgelig også være et problem med siden ...
					</p>
					<Button basic color="blue" onClick={this.props.handleClick}>
						Prøv igen!
					</Button>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default LoaderRetry;
