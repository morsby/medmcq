import React from 'react';
import { Translate } from 'react-localize-redux';
import { Button, Divider } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

const QuestionExtraButtons = ({
  width,
  onReportToggle,
  onPrivateCommentsToggle,
  privateCommentsOpen,
  user,
  publicCommentsOpen,
  onPublicCommentsToggle
}) => {
  return (
    <>
      <Button color={publicCommentsOpen ? 'green' : null} basic onClick={onPublicCommentsToggle}>
        {publicCommentsOpen ? (
          <Translate
            id='question.hide_public_comments'
            data='FIX'
          />
        ) : (
          <Translate
            id='question.show_public_comments'
            data='FIX'
          />
        )}
      </Button>
      {user && (
        <Button
          color={privateCommentsOpen ? 'green' : null}
          basic
          onClick={onPrivateCommentsToggle}
        >
          {privateCommentsOpen ? (
            <Translate
              id='question.hide_private_comments'
              data='FIX'
            />
          ) : (
            <Translate
              id='question.show_private_comments'
              data='FIX'
            />
          )}
        </Button>
      )}
      {width <= 700 && <Divider hidden />}
      <Button basic color='orange' floated={width > 700 ? 'right' : null} onClick={onReportToggle}>
        <Translate id='question.report_question' />
      </Button>
    </>
  );
};

QuestionExtraButtons.propTypes = {
  width: PropTypes.number,
  onReportToggle: PropTypes.func,
  onPrivateCommentsToggle: PropTypes.func,
  privateCommentsOpen: PropTypes.bool,
  user: PropTypes.object,
  publicCommentsOpen: PropTypes.bool,
  onPublicCommentsToggle: PropTypes.func
};

export default QuestionExtraButtons;
