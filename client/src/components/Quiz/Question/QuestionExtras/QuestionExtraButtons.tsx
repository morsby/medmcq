import React from 'react';
import { Translate } from 'react-localize-redux';
import { Button, Divider } from 'semantic-ui-react';

const QuestionExtraButtons = ({
  width,
  onReportToggle,
  onPrivateCommentsToggle,
  privateCommentsOpen,
  user,
  publicCommentsOpen,
  publicComments,
  privateComments,
  onPublicCommentsToggle
}) => {
  return (
    <>
      <Button color={publicCommentsOpen ? 'green' : null} basic onClick={onPublicCommentsToggle}>
        {publicCommentsOpen ? (
          <Translate id="question.hide_public_comments" data={{ n: publicComments }} />
        ) : (
          <Translate id="question.show_public_comments" data={{ n: publicComments }} />
        )}
      </Button>
      {user && (
        <Button
          color={privateCommentsOpen ? 'green' : null}
          basic
          onClick={onPrivateCommentsToggle}
        >
          {privateCommentsOpen ? (
            <Translate id="question.hide_private_comments" data={{ n: privateComments }} />
          ) : (
            <Translate id="question.show_private_comments" data={{ n: privateComments }} />
          )}
        </Button>
      )}
      {width <= 700 && <Divider hidden />}
      <Button basic color="orange" floated={width > 700 ? 'right' : null} onClick={onReportToggle}>
        <Translate id="question.report_question" />
      </Button>
    </>
  );
};

export default QuestionExtraButtons;
