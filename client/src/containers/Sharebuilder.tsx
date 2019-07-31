import React, { useState } from 'react';
import { Segment, Form, Divider, Message } from 'semantic-ui-react';
import { useMutation } from 'react-apollo-hooks';
import { createShareLink as query_createShareLink } from 'queries/shareLink';
import TagsInput from 'react-tagsinput';
import './ShareBuilder.css';

export interface SharebuilderProps {}

const Sharebuilder: React.SFC<SharebuilderProps> = () => {
  const [userInput, setUserInput] = useState([]);
  const [createShareLink, { loading, data, error }] = useMutation(query_createShareLink);

  const handleCreateLink = () => {
    let ids = [];
    userInput.forEach((input) => {
      const numbers = input.match(/\d+/g);

      // Vi tager det sidste nummer i linket, for altid at ramme det korrekte ID (eksempelvis hvis man deler inde i et share-link eller fra localhost:3000)
      ids.push(numbers[numbers.length - 1]);
    });

    createShareLink({ variables: { questionIds: ids } });
  };

  return (
    <div className="flex-container">
      <Segment
        className="content"
        style={{ margin: '5rem auto', maxWidth: '1000px' }}
        textAlign="center"
      >
        <h1>Share builder</h1>
        <h4>{"Indsæt ID'er eller links, adskilt af komma"}</h4>
        <Form>
          <TagsInput
            inputProps={{ placeholder: 'Indsæt links' }}
            onChange={(tags) => setUserInput(tags)}
            value={userInput}
            onlyUnique
            addKeys={[9, 13, 188]}
            removeKeys={[null]}
          ></TagsInput>
          <Form.Button disabled={loading} loading={loading} onClick={handleCreateLink}>
            Opret link
          </Form.Button>
        </Form>
        {error && error.message.includes('a foreign key constraint fails') && (
          <Message color="red">
            Det ser ud til at én af dine links indeholder et spørgsmåls ID, der ikke eksisterer.
          </Message>
        )}
        {error && !error.message.includes('a foreign key constraint fails') && (
          <Message color="red">
            <b> Der er gået noget galt, er du sikker på at alle dine links er korrekte? {} </b>
            <span>
              Fejlbeskeden er:
              <br /> {error.message}
            </span>
            )}
          </Message>
        )}
        {data && (
          <>
            <Divider />
            <p>
              Dette er dit link:
              <br />
              <a href={window.location.href + '/' + data.createShareLink}>
                {window.location.href + '/' + data.createShareLink}
              </a>
            </p>
          </>
        )}
      </Segment>
    </div>
  );
};

export default Sharebuilder;
