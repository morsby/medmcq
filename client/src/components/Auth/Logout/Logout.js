import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import * as actions from '../../../actions';

import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

const Logout = ({ fetchUser }) => {
    fetchUser();
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

Logout.propTypes = {
    /**
     * Funktion der opdaterer login-status via redux.
     */
    fetchUser: PropTypes.func,
};
export default connect(
    null,
    actions
)(Logout);
