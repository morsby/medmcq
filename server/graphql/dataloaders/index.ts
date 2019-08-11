import DataLoader from 'dataloader';
import * as questionLoaders from './questions';
import * as correctAnswerLoaders from './question_correct_answers';
import * as semesterLoaders from './semesters';
import * as examSetLoaders from './exam_sets';
import User from '../../models/user';
import Question from '../../models/question';
// se https://github.com/graphql/dataloader#creating-a-new-dataloader-per-request
const generateLoaders = (user: User) => ({
  questions: {
    questionsByIds: new DataLoader((ids: number[]) => questionLoaders.questionsByIds(ids)),
    examSetByQuestions: new DataLoader((questions: Question[]) =>
      questionLoaders.examSetByQuestions(questions)
    ),
    publicCommentsByQuestions: new DataLoader((questions: Question[]) =>
      questionLoaders.publicCommentsByQuestions(questions)
    ),
    privateCommentsByQuestionIds: new DataLoader((ids: number[]) =>
      questionLoaders.privateCommentsByQuestionIds(user, ids)
    ),
    specialtiesByQuestionIds: new DataLoader((ids: number[]) =>
      questionLoaders.specialtiesByQuestionIds(user, ids)
    )
  },

  correctAnswers: {
    byIds: new DataLoader((ids: number[]) => correctAnswerLoaders.correctAnswersByIds(ids)),
    byQuestionIds: new DataLoader((questionIds: number[]) =>
      correctAnswerLoaders.correctAnswersByQuestionIds(questionIds)
    )
  },

  semesters: {
    byIds: new DataLoader((ids: number[]) => semesterLoaders.semesterByIds(ids)),
    byQuestions: new DataLoader((questions: Question[]) =>
      semesterLoaders.semesterByQuestions(questions)
    )
  },

  examSets: {
    byIds: new DataLoader((ids: number[]) => examSetLoaders.examSetByIds(ids)),
    byQuestions: new DataLoader((questions: Question[]) =>
      examSetLoaders.examSetByQuestions(questions)
    )
  }
});

export default generateLoaders;
