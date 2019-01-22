import React from 'react';

import { Container } from 'semantic-ui-react';

import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';

const ErrorPage = props => {
    return (
        <div className="flex-container">
            <Header />
            <Container className="content">
                <h3>404</h3>
                <p>Siden ikke fundet</p>
            </Container>
            <Footer />
        </div>
    );
};

export default ErrorPage;
