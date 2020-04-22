import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';

import { urls } from '../../../../utils/common';

import { Container, Button } from 'semantic-ui-react';

import PrintDisplayQuestion from './PrintDisplayQuestion';

import printTranslations from './printTranslations.json';
import { useHistory } from 'react-router-dom';
import { ReduxState } from 'redux/reducers';

/**
 * Component der viser printervenlig side med de aktuelle spørgsmål og håndterer
 * hvorvidt svar er synlige eller ej.
 */
export interface PrintProps extends LocalizeContextProps {}

const Print: React.SFC<PrintProps> = ({ addTranslation }) => {
  const [showCorrect, setShowCorrect] = useState(false);
  const questions = useSelector((state: ReduxState) => state.questions.questions);
  const history = useHistory();

  useEffect(() => {
    addTranslation(printTranslations);
  }, []);

  const toggleAnswers = () => {
    setShowCorrect(!showCorrect);
  };

  const handleNavigation = (path) => {
    history.push(urls[path]);
  };

  return (
    <div className="flex-container">
      <Container className="content print">
        <div className="hide-on-print">
          <Button.Group className="hide-on-print">
            <Button className="primary" onClick={toggleAnswers}>
              {showCorrect ? (
                <Translate id="print.hide_correct" />
              ) : (
                <Translate id="print.show_correct" />
              )}
            </Button>
            <Button className="hide-on-print" onClick={() => window.print()}>
              <Translate id="print.print" />
            </Button>
          </Button.Group>
          <Button color="yellow" floated="right" onClick={() => handleNavigation('quiz')}>
            <Translate id="print.return_to_quiz" />
          </Button>
        </div>

        {questions.map((q, i) => {
          return (
            <div className="avoid-page-break" key={q.id}>
              <h3>
                <Translate id="print.question" data={{ n: i + 1 }} />
              </h3>
              <PrintDisplayQuestion question={q} showCorrect={showCorrect} n={i + 1} />
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default withLocalize(Print);
