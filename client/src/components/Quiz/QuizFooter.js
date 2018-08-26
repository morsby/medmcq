import React from "react";
import PropTypes from "prop-types";

import { Container, Menu, Divider } from "semantic-ui-react";

const QuizFooter = ({ navigateToRoot, newQuestions, set }) => {
    let widths = set ? 1 : 2;
    return (
        <Container>
            <Divider hidden />
            <Menu widths={widths}>
                <Menu.Item color="red" onClick={navigateToRoot}>
                    Tilbage til oversigten
                </Menu.Item>
                {!set && (
                    <Menu.Item color="yellow" onClick={newQuestions}>
                        Nye spørgsmål (senest valgte indstillinger)
                    </Menu.Item>
                )}
            </Menu>
        </Container>
    );
};

QuizFooter.propTypes = {
    navigateToRoot: PropTypes.func.isRequired,
    newQuestions: PropTypes.func.isRequired,
    set: PropTypes.bool
};

export default QuizFooter;
