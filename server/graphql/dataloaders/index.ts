import DataLoader from 'dataloader';
import questionLoaders from './questions';
import User from '../../models/user';
import Question from '../../models/question';
// se https://github.com/graphql/dataloader#creating-a-new-dataloader-per-request
const generateLoaders = (user: User) => ({
  questionLoaders: {
    questionLoader: new DataLoader((ids: [number]) => questionLoaders.questionLoader(ids)),
    correctAnswersLoader: new DataLoader((ids: [number]) =>
      questionLoaders.correctAnswersLoader(ids)
    ),
    examSetLoader: new DataLoader((questions: [Question]) =>
      questionLoaders.examSetLoader(questions)
    ),
    semesterLoader: new DataLoader((questions: [Question]) =>
      questionLoaders.semesterLoader(questions)
    ),
    publicCommentsLoader: new DataLoader((questions: [Question]) =>
      questionLoaders.publicCommentsLoader(questions)
    ),
    privateCommentsLoader: new DataLoader((ids: [number]) =>
      questionLoaders.privateCommentsLoader(user, ids)
    )
  }
});

export default generateLoaders;
