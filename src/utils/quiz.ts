import Question from 'classes/Question';
import { UserAnswerInput, QuestionAnswer } from 'types/generated';

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

export const evalAnswer = (
  userAnswer: UserAnswerInput,
  answer: QuestionAnswer,
  examMode: boolean,
  isAnswered: boolean
) => {
  if (!isAnswered) return null; // hvis ikke svaret

  // ExamMode
  if (examMode && userAnswer && answer.id === userAnswer.answerId) {
    return 'blue';
  }

  if (!examMode) {
    if (answer.isCorrect) {
      return 'green';
    } else if (answer.id === userAnswer?.answerId) {
      return 'red'; // hvis forkert svar
    }
  } else {
    return 'grey'; // ikke valgt mulighed
  }
};

export const calculateResults = (
  questions: Question[],
  userAnswers: Partial<UserAnswerInput>[]
) => {
  let res = {
    status: true,
    n: 0,
    correct: 0,
    percentage: '0%',
  };
  for (let userAnswer of userAnswers) {
    res.n++;
    if (questions.flatMap((q) => q.answers).find((a) => userAnswer.answerId === a.id)?.isCorrect)
      res.correct++;
  }

  if (res.n === 0) {
    return { status: false };
  }

  res.percentage = `${Math.round((res.correct / res.n) * 10000) / 100}%`;

  return res;
};

export const subSupScript = (text: string) => {
  return text.replace(/\^(.+?)\^/g, '<sup>$1</sup>').replace(/~(.+?)~/g, '<sub>$1</sub>');
};

export const isAnswered = (question: Question, userAnswers: UserAnswerInput[]) => {
  return userAnswers.some((ua) => question.answers.some((qa) => qa.id === ua.answerId));
};
