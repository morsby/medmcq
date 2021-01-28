import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { Message } from 'semantic-ui-react';
import { QuestionAnswer } from 'types/generated';

const QuestionAnswerExplanation = ({ answerNumber }: { answerNumber: number }) => {
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const answer: QuestionAnswer = question.answers.find((a) => a.index === answerNumber);
  const isAnswered = useSelector((state: ReduxState) =>
    state.quiz.userAnswers.some((userAnswer) =>
      question.answers.map((a) => a.id).includes(userAnswer.answerId)
    )
  );

  if (!isAnswered || !answer.explanation) return null;
  return (
    <Message
      color={answer.isCorrect ? 'green' : 'grey'}
      key={'answerExplanation' + answerNumber.toString()}
    >
      {answer.explanation}
    </Message>
  );
};

export default QuestionAnswerExplanation;
