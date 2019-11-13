import { gql } from 'apollo-server-express';
import Question from 'models/question';
import { Context } from 'graphql/apolloServer';

export const typeDefs = gql`
  extend type Query {
    questions(filter: QuestionFilterInput): [Question!]
  }

  input QuestionFilterInput {
    text: String
    specialties: [Int]
    tags: [Int]
    semester: Int
    year: Int
    season: String
    ids: [Int]
    n: Int
  }

  type Question {
    id: Int
    text: String
    answer1: String
    answer2: String
    answer3: String
    image: String
    oldId: String
    examSetQno: Int
    semester: Semester
    publicComments: [Comment]
    correctAnswers: [CorrectAnswer]
    specialtyVotes: [SpecialtyVote]
    tagVotes: [TagVote]
    examSet: ExamSet
    createdAt: String
    updatedAt: String
  }

  type Semester {
    id: Int
    value: Int
    name: String
    shortName: String
  }

  type Comment {
    id: Int
    text: String
    private: Int
    questionId: Int
    userId: Int
    createdAt: String
    updatedAt: String
    user: User
  }

  type CorrectAnswer {
    id: Int
    answer: Int
    questionId: Int
    createdAt: String
    updatedAt: String
  }

  type TagVote {
    tagId: Int
    questionId: Int
    votes: Int
  }

  type User {
    id: Int
  }
`;

export const resolvers = {
  Query: {
    questions: async (args, { filter }) => {
      let query = Question.query();

      if (filter.ids) return query.findByIds(filter.id);

      query = query
        .join('semesterExamSet as examSet', 'question.examSetId', 'examSet.id')
        .join('semester', 'examSet.semesterId', 'semester.id');

      if (filter.semester) {
        query = query.where('semester.id', '=', filter.semester);
      }

      if (filter.year) {
        query = query.where('examSet.year', '=', filter.year);
      }

      if (filter.season) {
        query = query.where('examSet.season', '=', filter.season);
      }

      if (filter.specialties && filter.specialties.length > 0) {
        query = query
          .join('questionSpecialtyVote as specialtyVote', 'question.id', 'specialtyVote.questionId')
          .whereIn('specialtyVote.specialtyId', filter.specialties)
          .where(function() {
            this.sum('specialtyVote.value as votes').having('votes', '>', '-1');
          });
      }

      if (filter.tags && filter.tags.length > 0) {
        query = query
          .join('questionTagVote as tagVote', 'question.id', 'tagVote.questionId')
          .whereIn('tagVote.tagId', filter.tags)
          .where(function() {
            this.sum('tagVote.value as votes').having('votes', '>', '-1');
          });
      }

      if (filter.text) {
        query = query.whereRaw(
          'MATCH (text, answer1, answer2, answer3) AGAINST (? IN BOOLEAN MODE)',
          filter.text
        );
      }

      return query.groupBy('question.id').select('question.id as id');
    }
  },
  Question: {
    id: ({ id }) => id,
    text: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.text;
    },
    answer1: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.answer1;
    },
    answer2: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.answer2;
    },
    answer3: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.answer3;
    },
    image: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.image;
    },
    oldId: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.oldId;
    },
    examSetQno: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.examSetQno;
    },
    examSet: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      const examSet = await ctx.examSetLoaders.examSetsLoader.load(question.examSetId);
      return { id: examSet.id };
    },
    semester: () => {},
    publicComments: () => {},
    correctAnswers: ({ id }, args, ctx: Context) => {
      return ctx.questionLoaders.correctAnswersLoader.load(id);
    },
    specialtyVotes: async ({ id }, args, ctx: Context) => {
      const specialtyVotes = await ctx.specialtyLoaders.specialtyVotesByQuestionIdLoader.load(id);
      return specialtyVotes.map((sv) => ({ id: sv.id }));
    },
    tagVotes: () => {},
    createdAt: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.createdAt.toISOString();
    },
    updatedAt: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.updatedAt.toISOString();
    }
  }
};
