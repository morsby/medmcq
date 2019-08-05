import { gql } from 'apollo-server-express';
import Question from '../../models/question';

// Husk altid extend på alle typer af queries, da det er et krav for modularitet af graphql
// (måske i fremtiden det ikke behøves)
export const typeDefs = gql`
  type Question {
    id: Int
    oldId: String
    text: String
    image: String
    answer1: String
    answer2: String
    answer3: String
    correctAnswers: [Int]
    examSetQno: Int
    examSet: ExamSet
    semester: Semester
    specialties: [SpecialtyVote]
    tags: [TagVote]
    publicComments: [Comment]
    privateComments: [Comment]
  }

  type ExamSet {
    id: ID
    year: Int
    season: String
  }

  type Semester {
    id: ID
    value: Int
    name: String
  }
  type SpecialtyVote {
    id: ID
  }
  type TagVote {
    id: ID
  }
  type Comment {
    id: ID
    text: String
  }

  type CorrectAnswer {
    id: ID
    answer: Int
    questionId: ID
  }

  input QuestionFilter {
    q: String
    id: ID
    title: String
    views: Int
    views_lt: Int
    views_lte: Int
    views_gt: Int
    views_gte: Int
    user_id: ID
  }

  type ListMetadata {
    count: Int!
  }

  extend type Query {
    Question(id: ID!): Question

    allQuestions(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: QuestionFilter
    ): [Question]

    _allQuestionsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: QuestionFilter
    ): ListMetadata
  }

  extend type Mutation {
    createQuestion(title: String!, views: Int!, user_id: ID!): Question
    updateQuestion(id: ID!, title: String!, views: Int!, user_id: ID!): Question
    deleteQuestion(id: ID!): Question
  }
`;

export const resolvers = {
  Query: {
    allQuestions: async () => {
      return await Question.query().select('id');
    },

    Question: (_root, { id }, ctxt) => {
      return ctxt.questionLoaders.questionLoader.load(id);
    }
  },

  Question: {
    text: async ({ id }, _, ctxt) => {
      const { text } = await ctxt.questionLoaders.questionLoader.load(id);
      return text;
    },

    answer1: async ({ id }, _, ctxt) => {
      const { answer1 } = await ctxt.questionLoaders.questionLoader.load(id);
      return answer1;
    },
    answer2: async ({ id }, _, ctxt) => {
      const { answer2 } = await ctxt.questionLoaders.questionLoader.load(id);
      return answer2;
    },
    answer3: async ({ id }, _, ctxt) => {
      const { answer3 } = await ctxt.questionLoaders.questionLoader.load(id);
      return answer3;
    },
    correctAnswers: async (question, _, ctxt) => {
      const answers = await ctxt.questionLoaders.correctAnswersLoader.load(question.id);
      return answers.map((a) => a.answer);
    },
    examSet: async (question, _, ctxt) => ctxt.questionLoaders.examSetLoader.load(question),
    semester: async (question, _, ctxt) => ctxt.questionLoaders.semesterLoader.load(question),
    publicComments: async (question, _, ctxt) =>
      ctxt.questionLoaders.publicCommentsLoader.load(question),
    privateComments: async (question, _, ctxt) =>
      ctxt.questionLoaders.privateCommentsLoader.load(question.id)
  },

  Mutation: {
    createQuestion: async () => {
      return 'done';
    }
  }
};
