import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getIds } from '../../../../utils/questions';
import { Form, Radio, Divider, Icon } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

const SetRadioButton = ({
    set,
    answeredQuestions,
    groupedQuestions,
    activeSet,
    onChange,
}) => {
    let completed = '';

    // Tjekker hvilke spg. i sættet der ikke er besvaret allerede
    if (answeredQuestions) {
        let missingQuestions = _.difference(
            getIds(groupedQuestions),
            getIds(answeredQuestions)
        );

        if (missingQuestions.length === 0)
            completed = <Icon name="check" color="green" />;
    }

    return (
        <Form.Group key={set.api}>
            <Form.Field>
                <Translate>
                    {({ activeLanguage = { code: 'dk' } }) => {
                        // TODO:
                        /*flyt evt. disse replaces over i react-localize-redux 
                        vha. dynamiske id's (se fx profileAnswerDetails og dets 
                        Sæt-kolonne i tabellen) */
                        let label = set.text;
                        if (activeLanguage.code === 'gb') {
                            label = label.replace('Forår', 'Spring');
                            label = label.replace('Efterår', 'Autumn');
                            label = label.replace('(reeks)', '(re-ex)');
                        }

                        return (
                            <>
                                <Radio
                                    label={label}
                                    value={set.api}
                                    checked={set.api === activeSet}
                                    name="set"
                                    onChange={onChange}
                                />{' '}
                                {completed}
                                <Divider vertical hidden />
                            </>
                        );
                    }}
                </Translate>
            </Form.Field>
        </Form.Group>
    );
};

SetRadioButton.propTypes = {
    set: PropTypes.object,
    answeredQuestions: PropTypes.func,
    groupedQuestions: PropTypes.array,
    activeSet: PropTypes.string,
    onChange: PropTypes.func,
};

export default SetRadioButton;
