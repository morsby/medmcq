import React, { Component } from 'react';
import { Dimmer, Loader, Button } from 'semantic-ui-react';

class QuizLoader extends Component {
    state = { seconds: 0 };

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1,
        }));
    }

    render() {
        let longWait = '',
            { handleClick, handleAbort } = this.props;
        if (this.state.seconds >= 2) {
            longWait = (
                <div style={{ margin: '5px 0' }}>
                    <p>Hm, det tager længere end vanligt...</p>
                    <Button basic color="blue" onClick={handleClick}>
                        Prøv igen!
                    </Button>
                    <Button basic color="yellow" onClick={handleAbort}>
                        Til forsiden
                    </Button>
                </div>
            );
        }
        return (
            <Dimmer active page>
                <Loader>
                    Henter spørgsmål ...
                    {longWait}
                </Loader>
            </Dimmer>
        );
    }
}

export default QuizLoader;
