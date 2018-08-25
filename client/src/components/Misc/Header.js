import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import { withRouter } from "react-router";
import { Container, Button } from "semantic-ui-react";
import { urls } from "../../utils/common";

class Header extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    const handleClick = path => {
      this.props.history.push(urls[path]);
    };

    let text,
      user = this.props.auth.user;
    if (user) {
      text = (
        <div>
          Velkommen,{" "}
          <strong onClick={() => handleClick("profile")} className="click">
            {user.username}
          </strong>.
        </div>
      );
    } else {
      text = <Button onClick={() => handleClick("login")}>Log ind</Button>;
    }

    return (
      <header className="main-header">
        <Container>
          <div className="header-text">{text}</div>
          {this.props.location.pathname !== "/" && (
            <Button floated="right" onClick={() => handleClick("root")}>
              Gå til forsiden
            </Button>
          )}
        </Container>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    settings: state.settings
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(Header)
);
