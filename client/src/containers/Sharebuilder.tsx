import React, { useState } from 'react';
import { Segment, Form, Divider } from 'semantic-ui-react';

export interface SharebuilderProps {}

const Sharebuilder: React.SFC<SharebuilderProps> = () => {
  const [link, setLink] = useState('');

  return (
    <div className="flex-container">
      <Segment
        className="content"
        style={{ margin: '5rem auto', maxWidth: '1000px' }}
        textAlign="center"
      >
        <h1>Share builder</h1>
        <h4>Indsæt ID'er eller links, adskilt af komma</h4>
        <Form>
          <Form.TextArea></Form.TextArea>
          <Form.Button>Opret link</Form.Button>
        </Form>
        {link && (
          <>
            <Divider />
            <p>
              Dette er dit link:
              <br />
              {link}
            </p>
          </>
        )}
      </Segment>
    </div>
  );
};

export default Sharebuilder;
