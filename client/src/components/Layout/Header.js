import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router';

import { withLocalize, Translate } from 'react-localize-redux';
import layoutTranslations from './layoutTranslations.json';

import { Flag, Menu, Icon, Responsive, Image } from 'semantic-ui-react';
import { urls, breakpoints } from '../../utils/common';
import logo from './logo/aulogo_dk_var2_hvid.png';

// TODO: Evt. fjern connect - men skal så modtage `user` via parents

/**
 * Header-component. Viser headeren og tjekker at brugeren er logget ind.
 */
class Header extends Component {
    flagStyle = {
        cursor: 'pointer'
    };

    constructor(props) {
        super(props);

        this.props.addTranslation(layoutTranslations);

        this.changeLang = this.changeLang.bind(this);
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    changeLang(lang) {
        this.props.setActiveLanguage(lang);
        this.props.changeSettings({ type: 'language', value: lang });
    }

    render() {
        let { user, history, languages } = this.props;

        const handleClick = path => {
            history.push(urls[path]);
        };

        let højreMenu;

        if (user) {
            højreMenu = (
                <>
                    <Responsive as={Menu.Item} minWidth={breakpoints.mobile}>
                        <strong>
                            <Translate
                                id="header.greeting"
                                data={{
                                    user:
                                        user.username[0].toUpperCase() + user.username.substring(1)
                                }}
                            />
                        </strong>
                    </Responsive>
                    <Menu.Item onClick={() => handleClick('profile')}>
                        <Icon name="id card outline" size="big" inverted className="click" />
                        <Translate id="header.profile" />
                    </Menu.Item>
                </>
            );
        } else {
            højreMenu = (
                <Menu.Item onClick={() => handleClick('login')}>
                    <Icon name="user md" /> <Translate id="header.login" />
                </Menu.Item>
            );
        }

        return (
            <header>
                <Menu inverted color="blue" attached>
                    <Menu.Item onClick={() => handleClick('root')}>
                        <Image src={logo} size="small" />
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            {languages.map(lang => (
                                <Flag
                                    key={lang.code}
                                    style={this.flagStyle}
                                    onClick={() => this.changeLang(lang.code)}
                                    name={lang.code}
                                />
                            ))}
                        </Menu.Item>
                        {højreMenu}
                    </Menu.Menu>
                </Menu>
            </header>
        );
    }
}

Header.propTypes = {
    /**
     * Func der henter den aktuelt indloggede bruger. Fra redux.
     */
    fetchUser: PropTypes.func,

    /**
     * Brugeren fra fetchUser.
     */
    user: PropTypes.object,

    /**
     * History fra ReactRouter. Bruges til navigation.
     */
    history: ReactRouterPropTypes.history,

    /**
     * Mulige languages. Fra react-localize-redux
     */
    languages: PropTypes.array,

    /**
     * initialize. Fra react-localize-redux
     */
    initialize: PropTypes.func,

    /**
     * Func der ændrer active language. Fra react-localize-redux
     */
    setActiveLanguage: PropTypes.func,

    /**
     * Funktion der ændrer settings for app'en (bruges til at gemme sprogvalg)
     */
    changeSettings: PropTypes.func,

    /**
     * Det gemte sprogvalg. Fra redux settings.
     */
    defaultLanguage: PropTypes.string,

    /**
     * addTranslation: Tilføjer layoutTranslations over hele appen
     */
    addTranslation: PropTypes.func
};

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        defaultLanguage: state.settings.language
    };
}

export default withRouter(
    withLocalize(
        connect(
            mapStateToProps,
            actions
        )(Header)
    )
);
