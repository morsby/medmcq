import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import contactTranslations from './contactTranslations';
import marked from 'marked';
import { Container, Form, Message, Divider } from 'semantic-ui-react';
import Selection from 'classes/Selection';
import { ContactInput } from 'types/generated';

export interface ContactProps extends LocalizeContextProps {}

const Contact: React.SFC<ContactProps> = ({ addTranslation }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formik = useFormik({
    initialValues: {
      subject: '',
      message: ''
    },
    onSubmit: (values) => handleSubmit(values, formik.resetForm)
  });

  useEffect(() => {
    addTranslation(contactTranslations);
  }, [addTranslation]);

  const handleSubmit = async (values: ContactInput, resetForm: Function) => {
    setLoading(true);
    await Selection.contact(values);
    setLoading(false);
    setSubmitted(true);
    resetForm();
  };

  return (
    <div className="flex-container">
      <Container className="content">
        <h1>
          <Translate id="contact.header" />
        </h1>
        <Divider hidden />
        <Translate>
          {({ translate }) => (
            <Form>
              <Form.Input
                label={translate('contact.form.subject')}
                placeholder={translate('contact.form.subject')}
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
              />
              <Form.TextArea
                label={translate('contact.form.message')}
                placeholder={translate('contact.form.message')}
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
              />
              <Message
                error
                header={translate('contact.form.error.header')}
                content={translate('contact.form.error.body')}
              />
              <Message info>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(translate('contact.disclaimer') as string)
                  }}
                />
              </Message>
              <Form.Button
                type="submit"
                onClick={() => formik.handleSubmit()}
                loading={loading}
                disabled={loading}
              >
                Send
              </Form.Button>
            </Form>
          )}
        </Translate>
        {submitted && (
          <Message positive>
            <Message.Header>
              <Translate id="contact.form.submitted.header" />
            </Message.Header>
            <Message.Content>
              <Translate id="contact.form.submitted.body" />
            </Message.Content>
          </Message>
        )}
      </Container>
    </div>
  );
};

export default withLocalize(Contact);
