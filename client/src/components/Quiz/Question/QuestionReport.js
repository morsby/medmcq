import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

const QuestionReport = ({ report, handleChange, handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Field>
      <Form.TextArea
        name="report"
        onChange={handleChange}
        label="Hvad er problemet?"
        placeholder='F.eks. "der er en stavefejl i ordet blodpørve", "billede/tabel mangler" eller "det markerede svar stemmer ikke overens med det originale sæt".'
        value={report}
      />
    </Form.Field>
    <Form.Button>Send</Form.Button>
  </Form>
);

QuestionReport.propTypes = {
  report: PropTypes.string,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default QuestionReport;
