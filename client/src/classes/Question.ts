import { gql } from 'apollo-boost';
import Comment from 'classes/Comment';
import Specialty from 'classes/Specialty';
import Tag from './Tag';
import { store } from 'IndexApp';
import Apollo from './Apollo';
import questionsReducer from 'redux/reducers/question';
import quizReducer from 'redux/reducers/quiz';
import { Question as QuestionType, QuestionFilterInput } from 'types/generated';

interface Question extends QuestionType {
  isLiked: boolean;
}

class Question {
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
      answer1 {
        answer
        correctPercent
      }
      answer2 {
        answer
        correctPercent
      }
      answer3 {
        answer
        correctPercent
      }
      images
      correctAnswers
      publicComments {
        ...Comment
      }
      privateComments {
        ...Comment
      }
    }
    ${Comment.fragmentFull}
    ${Tag.tagVoteFragment}
    ${Specialty.specialtyVoteFragment}
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

    const questions = await Apollo.query<Question[]>('questions', query, { filter });

    if (newQuiz) {
      await store.dispatch(quizReducer.actions.changeQuestion(0));
      await store.dispatch(
        quizReducer.actions.setQuestionIds(questions.map((question) => question.id))
      );
    }
    await store.dispatch(questionsReducer.actions.setQuestions(questions));
  };

  static report = async (data: { report: string; questionId: number }) => {
    const mutation = gql`
      mutation($report: String!, $questionId: Int!) {
        reportQuestion(report: $report, questionId: $questionId)
      }
    `;

    await Apollo.mutate('reportQuestion', mutation, data);
  };

  static create = async (data: any) => {
    const mutation = gql`
      mutation CreateQuestion($data: QuestionInput) {
        createQuestion(data: $data) {
          ...Question
        }
      }
      ${Question.fullFragment}
    `;

    const question = await Apollo.mutate<Question>('createQuestion', mutation, { data });
    store.dispatch(questionsReducer.actions.addQuestion(question));
  };
}

export default Question;
