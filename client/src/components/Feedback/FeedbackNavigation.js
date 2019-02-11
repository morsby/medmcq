import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

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
}) => {
    const handleClick = (e, data) => {
        history.push(data.path);
    };

    return (
        <Menu>
            <Menu.Item header onClick={handleClick} path={urls.feedback}>
                Feedback og hjælp
            </Menu.Item>

            {id && (
                <Menu.Item
                    onClick={handleClick}
                    path={`${urls.feedback}/${id}`}
                >
                    Forslag: {title}
                </Menu.Item>
            )}
            <Menu.Menu position="right">
                {match.path !== `${urls.feedback}/new` && (
                    <Menu.Item
                        onClick={handleClick}
                        path={`${urls.feedback}/new`}
                    >
                        Kom med et forslag
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
};

export default withRouter(FeedbackNavigation);
