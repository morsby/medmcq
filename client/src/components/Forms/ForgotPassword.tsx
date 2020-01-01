import React, { useState } from 'react';

import { Container, Message, Form, Button } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import User from 'classes/User';

/**
 * Component der viser formular til at bede om nyt password
 * @extends Component
 */
export interface ForgotPasswordProps {}

const ForgotPassword: React.SFC<ForgotPasswordProps> = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (value: string) => setEmail(value);

  const handleSubmit = async () => {
    await User.forgotPassword({ email });
    setMessage(
      'Hvis emailen eksisterer i vores system, vil du snart modtage en email med instruktioner til at nulstille dit kodeord'
    );
  };

  return (
    <div className="flex-container">
      <Container className="content">
        <h3>
          <Translate id="forgotPassword.header" />
        </h3>
        <p>
          <Translate id="forgotPassword.guide" />
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>E-mail</label>
            <Form.Input
              name="email"
              placeholder="E-mail"
              onChange={(e, { value }) => handleChange(value)}
              value={email}
            />
          </Form.Field>
          {message && <Message>{message}</Message>}
          <Button type="submit">Send email</Button>
        </Form>
      </Container>
    </div>
  );
};

export default ForgotPassword;
