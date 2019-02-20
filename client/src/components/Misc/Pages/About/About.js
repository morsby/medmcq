import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { withLocalize, Translate } from 'react-localize-redux';
import aboutTranslations from './aboutTranslations';

import { Container, Message } from 'semantic-ui-react';
import Header from '../../../Layout/Header';
import Footer from '../../../Layout/Footer';

import FancyFunctions from './FancyFunctions';

/**
 * Component til siden "Om-siden".
 */
const About = ({ addTranslation }) => {
    addTranslation(aboutTranslations);

    return (
        <div className="flex-container">
            <Header />
            <Container className="content">
                <h1>
                    <Translate id="about.header" />
                </h1>
                <Message warning>
                    <Message.Header>
                        <Translate id="about.notice.header" />
                    </Message.Header>
                    <Translate id="about.notice.body" />
                </Message>

                <FancyFunctions />

                <h2>Feedback</h2>

                <Translate id="about.contactInfo" />

                <h2>
                    <Translate id="about.privacy.header" />
                </h2>
                <Translate id="about.privacy.body" />
            </Container>
            <Footer />
        </div>
    );
};

About.propTypes = {
    /**
     * History er fra ReactRouter
     */
    history: ReactRouterPropTypes.history,

    /**
     * Func til at tilføje oversættelse.
     * Fra react-localize-redux
     */
    addTranslation: PropTypes.func
};

export default withLocalize(About);
