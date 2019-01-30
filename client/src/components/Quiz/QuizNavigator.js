import React from 'react';
import PropTypes from 'prop-types';

import { Container, Menu, Icon } from 'semantic-ui-react';

/**
 * En menu, der tillader navigation i quizzen frem og tilbage samt viser
 * aktuelle spørgsmål.
 * Vises både over og under spørgsmålet.
 * Alle props kommer fra Quiz.js
 * @param {func}   onNavigate Selve funktionen der navigerer
 * @param {number} qn         Index for det akutelle spørgsmål
 * @param {number} qmax       Hvor mange spørgsmål er der at navigere mellem?
 * @param {string} position   Er det menuen over eller under spørgsmålet?
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
    onNavigate: PropTypes.func.isRequired,
    qn: PropTypes.number.isRequired,
    qmax: PropTypes.number.isRequired,
    position: PropTypes.string,
};

export default QuizNavigator;
