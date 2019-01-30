import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Button } from 'semantic-ui-react';

/**
 * Loading-screen component ved start af quiz.
 * Kan forsøge igen eller fortryde anmodningen om spørgsmål
 *
 * Virker ved at sætte et interval - afhængig af tiden det tager, vises
 * forskellige beskeder.
 */

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
            { handleRetry, handleAbort } = this.props;
        if (this.state.seconds >= 2) {
            longWait = (
                <div style={{ margin: '5px 0' }}>
                    <p>Hm, det tager længere end vanligt...</p>
                    <Button basic color="blue" onClick={handleRetry}>
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

QuizLoader.propTypes = {
    /**
     * Fra Quiz.js
     * Kalder getQuestions (fra redux) - hvis første request faldt ud pga. tabt
     * forbindelse.
     */
    handleRetry: PropTypes.func,

    /**
     * Fra Quiz.js
     * Navigerer tilbage til forsiden.
     */
    handleAbort: PropTypes.func,
};

export default QuizLoader;
