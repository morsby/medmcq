import React from "react";

import { connect } from "react-redux";

import * as actions from "../../actions";

import { Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

import Header from "../Misc/Header";
import Footer from "../Misc/Footer";

const Logout = props => {
    props.fetchUser();
    return (
        <div className="flex-container">
            <Header />
            <Container className="content">
                <h3>Du er nu logget ud.</h3>
                <p>
                    Gå tilbage til <Link to="/">forsiden</Link>
                </p>
            </Container>
            <Footer />
        </div>
    );
};

export default connect(
    null,
    actions
)(Logout);
