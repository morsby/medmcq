import DataLoader from 'dataloader';
import * as questionLoaders from './questions';
import * as correctAnswerLoaders from './question_correct_answers';
import * as semesterLoaders from './semesters';
import * as examSetLoaders from './exam_sets';
import * as commentLoaders from './comments';
import * as userLoaders from './users';
import Question from '../../models/question';

// se https://github.com/graphql/dataloader#creating-a-new-dataloader-per-request
const generateLoaders = (userId: number) => ({
  questions: {
    questionsByIds: new DataLoader((ids: number[]) => questionLoaders.questionsByIds(ids)),
    byExamSetIds: new DataLoader((ids: number[]) => questionLoaders.questionsByExamSetIds(ids)),
    bySemesterIds: new DataLoader((ids: number[]) => questionLoaders.questionsBySemesterIds(ids)),

    publicCommentsByQuestions: new DataLoader((questions: Question[]) =>
      questionLoaders.publicCommentsByQuestions(questions)
    ),
    privateCommentsByQuestionIds: new DataLoader((ids: number[]) =>
      questionLoaders.privateCommentsByQuestionIds(userId, ids)
    ),
    specialtiesByQuestionIds: new DataLoader((ids: number[]) =>
      questionLoaders.specialtiesByQuestionIds(userId, ids)
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
    byExamSetIds: new DataLoader((examSetIds: number[]) =>
      semesterLoaders.semestersByExamSetIds(examSetIds)
    )
  },

  examSets: {
    byIds: new DataLoader((ids: number[]) => examSetLoaders.examSetByIds(ids)),
    byQuestions: new DataLoader((questions: Question[]) =>
      examSetLoaders.examSetByQuestions(questions)
    ),
    bySemesterIds: new DataLoader((ids: number[]) => examSetLoaders.examSetBySemesterIds(ids))
  },

  comments: {
    byIds: new DataLoader((ids: number[]) => commentLoaders.commentByIds(ids)),
    byQuestionIds: new DataLoader((ids: number[]) =>
      commentLoaders.commentByQuestionIdsAndUser(ids, userId)
    ),
    byUserIds: new DataLoader((ids: number[]) => commentLoaders.commentByUserIds(ids))
  },

  users: {
    byIds: new DataLoader((ids: number[]) => userLoaders.userByIds(ids))
  }
});

export default generateLoaders;
