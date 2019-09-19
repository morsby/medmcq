import React, { useState, useEffect } from 'react';
import { Divider } from 'semantic-ui-react';
import QuestionReport from './QuestionExtras/QuestionReport';
import QuestionComments from './QuestionComments/QuestionComments';
import { PropTypes } from 'prop-types';
import QuestionExtraButtons from './QuestionExtras/QuestionExtraButtons';

const QuestionExtras = ({ user, question, width, questionReport }) => {
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
  }, [question]);

  /** Vis/skjul formular til rapportering af spørgsmål */
  const onReportToggle = () => {
    setReportOpen(!reportOpen);
    setPrivateCommentsOpen(false);
    setPublicCommentsOpen(false);
  };

  /** Håndter submit af rapport */
  const onReportSubmit = () => {
    // TODO: CONNECT  TIL REDUX OG API
    questionReport({
      type: 'error_report',
      data: { report: report, question: question }
    });
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
        publicComments={(question.publicComments || []).length}
        privateComments={(question.privateComments || []).length}
        width={width}
        user={user}
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
        <QuestionComments
          user={user}
          comments={privateCommentsOpen ? question.privateComments : question.publicComments}
          type={privateCommentsOpen ? 'private' : 'public'}
          question={question}
        />
      )}
    </>
  );
};

QuestionExtras.propTypes = {
  user: PropTypes.object,
  question: PropTypes.object,
  width: PropTypes.number,
  questionReport: PropTypes.func, // Redux
  deleteComment: PropTypes.func, // Redux
  commentQuestion: PropTypes.func, // Redux
  editComment: PropTypes.func // Redux
};

export default QuestionExtras;
