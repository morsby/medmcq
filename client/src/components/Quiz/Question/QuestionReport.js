import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

// TODO: TRANSLATION
const QuestionReport = ({ report, handleChange, handleSubmit, reportSent }) => {
  if (reportSent) {
    return (
      <Message success>
        <Message.Header>
          <Translate id='questionReport.message.header' />
        </Message.Header>
        <Translate id='questionReport.message.body' />
      </Message>
    );
  } else {
    return (
      <Translate>
        {({ translate }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Form.TextArea
                name='report'
                onChange={handleChange}
                label={translate('questionReport.label')}
                placeholder={translate('questionReport.placeholder')}
                value={report}
              />
            </Form.Field>
            <Form.Button color='orange'>Send</Form.Button>
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
