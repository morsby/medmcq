import React from 'react';
import { Translate } from 'react-localize-redux';
import { Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import quizReducer from 'redux/reducers/quiz';

export interface QuestionExtraButtonsProps {
  onReportToggle: () => void;
  onPrivateCommentsToggle: () => void;
  onPublicCommentsToggle: () => void;
  privateCommentsOpen: boolean;
  publicCommentsOpen: boolean;
  reportOpen: boolean;
}

const QuestionExtraButtons: React.SFC<QuestionExtraButtonsProps> = ({
  onReportToggle,
  onPrivateCommentsToggle,
  onPublicCommentsToggle,
  privateCommentsOpen,
  publicCommentsOpen,
  reportOpen
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: ReduxState) => state.auth.user);
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const percentagesHided = useSelector((state: ReduxState) => state.quiz.hidePercentages);
  const comments = useSelector((state: ReduxState) =>
    state.questions.comments.filter((comment) => comment.question.id === question.id)
  );
  const isAnswered = !!useSelector((state: ReduxState) =>
    state.quiz.answers.find((answer) => answer.questionId === question.id)
  );
  const publicComments = comments.filter((comment) => !comment.isPrivate).length;
  const privateComments = comments.filter((comment) => comment.isPrivate).length;

  const handleHidePercentages = () => {
    dispatch(quizReducer.actions.togglePercentages());
  };

  return (
    <Menu stackable>
      <Menu.Item color="green" active={publicCommentsOpen} onClick={onPublicCommentsToggle}>
        {publicCommentsOpen ? (
          <>
            <Translate id="question.hide_public_comments" /> {`(${publicComments})`}
          </>
        ) : (
          <>
            <Translate id="question.show_public_comments" />{' '}
            {isAnswered ? `(${publicComments})` : null}
          </>
        )}
      </Menu.Item>
      {user && (
        <Menu.Item color="green" active={privateCommentsOpen} onClick={onPrivateCommentsToggle}>
          {privateCommentsOpen ? (
            <>
              <Translate id="question.hide_private_comments" /> {`(${privateComments})`}
            </>
          ) : (
            <>
              <Translate id="question.show_private_comments" />{' '}
              {isAnswered ? `(${privateComments})` : null}
            </>
          )}
        </Menu.Item>
      )}
      <Menu.Menu position="right">
        <Menu.Item onClick={handleHidePercentages}>
          {percentagesHided ? (
            <Translate id="question.show_percentages" />
          ) : (
            <Translate id="question.hide_percentages" />
          )}
        </Menu.Item>
        <Menu.Item color="orange" active={reportOpen} onClick={onReportToggle}>
          <Translate id="question.report_question" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default QuestionExtraButtons;
