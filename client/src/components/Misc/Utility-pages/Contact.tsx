import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import contactTranslations from './contactTranslations';
import marked from 'marked';
import { Container, Form, Message, Divider } from 'semantic-ui-react';

/**
 * Component til siden "Kontakt".
 */
export interface ContactProps extends LocalizeContextProps {}

const Contact: React.SFC<ContactProps> = ({ addTranslation }) => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    addTranslation(contactTranslations);
  }, [addTranslation]);

  const handleSubmit = (values: { subject; message }, resetForm: any) => {
    const { subject, message } = values;

    this.props.contactUs({ subject, message });
    setSubmitted(true);
    resetForm();
  };

  return (
    <div className="flex-container">
      <Container className="content">
        <h1>
          <Translate id="contact.header" />
        </h1>
        <Translate id="contact.subheader" />
        <Divider hidden />
        <Formik
          initialValues={{
            subject: '',
            message: ''
          }}
          onSubmit={(values, helpers) => handleSubmit(values, helpers.resetForm)}
        >
          {({ values, handleChange }) => (
            <Form>
              <Translate>
                {({ translate }) => (
                  <Form.Input
                    label={translate('contact.form.subject')}
                    placeholder={translate('contact.form.subject')}
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                  />
                )}
              </Translate>

              <Translate>
                {({ translate }) => (
                  <Form.TextArea
                    label={translate('contact.form.message')}
                    placeholder={translate('contact.form.message')}
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                  />
                )}
              </Translate>

              <Translate>
                {({ translate }) => (
                  <Message
                    error
                    header={translate('contact.form.error.header')}
                    content={translate('contact.form.error.body')}
                  />
                )}
              </Translate>

              <Message info>
                <Translate>
                  {({ translate }) => (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked(translate('contact.disclaimer'))
                      }}
                    />
                  )}
                </Translate>
              </Message>
              <Form.Button content="Send" />
            </Form>
          )}
        </Formik>

        {submitted && (
          <Translate>
            {({ translate }) => (
              <Message positive>
                <Message.Header>{translate('contact.form.submitted.header')}</Message.Header>
                <Message.Content>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(translate('contact.form.submitted.body'))
                    }}
                  />
                </Message.Content>
              </Message>
            )}
          </Translate>
        )}
      </Container>
    </div>
  );
};

export default withLocalize(Contact);
