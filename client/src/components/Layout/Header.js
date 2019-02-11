import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withRouter } from 'react-router';
import { Flag, Menu, Icon, Responsive } from 'semantic-ui-react';
import { urls, breakpoints } from '../../utils/common';

// TODO: Evt. fjern connect - men skal så modtage `user` via parents

/**
 * Header-component. Viser headeren og tjekker at brugeren er logget ind.
 */
class Header extends Component {
    flagStyle = {
        cursor: 'pointer',
    };

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        let { user, history } = this.props;

        const handleClick = path => {
            history.push(urls[path]);
        };

        let højreMenu;

        if (user) {
            højreMenu = (
                <>
                    <Responsive as={Menu.Item} minWidth={breakpoints.mobile}>
                        <strong>
                            Velkommen{' '}
                            {user.username[0].toUpperCase() +
                                user.username.substring(1)}
                        </strong>
                    </Responsive>
                    <Menu.Item onClick={() => handleClick('profile')}>
                        <Icon
                            name="id card outline"
                            size="big"
                            inverted
                            className="click"
                        />
                        Profil
                    </Menu.Item>
                </>
            );
        } else {
            højreMenu = (
                <Menu.Item onClick={() => handleClick('login')}>
                    <Icon name="user md" /> Log ind
                </Menu.Item>
            );
        }

        return (
            <header>
                <Menu inverted color="blue" attached>
                    <Menu.Item onClick={() => handleClick('root')}>
                        <Icon name="home" size="big" /> Forside
                    </Menu.Item>
                    <Menu.Menu position="right">
                        {/* <Menu.Item>
                            <Flag
                                style={this.flagStyle}
                                onClick={() => console.log("clicked")}
                                name="dk"
                            />
                            <Flag
                                style={this.flagStyle}
                                onClick={() => console.log("clicked")}
                                name="gb"
                            />
                        </Menu.Item> */}
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
};

function mapStateToProps(state) {
    return {
        user: state.auth.user,
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(Header)
);
