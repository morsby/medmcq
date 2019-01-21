import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import { withRouter } from "react-router";
import { Flag, Menu, Icon } from "semantic-ui-react";
import { urls } from "../../utils/common";

// TODO: Evt. fjern connect - men skal så modtage `user` via parents

class Header extends Component {
    flagStyle = {
        cursor: 'pointer'
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        let { user, history, location, noPrint } = this.props;

        const handleClick = path => {
            history.push(urls[path]);
        };

        let højreMenu;

        if (user) {
            højreMenu = (
                <>
                <Menu.Item>
                    <strong>Velkommen {user.username[0].toUpperCase() + user.username.substring(1)}</strong>
                </Menu.Item>
                <Menu.Item onClick={() => handleClick("profile")}>
                    <Icon
                        name='id card outline'
                        size='big'
                        basic
                        inverted
                        className="click">
                    </Icon>Profil
                </Menu.Item>
                </>
            );
        } else {
            højreMenu = (
                <Menu.Item onClick={() => handleClick("login")}>
                    <Icon name='user md' /> Log ind
                </Menu.Item>
            );
        }

        let printClass = noPrint ? "hide-on-print" : "";

        return (
            <header>
                <Menu attached inverted color='blue'>
                    <Menu.Item onClick={() => handleClick("root")}>
                        <Icon name='home' size='big'/> Forside
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                        <Flag style={this.flagStyle} onClick={() => console.log('clicked')} name='dk' />
                        <Flag style={this.flagStyle} onClick={() => console.log('clicked')} name='uk' />
                        </Menu.Item>
                        {højreMenu}
                    </Menu.Menu>
                </Menu>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        actions
    )(Header)
);
