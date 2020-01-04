import React from 'react';
import marked from 'marked';
import { imageURL } from '../../../../utils/common';
import { subSupScript } from '../../../../utils/quiz';

import { Translate } from 'react-localize-redux';
import Question from 'classes/Question';

/**
 * Selve den component, der viser de printervenlige udgaver af spørgsmålet.
 * Kaldes af Print.js som også giver alle props.
 */
export interface PrintDisplayQuestionProps {
  question: Question;
  showCorrect: boolean;
  n: number;
}

const PrintDisplayQuestion: React.SFC<PrintDisplayQuestionProps> = ({
  question,
  showCorrect,
  n
}) => {
  let { text, answer1, answer2, answer3, correctAnswers, images, examSet } = question;

  text = subSupScript(text);
  answer1 = subSupScript(correctAnswers[0]);
  answer2 = subSupScript(correctAnswers[1]);
  answer3 = subSupScript(correctAnswers[3]);

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: marked(text)
        }}
      />
      {images.length > 0 &&
        images.map((image) => <img src={imageURL(image)} alt="billede til eksamensspørgsmål" />)}
      <ol type="A" className={showCorrect ? `correct-${correctAnswers.join(' correct-')}` : null}>
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
            {translate('print.metadata.from')} {examSet.semester.name},{' '}
            {translate(`print.metadata.seasons.${examSet.season}`)} {examSet.year},{' '}
            {translate('print.metadata.question', { n })}
          </div>
        )}
      </Translate>
    </div>
  );
};

export default PrintDisplayQuestion;
