import React from 'react';
import PropTypes from 'prop-types';

import { Container, Menu, Icon } from 'semantic-ui-react';

const QuizNavigator = ({ clickHandler, qn, qmax, fixed, position }) => {
    return (
        <Container {...(position === 'top' ? { className: 'top-nav' } : {})}>
            <Menu
                size="large"
                fluid
                widths={3}
                {...(fixed ? { fixed: position } : {})}
            >
                <Menu.Item
                    {...(qn <= 0 ? { disabled: true } : {})}
                    onClick={() => clickHandler(qn - 1)}
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
                    onClick={() => clickHandler(qn + 1)}
                >
                    Næste
                    <Icon name="step forward" />
                </Menu.Item>
            </Menu>
        </Container>
    );
};

QuizNavigator.propTypes = {
    clickHandler: PropTypes.func.isRequired,
    qn: PropTypes.number.isRequired,
    qmax: PropTypes.number.isRequired,
    fixed: PropTypes.bool,
    position: PropTypes.string,
};

export default QuizNavigator;
