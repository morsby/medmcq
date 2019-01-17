import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import { withRouter } from "react-router";
import { Button, Menu, Icon } from "semantic-ui-react";
import { urls } from "../../utils/common";

// TODO: Evt. fjern connect - men skal så modtage `user` via parents

class Header extends Component {
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
                    <strong>Velkommen {user.username}</strong>
                </Menu.Item>
                <Menu.Item>
                    <Button
                        basic inverted
                        onClick={() => handleClick("profile")}
                        className="click">
                        Profil
                    </Button>
                </Menu.Item>
                </>
            );
        } else {
            højreMenu = (
                <Menu.Item>
                    <Icon name='user md' onClick={() => handleClick("login")} /> Log ind
                </Menu.Item>
            );
        }

        let printClass = noPrint ? "hide-on-print" : "";

        return (
            <header>
                <Menu inverted color='blue'>
                    <Menu.Item onClick={() => handleClick("root")}>
                        <Icon name='home' size='big'/> Forside
                    </Menu.Item>
                    <Menu.Menu position='right'>
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
