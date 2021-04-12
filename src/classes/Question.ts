import gql from 'graphql-tag';
import Comment from 'classes/Comment';
import Specialty from 'classes/Specialty';
import Tag from './Tag';
import { store } from 'IndexApp';
import API from './API.class';
import questionsReducer from 'redux/reducers/question';
import quizReducer from 'redux/reducers/quiz';
import { Question as QuestionType, QuestionFilterInput, QuestionInput } from 'types/generated';

interface Question extends QuestionType {
  isLiked?: boolean;
}

class Question {
  static questionAnswerFragment = gql`
    fragment QuestionAnswer on QuestionAnswer {
      id
      index
      isCorrect
      text
      explanation
    }
  `;

  static fullFragment = gql`
    fragment Question on Question {
      id
      text
      examSet {
        id
        semester {
          id
        }
      }
      specialties {
        id
      }
      tags {
        id
      }
      specialtyVotes {
        ...SpecialtyVote
      }
      tagVotes {
        ...TagVote
      }
      answers {
        ...QuestionAnswer
        correctPercent
      }
      images
      publicComments {
        ...Comment
      }
      privateComments {
        ...Comment
      }
      user {
        id
        username
      }
      isIgnored
    }
    ${Comment.fragmentFull}
    ${Tag.tagVoteFragment}
    ${Specialty.specialtyVoteFragment}
    ${Question.questionAnswerFragment}
  `;

  static fetch = async (filter: Partial<QuestionFilterInput>, newQuiz?: boolean) => {
    const query = gql`
      query($filter: QuestionFilterInput!) {
        questions(filter: $filter) {
          ...Question
        }
      }
      ${Question.fullFragment}
    `;

    const questions = await API.query<Question[]>('questions', query, { filter });

    if (newQuiz) {
      store.dispatch(quizReducer.actions.resetQuiz());
    }
    store.dispatch(questionsReducer.actions.setQuestions(questions));
  };

  static report = async (data: { report: string; questionId: number }) => {
    const mutation = gql`
      mutation($report: String!, $questionId: Int!) {
        reportQuestion(report: $report, questionId: $questionId)
      }
    `;

    await API.mutate('reportQuestion', mutation, data);
  };

  static create = async (data: QuestionInput) => {
    const mutation = gql`
      mutation CreateQuestion($data: QuestionInput) {
        createQuestion(data: $data) {
          ...Question
        }
      }
      ${Question.fullFragment}
    `;

    const question = await API.mutate<Question>('createQuestion', mutation, { data });
    store.dispatch(questionsReducer.actions.addQuestion(question));
  };

  static update = async (data: Partial<QuestionInput>) => {
    const mutation = gql`
      mutation UpdateQuestion($data: QuestionInput) {
        updateQuestion(data: $data) {
          ...Question
        }
      }
      ${Question.fullFragment}
    `;

    const question = await API.mutate<Question>('updateQuestion', mutation, { data });
    store.dispatch(questionsReducer.actions.addQuestion(question));
  };

  static ignore = async (id: number) => {
    const mutation = gql`
      mutation IgnoreQuestion($id: Int) {
        ignoreQuestion(id: $id) {
          ...Question
        }
      }
      ${Question.fullFragment}
    `;

    const question = await API.mutate<Question>('ignoreQuestion', mutation, { id });
    store.dispatch(questionsReducer.actions.addQuestion(question));
  };
}

export default Question;
