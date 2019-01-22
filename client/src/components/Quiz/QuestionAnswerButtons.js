import React from 'react';
import PropTypes from 'prop-types';

import { Button, Divider } from 'semantic-ui-react';

import { evalAnswer } from '../../utils/quiz';
import marked from 'marked';
import { subSupScript } from '../../utils/quiz';

const QuestionAnswerButtons = ({ pristine, onAnswer, question }) => {
    const generateButton = answerNo => {
        let answerText;
        switch (answerNo) {
            case 1:
                answerText = 'A. ';
                break;
            case 2:
                answerText = 'B. ';
                break;
            case 3:
                answerText = 'C. ';
                break;
            default:
                break;
        }
        answerText = answerText + question[`answer${answerNo}`];
        answerText = subSupScript(answerText);
        return (
            <Button
                style={{ textAlign: 'left' }}
                onClick={() => onAnswer(answerNo)}
                color={evalAnswer(question, answerNo)}
                size="large"
            >
                <div
                    dangerouslySetInnerHTML={{
                        __html: marked(answerText),
                    }}
                />
            </Button>
        );
    };

    let pristineClass = pristine ? 'pristine' : '';
    return (
        <Button.Group vertical fluid className={pristineClass}>
            {generateButton(1)}
            <Divider hidden />
            {generateButton(2)}
            <Divider hidden />
            {generateButton(3)}
        </Button.Group>
    );
};

QuestionAnswerButtons.propTypes = {
    onAnswer: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    pristine: PropTypes.bool,
};

export default QuestionAnswerButtons;
