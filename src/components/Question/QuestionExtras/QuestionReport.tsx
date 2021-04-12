import React, { useState } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import Question from 'classes/Question';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface QuestionReportProps {
  report: string;
  handleChange: (text: string) => void;
  handleSubmit: (e: React.FormEvent<any>) => void;
  reportSent: boolean;
  question: Question;
}

const QuestionReport: React.SFC<QuestionReportProps> = ({
  report,
  handleChange,
  handleSubmit,
  reportSent,
  question
}) => {
  const [checked, setChecked] = useState(false);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((s) => s.id === question.examSet.semester.id)
  );

  if (reportSent) {
    return (
      <Message success>
        <Message.Header>
          <Translate id="questionReport.message.header" />
        </Message.Header>
        <Translate id="questionReport.message.body" />
      </Message>
    );
  } else {
    return (
      <Translate>
        {({ translate }) => (
          <Form onSubmit={checked ? handleSubmit : null}>
            {semester.value === 11 && (
              <Message color="yellow">
                <Translate id="questionReport.pictureMissing11" />
              </Message>
            )}
            <Message>
              <Translate id="questionReport.checkIssue" data={{ link: question.id }} />
            </Message>
            <Form.Field>
              <Form.TextArea
                name="report"
                onChange={(e, { value }) => handleChange(value as string)}
                label={translate('questionReport.label')}
                placeholder={translate('questionReport.placeholder')}
                value={report}
              />
            </Form.Field>
            <Form.Field>
              <Form.Checkbox
                required
                checked={checked}
                onChange={() => setChecked(!checked)}
                label={
                  <label>
                    <Translate id="questionReport.checkbox" data={{ link: question.id }} />
                  </label>
                }
              />
              <Form.Button color="orange">Send</Form.Button>
            </Form.Field>
          </Form>
        )}
      </Translate>
    );
  }
};

export default QuestionReport;
