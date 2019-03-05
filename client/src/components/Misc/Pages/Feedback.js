import React from 'react';
import PropTypes from 'prop-types';

import { withLocalize, Translate } from 'react-localize-redux';
import feedbackTranslations from './feedbackTranslations';

import marked from 'marked';

import { Container } from 'semantic-ui-react';
import Footer from '../../Layout/Footer';

/**
 * Component til siden "Om-siden".
 */
const Feedback = ({ addTranslation }) => {
    addTranslation(feedbackTranslations);

    return (
        <div className="flex-container">
            <Container className="content">
                <h1>
                    <Translate id="feedback.header" />
                </h1>
                <Translate>
                    {({ translate }) => (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: marked(translate('feedback.body'))
                            }}
                        />
                    )}
                </Translate>
            </Container>
            <Footer />
        </div>
    );
};

Feedback.propTypes = {
    /**
     * Func til at tilføje oversættelse.
     * Fra react-localize-redux
     */
    addTranslation: PropTypes.func
};

export default withLocalize(Feedback);
