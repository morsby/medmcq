import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { withRouter } from 'react-router';
import { Icon, Menu } from 'semantic-ui-react';
import { urls } from '../../utils/common';

import { Translate } from 'react-localize-redux';

/**
 * Footer component.
 */
const Footer = ({ history }) => {
    const paragraphStyle = {
        display: 'block',
        width: '65%',
    };

    const footerStyle = {
        margin: '10px 0 0 0',
        width: '100%',
    };

    const handleClick = path => {
        history.push(path);
    };
    return (
        <footer style={footerStyle}>
            <Menu attached inverted color="blue">
                <Menu.Item position="right" style={paragraphStyle}>
                    <p>
                        <Translate id="footer.permission" />
                    </p>
                    <Icon name="heartbeat" />
                    <Translate id="footer.developed_by" />
                    {/*}<p>
                        <Icon name="graduation cap" />
                        <Translate id="footer.maintained_by" />
                    </p> */}
                </Menu.Item>
                <Menu.Menu position="left">
                    {history.location.pathname !== urls.about && (
                        <Menu.Item onClick={() => handleClick(urls.about)}>
                            <Icon name="question circle outline" />
                            <Translate id="footer.about_link" />
                        </Menu.Item>
                    )}
                </Menu.Menu>
            </Menu>
        </footer>
    );
};

Footer.propTypes = {
    /**
     * history er fra ReactRouter. Bruges til navigation.
     */
    history: ReactRouterPropTypes.history,
};

export default withRouter(Footer);
