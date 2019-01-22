import React from 'react';
import marked from 'marked';
import { imageURL } from '../../../../utils/common';
import { subSupScript } from '../../../../utils/quiz';

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

export default PrintDisplayQuestion;
