import React from 'react';
import PropTypes from 'prop-types';

import { Container, Menu, Icon } from 'semantic-ui-react';

/**
 * En menu, der tillader navigation i quizzen frem og tilbage samt viser
 * aktuelle spørgsmål.
 * Vises både over og under spørgsmålet.
 * Alle props kommer fra Quiz.js og beskrives i bunden.
 */

const QuizNavigator = ({ onNavigate, qn, qmax, position }) => {
    return (
        <Container {...(position === 'top' ? { className: 'top-nav' } : {})}>
            <Menu size="large" fluid widths={3}>
                <Menu.Item
                    {...(qn <= 0 ? { disabled: true } : {})}
                    onClick={() => onNavigate(qn - 1)}
                >
                    <Icon name="step backward" />
                    Forrige
                </Menu.Item>
                <Menu.Item header>
                    {position === 'top' && (
                        <span>
                            Spørgsmål {qn + 1} af {qmax}
                        </span>
                    )}
                </Menu.Item>
                <Menu.Item
                    {...(qn + 1 >= qmax ? { disabled: true } : {})}
                    onClick={() => onNavigate(qn + 1)}
                >
                    Næste
                    <Icon name="step forward" />
                </Menu.Item>
            </Menu>
        </Container>
    );
};

QuizNavigator.propTypes = {
    /**
     * onNavigate Selve funktionen der navigerer
     */
    onNavigate: PropTypes.func.isRequired,

    /**
     * qn         Index for det akutelle spørgsmål
     */
    qn: PropTypes.number.isRequired,

    /**
     * qmax       Hvor mange spørgsmål er der at navigere mellem?
     */
    qmax: PropTypes.number.isRequired,

    /**
     * position   Er det menuen over eller under spørgsmålet?
     */
    position: PropTypes.string,
};

export default QuizNavigator;
