import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { withLocalize, Translate } from 'react-localize-redux';
import feedbackTranslations from './feedbackTranslations.json';

import { withRouter } from 'react-router';
import { urls } from '../../utils/common';

import { Menu } from 'semantic-ui-react';

/**
 * Viser navigation under feedback.
 */
const FeedbackNavigation = ({
    id,
    title,
    history, // fra withRouter
    match, // fra withRouter
    addTranslation, // fra react-localize-redux
}) => {
    addTranslation(feedbackTranslations);

    const handleClick = (e, data) => {
        history.push(data.path);
    };

    return (
        <Menu>
            <Menu.Item header onClick={handleClick} path={urls.feedback}>
                Feedback
            </Menu.Item>

            {id && (
                <Menu.Item
                    onClick={handleClick}
                    path={`${urls.feedback}/${id}`}
                >
                    <Translate
                        id="feedbackNavigation.suggestion_link"
                        data={{ title }}
                    />
                </Menu.Item>
            )}
            <Menu.Menu position="right">
                {match.path !== `${urls.feedback}/new` && (
                    <Menu.Item
                        onClick={handleClick}
                        path={`${urls.feedback}/new`}
                    >
                        <Translate id="feedbackNavigation.write_suggestion" />
                    </Menu.Item>
                )}
            </Menu.Menu>
        </Menu>
    );
};

FeedbackNavigation.propTypes = {
    /**
     * ID på aktuelle forslag (hvis det er der)
     */
    id: PropTypes.string,

    /**
     * Titel på aktuelle forslag (hvis det er der)
     */
    title: PropTypes.string,

    /**
     * Fra ReactRouter. Bruges til navigation
     */
    history: ReactRouterPropTypes.history,

    /**
     * Fra ReactRouter. Bruges til conditional rendering af links
     */
    match: ReactRouterPropTypes.match,

    /**
     * Fra react-localize-redux
     * Tilføjer translation-data for hele Feedback-mappen
     */
    addTranslation: PropTypes.func,
};

export default withRouter(withLocalize(FeedbackNavigation));
