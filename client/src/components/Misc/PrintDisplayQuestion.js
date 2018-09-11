import React from "react";
import marked from "marked";
import { imageURL } from "../../utils/common";

const PrintDisplayQuestion = props => {
    let {
        question,
        answer1,
        answer2,
        answer3,
        correctAnswer,
        image,
        image_id
    } = props.questionProp;
    return (
        <div>
            <div
                dangerouslySetInnerHTML={{
                    __html: marked(question)
                }}
            />
            {image && (
                <img
                    src={imageURL(image_id)}
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
