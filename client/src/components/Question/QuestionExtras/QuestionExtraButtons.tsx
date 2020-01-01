import React from 'react';
import { Translate } from 'react-localize-redux';
import { Button, Divider } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface QuestionExtraButtonsProps {
  width: number;
  onReportToggle: () => void;
  onPrivateCommentsToggle: () => void;
  onPublicCommentsToggle: () => void;
  privateCommentsOpen: boolean;
  publicCommentsOpen: boolean;
}

const QuestionExtraButtons: React.SFC<QuestionExtraButtonsProps> = ({
  width,
  onReportToggle,
  onPrivateCommentsToggle,
  onPublicCommentsToggle,
  privateCommentsOpen,
  publicCommentsOpen
}) => {
  const user = useSelector((state: ReduxState) => state.auth.user);
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const comments = useSelector((state: ReduxState) =>
    state.questions.comments.filter((comment) => comment.question.id === question.id)
  );
  const publicComments = comments.filter((comment) => !comment.isPrivate).length;
  const privateComments = comments.filter((comment) => comment.isPrivate).length;

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
