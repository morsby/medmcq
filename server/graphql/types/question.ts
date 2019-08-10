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
    correctAnswers: [CorrectAnswer]
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
      return ctxt.dataloaders.questions.questionsByIds.load(id);
    }
  },

  Question: {
    text: async ({ id }, _, ctxt) => {
      const { text } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return text;
    },

    answer1: async ({ id }, _, ctxt) => {
      const { answer1 } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return answer1;
    },
    answer2: async ({ id }, _, ctxt) => {
      const { answer2 } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return answer2;
    },
    answer3: async ({ id }, _, ctxt) => {
      const { answer3 } = await ctxt.dataloaders.questions.questionsByIds.load(id);
      return answer3;
    },
    correctAnswers: async ({ id }, _args, ctxt) => {
      const answers = await ctxt.dataloaders.correctAnswers.byQuestionIds.load(id);
      console.log(answers);
      console.log(id);
      return answers.map((a) => ({ id: a.id }));
    },
    examSet: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.examSetByQuestions.load(question),
    semester: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.semesterByQuestions.load(question),
    publicComments: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.publicCommentsByQuestions.load(question),
    privateComments: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.privateCommentsByQuestionIds.load(question.id),
    specialties: async (question, _, ctxt) =>
      ctxt.dataloaders.questions.specialtiesByQuestionIds.load(question.id)
  },

  Mutation: {
    createQuestion: async () => {
      return 'done';
    }
  }
};
