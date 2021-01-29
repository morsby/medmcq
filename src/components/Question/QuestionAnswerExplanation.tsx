import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { Message } from 'semantic-ui-react';
import { QuestionAnswer } from 'types/generated';

const QuestionAnswerExplanation = ({ answer }: { answer: QuestionAnswer }) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const userAnswer = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.find((userAnswer) => userAnswer.answerId === answer.id)
  );
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const isAnswered = !!userAnswer;
  const allUserAnswers = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.filter((userAnswer) =>
      question.answers.some((a) => a.id === userAnswer.answerId)
    )
  );
  const singleMode = useSelector((state: ReduxState) => state.quiz.singleMode);
  const hasBeenAnswered = allUserAnswers.length > 0;
  const multiActivated = singleMode && hasBeenAnswered;

  if ((!isAnswered && !multiActivated) || !answer.explanation || examMode) return null;
  return (
    <Message
      color={answer.isCorrect ? 'green' : 'grey'}
      key={'answerExplanation' + answer.index.toString()}
    >
      {answer.explanation}
    </Message>
  );
};

export default QuestionAnswerExplanation;
