import { gql } from 'apollo-server-express';
import DataLoader from 'dataloader';
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

  type CorrectAnswer {
    id: ID
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

    Question: (_root, { id }) => ({ id })
  },

  Question: {
    text: async ({ id }) => {
      const { text } = await questionLoader.load(id);
      return text;
    },

    answer1: async ({ id }) => {
      const { answer1 } = await questionLoader.load(id);
      return answer1;
    },
    answer2: async ({ id }) => {
      const { answer2 } = await questionLoader.load(id);
      return answer2;
    },
    answer3: async ({ id }) => {
      const { answer3 } = await questionLoader.load(id);
      return answer3;
    },

    examSet: async (question) => {
      return examSetLoader.load(question);
    },
    semester: async (question) => {
      return semesterLoader.load(question);
    },
    publicComments: async (question, _, context) => {
      return publicCommentsLoader.load(question);
    }
  },

  Mutation: {
    createQuestion: async () => {
      return 'done';
    }
  }
};

const questionLoader = new DataLoader(async (ids: [number]) => {
  return await Question.query().findByIds(ids);
});

const examSetLoader = new DataLoader(async (questions: [Question]) => {
  const questionsWithExamSets = await Question.loadRelated(questions, 'examSet');

  return questionsWithExamSets.map((question) => question.examSet);
});

const semesterLoader = new DataLoader(async (questions: [Question]) => {
  const questionsWithSemesters = await Question.loadRelated(questions, 'semester');

  return questionsWithSemesters.map((q) => q.semester);
});

const publicCommentsLoader = new DataLoader(async (questions: [Question]) => {
  const questionsWithPublicComments = await Question.loadRelated(questions, 'publicComments');
  return questionsWithPublicComments.map((q) => q.publicComments);
});
