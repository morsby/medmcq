import DataLoader from 'dataloader';
import * as questionLoaders from './questions';
import User from '../../models/user';
import Question from '../../models/question';
// se https://github.com/graphql/dataloader#creating-a-new-dataloader-per-request
const generateLoaders = (user: User) => ({
  questionLoaders: {
    questionsByIds: new DataLoader((ids: number[]) => questionLoaders.questionsByIds(ids)),
    correctAnswersByQuestionIds: new DataLoader((ids: number[]) =>
      questionLoaders.correctAnswersByQuestionIds(ids)
    ),
    examSetByQuestions: new DataLoader((questions: Question[]) =>
      questionLoaders.examSetByQuestions(questions)
    ),
    semesterByQuestions: new DataLoader((questions: Question[]) =>
      questionLoaders.semesterByQuestions(questions)
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
  }
});

export default generateLoaders;
