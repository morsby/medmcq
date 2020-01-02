import { gql } from 'apollo-boost';
import Comment from 'classes/Comment';
import Specialty, { SpecialtyVote } from 'classes/Specialty';
import Tag, { TagVote } from './Tag';
import { store } from 'IndexApp';
import Apollo from './Apollo';
import questionsReducer from 'redux/reducers/question';
import quizReducer from 'redux/reducers/quiz';
import ExamSet from './ExamSet';

export interface QuestionFilterInput {
  text: string;
  specialtyIds: number[];
  tagIds: number[];
  semesterId: number;
  year: number;
  season: string;
  ids: number[];
  n: number;
  setId: number;
  onlyNew: boolean;
  onlyWrong: boolean;
  commentIds: number[];
  search: string;
}

interface Question {
  id: number;
  text: string;
  answer1: string;
  answer2: string;
  answer3: string;
  examSet: ExamSet;
  correctAnswers: number[];
  specialties: Specialty[];
  tags: Tag[];
  publicComments: Comment[];
  images: string[];
  privateComments: Comment[];
  tagVotes: TagVote[];
  specialtyVotes: SpecialtyVote[];
  isBookmarked: boolean;
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
      answer1
      answer2
      answer3
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
}

export default Question;
