import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { imageURL, getSemester } from '../../../../utils/common';
import { subSupScript } from '../../../../utils/quiz';

import { Translate } from 'react-localize-redux';

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
    semester,
    examYear,
    examSeason,
    n
  } = props.questionProp;

  let text = subSupScript(question);
  answer1 = subSupScript(answer1);
  answer2 = subSupScript(answer2);
  answer3 = subSupScript(answer3);

  if (Array.isArray(correctAnswer))
    correctAnswer = correctAnswer.join(' correct-');

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: marked(text)
        }}
      />
      {image && (
        <img src={imageURL(image)} alt="billede til eksamensspørgsmål" />
      )}
      <ol
        type="A"
        className={props.showCorrect ? `correct-${correctAnswer}` : null}
      >
        <li
          dangerouslySetInnerHTML={{
            __html: marked(answer1)
          }}
        />
        <li
          dangerouslySetInnerHTML={{
            __html: marked(answer2)
          }}
        />
        <li
          dangerouslySetInnerHTML={{
            __html: marked(answer3)
          }}
        />
      </ol>

      <Translate>
        {({ translate }) => (
          <div className="print-metadata">
            {translate('print.metadata.from')} {getSemester(semester).name},{' '}
            {translate(`print.metadata.seasons.${examSeason}`)} {examYear},{' '}
            {translate('print.metadata.question', { n })}
          </div>
        )}
      </Translate>
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
  showCorrect: PropTypes.bool
};

export default PrintDisplayQuestion;
