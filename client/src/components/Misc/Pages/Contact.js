import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import PropTypes from 'prop-types';

import { withLocalize, Translate } from 'react-localize-redux';
import contactTranslations from './contactTranslations';

import marked from 'marked';

import { Container, Form, Message, Divider } from 'semantic-ui-react';
import Footer from '../../Layout/Footer';

/**
 * Component til siden "Kontakt".
 */
class Contact extends Component {
  state = {
    subject: '',
    message: '',
    errorFields: [],
    submitted: false
  };

  constructor(props) {
    super(props);

    this.props.addTranslation(contactTranslations);
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      if (this.state.errorFields.length > 0) {
        this.validateForm();
      }
    });
  };

  validateForm = () => {
    const { subject, message } = this.state;
    let errorFields = [];
    /** Validation **/
    if (subject.length < 3) errorFields.push('subject');
    if (message.length < 10) errorFields.push('message');

    this.setState({ errorFields });

    if (errorFields.length === 0) {
      return 'valid';
    } else {
      return 'invalid';
    }
  };

  handleSubmit = () => {
    const { subject, message } = this.state;

    if (this.validateForm() === 'valid') {
      this.props.contactUs({ subject, message });
      this.setState({ subject: '', message: '', errorFields: [], submitted: true });
    }
  };

  render() {
    const { subject, message, errorFields, submitted } = this.state;
    return (
      <div className="flex-container">
        <Container className="content">
          <h1>
            <Translate id="contact.header" />
          </h1>
          <Translate id="contact.subheader" />
          <Divider hidden />
          <Form onSubmit={this.handleSubmit} error={errorFields.length > 0}>
            <Translate>
              {({ translate }) => (
                <Form.Input
                  label={translate('contact.form.subject')}
                  placeholder={translate('contact.form.subject')}
                  name="subject"
                  value={subject}
                  onChange={this.handleChange}
                  error={errorFields.indexOf('subject') > -1}
                />
              )}
            </Translate>

            <Translate>
              {({ translate }) => (
                <Form.TextArea
                  label={translate('contact.form.message')}
                  placeholder={translate('contact.form.message')}
                  name="message"
                  value={message}
                  onChange={this.handleChange}
                  error={errorFields.indexOf('message') > -1}
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
                    dangerouslySetInnerHTML={{ __html: marked(translate('contact.disclaimer')) }}
                  />
                )}
              </Translate>
            </Message>
            <Form.Button content="Send" disabled={errorFields.length > 0} />
          </Form>

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
        <Footer />
      </div>
    );
  }
}

Contact.propTypes = {
  /**
   * Func til at tilføje oversættelse.
   * Fra react-localize-redux
   */
  addTranslation: PropTypes.func,

  /**
   * Func der sender beskeden til API'en
   */
  contactUs: PropTypes.func
};

export default withLocalize(
  connect(
    null,
    actions
  )(Contact)
);
