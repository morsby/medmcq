import React from 'react';
import PropTypes from 'prop-types';

import { Container, Menu, Divider } from 'semantic-ui-react';

const QuizFooter = ({ navigateToPage }) => {
    return (
        <Container>
            <Divider hidden />
            <Menu widths={2}>
                <Menu.Item color="red" onClick={() => navigateToPage('root')}>
                    Tilbage til forsiden
                </Menu.Item>

                <Menu.Item
                    color="yellow"
                    onClick={() => navigateToPage('profile')}
                >
                    Til din profil
                </Menu.Item>
            </Menu>
        </Container>
    );
};

QuizFooter.propTypes = {
    navigateToPage: PropTypes.func.isRequired,
};

export default QuizFooter;
