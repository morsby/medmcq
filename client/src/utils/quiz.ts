import { store } from 'IndexApp';
import Question from 'classes/Question';
import { ReduxState } from 'redux/reducers';
import { AnswerInput, Answer } from 'types/generated';

export const smoothScroll = (h?: number, dir = 'up') => {
  let top = window.pageYOffset || document.documentElement.scrollTop;
  let bottom = document.body.scrollHeight;
  let px = 20;
  let i = h || top;
  if (dir === 'up') {
    if (i > px) {
      setTimeout(() => {
        window.scrollTo(0, i);
        smoothScroll(i - px);
      }, 10);
    } else {
      window.scrollTo(0, 0);
    }
  } else if (dir === 'down') {
    if (i < bottom - px) {
      setTimeout(() => {
        window.scrollTo(0, i);
        smoothScroll(i + px, dir);
      }, 10);
    } else {
      window.scrollTo(0, bottom);
    }
  }
};

export const evalAnswer = (question, userAnswer, answerNo, examMode) => {
  if (!userAnswer) return null; // hvis ikke svaret

  if (examMode) {
    if (answerNo === userAnswer) {
      return 'blue';
    }
  } else {
    if (question.correctAnswers.includes(answerNo)) {
      return 'green';
    } else if (answerNo === userAnswer) {
      return 'red'; // hvis forkert svar
    } else {
      return 'grey'; // ikke valgt mulighed
    }
  }
};

export const calculateResults = (questions: Question[], answers: Partial<AnswerInput>[]) => {
  let res = {
    status: true,
    n: 0,
    correct: 0,
    percentage: '0%'
  };
  for (let answer of answers) {
    res.n++;
    if (
      questions
        .find((question) => question.id === answer.questionId)
        ?.correctAnswers.includes(answer.answer)
    )
      res.correct++;
  }

  if (res.n === 0) {
    return { status: false };
  }

  res.percentage = `${Math.round((res.correct / res.n) * 10000) / 100}%`;

  return res;
};

export const subSupScript = (text) => {
  return text.replace(/\^(.+?)\^/g, '<sup>$1</sup>').replace(/~(.+?)~/g, '<sub>$1</sub>');
};

export const isAnswered = (question: Question, answers: AnswerInput[]) => {
  return !!answers.find((answer) => answer.questionId === question.id);
};
