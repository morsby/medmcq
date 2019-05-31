import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

// TODO: TRANSLATION
const QuestionReport = ({
  report,
  handleChange,
  handleSubmit,
  reportSent,
  question
}) => {
  const [checked, setChecked] = useState(false);
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
            {question.semester === 11 && (
              <Message color="yellow">
                <Translate id="questionReport.pictureMissing11" />
              </Message>
            )}
            {question.disclaimer && (
              <Message color="yellow">{question.disclaimer}</Message>
            )}
            <Message>
              <Translate
                id="questionReport.checkIssue"
                data={{ link: question._id }}
              />
            </Message>
            <Form.Field>
              <Form.TextArea
                name="report"
                onChange={handleChange}
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
                    <Translate
                      id="questionReport.checkbox"
                      data={{ link: question._id }}
                    />
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

QuestionReport.propTypes = {
  /**
   * TextArea input
   */
  report: PropTypes.string,

  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,

  /**
   * Er der sendt en rapport? I så fald vises en toast.
   */
  reportSent: PropTypes.bool
};

export default QuestionReport;
