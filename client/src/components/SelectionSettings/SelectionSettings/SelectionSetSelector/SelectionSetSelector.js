import React from 'react';
import PropTypes from 'prop-types';

import { groupQuestionsBySet } from '../../../../utils/questions';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';

const SelectionSetSelector = ({
    semester,
    activeSet,
    sets,
    questions,
    answeredQuestions,
    onChange,
}) => {
    if (!semester)
        return (
            <Header as="h3">
                <Translate id="selectionSetSelector.choose_semester" />
            </Header>
        );
    return (
        <Form>
            <Header as="h3">
                <Translate
                    id="selectionSetSelector.header"
                    data={{ semester }}
                />
            </Header>

            {sets.map(set => (
                <SetRadioButton
                    key={set.api}
                    set={set}
                    answeredQuestions={answeredQuestions}
                    groupedQuestions={groupQuestionsBySet(questions)[set.api]}
                    activeSet={activeSet}
                    onChange={onChange}
                />
            ))}
        </Form>
    );
};

SelectionSetSelector.propTypes = {
    semester: PropTypes.number,
    activeSet: PropTypes.string,
    sets: PropTypes.array,
    questions: PropTypes.array,
    answeredQuestions: PropTypes.object,
    onChange: PropTypes.func,
};

export default SelectionSetSelector;
