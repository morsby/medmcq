import BaseModel from './_base_model';
import { Model, ref } from 'objection';
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

class QuestionUserAnswer extends BaseModel {
  static get tableName() {
    return 'questionUserAnswer';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'questionUserAnswer.userId',
          to: 'user.id'
        }
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionUserAnswer.questionId',
          to: 'question.id'
        }
      },
      correctAnswers: {
        relation: Model.HasManyRelation,
        modelClass: QuestionCorrectAnswer,
        join: {
          from: 'questionUserAnswer.questionId',
          to: 'questionCorrectAnswer.questionId'
        }
      }
    };
  }
  static get modifiers() {
    return {
      summary: (builder) =>
        builder
          .select(
            'QuestionUserAnswer.*',
            'question:semester.id as semesterId',
            builder
              .modelClass()
              .relatedQuery('correctAnswers')
              .where('correctAnswers.answer', ref('questionUserAnswer.answer'))
              .count('*')
              .as('correct')
          )
          .joinRelation('question.semester')
    };
  }
}

module.exports = QuestionUserAnswer;
