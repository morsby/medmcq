import { Model } from 'objection';
import Question from 'models/question';
import User from 'models/user';
import QuestionCorrectAnswer from 'models/question_correct_answer';

interface QuestionUserAnswer {
  id: number;
  questionId: number;
  question: Question;
  user: User;
  correctAnswers: QuestionCorrectAnswer;
  answerTime: number;
}

class QuestionUserAnswer extends Model {
  static get tableName() {
    return 'questionUserAnswer';
  }
}

export default QuestionUserAnswer;
