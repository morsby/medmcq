import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { imageURL } from '../../../../utils/common';
import { subSupScript } from '../../../../utils/quiz';

/**
 * Selve den component, der viser de printervenlige udgaver af spørgsmålet.
 * Kaldes af Print.js som også giver alle props.
 */
const PrintDisplayQuestion = props => {
    let {
            question,
            answer1,
            answer2,
            answer3,
            correctAnswer,
            image,
        } = props.questionProp,
        text = subSupScript(question);
    if (Array.isArray(correctAnswer))
        correctAnswer = correctAnswer.join(' correct-');

    return (
        <div>
            <div
                dangerouslySetInnerHTML={{
                    __html: marked(text),
                }}
            />
            {image && (
                <img
                    src={imageURL(image)}
                    alt="billede til eksamensspørgsmål"
                />
            )}
            <ol
                type="A"
                className={
                    props.showCorrect ? `correct-${correctAnswer}` : null
                }
            >
                <li>{answer1}</li>
                <li>{answer2}</li>
                <li>{answer3}</li>
            </ol>
        </div>
    );
};

PrintDisplayQuestion.propTypes = {
    /**
     * Spørgsmålsobjektet
     */
    questionProp: PropTypes.object,

    /**
     * Skal de rigtige svar være synlige?
     */
    showCorrect: PropTypes.bool,
};

export default PrintDisplayQuestion;
