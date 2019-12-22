import React, { useState, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import QuestionReport from './QuestionExtras/QuestionReport';
import QuestionComments from './QuestionComments/QuestionComments';
import QuestionExtraButtons from './QuestionExtras/QuestionExtraButtons';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface QuestionExtrasProps {
  width: number;
}

const QuestionExtras: React.SFC<QuestionExtrasProps> = ({ width }) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const [privateCommentsOpen, setPrivateCommentsOpen] = useState(false);
  const [publicCommentsOpen, setPublicCommentsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [report, setReport] = useState('');

  useEffect(() => {
    setPrivateCommentsOpen(false);
    setPublicCommentsOpen(false);
    setReportOpen(false);
    setReportSent(false);
    setReport('');
  }, [question.id]);

  /** Vis/skjul formular til rapportering af spørgsmål */
  const onReportToggle = () => {
    setReportOpen(!reportOpen);
    setPrivateCommentsOpen(false);
    setPublicCommentsOpen(false);
  };

  /** Håndter submit af rapport */
  const onReportSubmit = () => {
    // TODO: CONNECT  TIL REDUX OG API
    setReport('');
    setReportSent(true);
  };

  const onPublicCommentsToggle = () => {
    setPublicCommentsOpen(!publicCommentsOpen);
    setPrivateCommentsOpen(false);
    setReportOpen(false);
  };

  const onPrivateCommentsToggle = () => {
    setPrivateCommentsOpen(!privateCommentsOpen);
    setPublicCommentsOpen(false);
    setReportOpen(false);
  };

  return (
    <>
      <QuestionExtraButtons
        onReportToggle={onReportToggle}
        onPrivateCommentsToggle={onPrivateCommentsToggle}
        privateCommentsOpen={privateCommentsOpen}
        onPublicCommentsToggle={onPublicCommentsToggle}
        publicCommentsOpen={publicCommentsOpen}
        width={width}
      />
      {reportOpen && (
        <>
          <Divider hidden />
          <QuestionReport
            report={report}
            handleChange={(e) => setReport(e.target.value)}
            handleSubmit={onReportSubmit}
            reportSent={reportSent}
            question={question}
          />
        </>
      )}
      {(publicCommentsOpen || privateCommentsOpen) && (
        <QuestionComments type={privateCommentsOpen ? 'private' : 'public'} />
      )}
    </>
  );
};

export default QuestionExtras;
