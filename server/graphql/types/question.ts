import { gql } from 'apollo-server-express';
import Question from 'models/question';
import { Context } from 'graphql/apolloServer';
import QuestionSpecialtyVote from 'models/question_specialty_vote';
import Comment from 'models/question_comment';
import QuestionCorrectAnswer from 'models/question_correct_answer';
import QuestionTagVote from 'models/question_tag_vote';
import QuestionImage from 'models/question_image';

export const typeDefs = gql`
  extend type Query {
    questions(filter: QuestionFilterInput!): [Question!]
  }

  input QuestionFilterInput {
    text: String
    specialtyIds: [Int]
    tagIds: [Int]
    semesterId: Int
    year: Int
    season: String
    ids: [Int]
    n: Int
    setId: Int
    onlyNew: Boolean
    onlyWrong: Boolean
    commentIds: [Int]
    profile: Boolean
    search: String
  }

  type Question {
    id: Int
    text: String
    answer1: String
    answer2: String
    answer3: String
    images: [String]
    oldId: String
    examSetQno: Int
    publicComments: [Comment]
    privateComments: [Comment]
    correctAnswers: [Int]
    specialtyVotes: [SpecialtyVote]
    tagVotes: [TagVote]
    specialties: [Specialty]
    tags: [Tag]
    examSet: ExamSet
    createdAt: String
    updatedAt: String
  }
`;

export const resolvers = {
  Query: {
    questions: async (args, { filter }) => {
      let { n, ids, season, year, semesterId, text, tagIds, specialtyIds, setId, search } = filter;

      let query = Question.query();

      if (!filter) throw new Error('No arguments for filter provided');

      if (ids) return query.findByIds(ids);

      query = query
        .join('semesterExamSet as examSet', 'question.examSetId', 'examSet.id')
        .join('semester', 'examSet.semesterId', 'semester.id');
      if (semesterId) {
        query = query.where('semester.id', '=', semesterId);
      }

      // Specifics
      if (setId) return query.where('examSet.id', setId);
      if (search)
        return query
          .joinRelation('semester')
          .whereRaw('MATCH (text, answer1, answer2, answer3) AGAINST (? IN BOOLEAN MODE)', search);

      // Start filtering based on other values

      query = query.orderByRaw('rand()');

      if (!n || n > 300) n = 300; // Man må ikke hente mere end 300
      query = query.limit(n);

      if (year) {
        query = query.where('examSet.year', '=', year);
      }

      if (season) {
        query = query.where('examSet.season', '=', season);
      }

      if (specialtyIds && specialtyIds.length > 0) {
        query = query
          .join('questionSpecialtyVote as specialtyVote', 'question.id', 'specialtyVote.questionId')
          .whereIn('specialtyVote.specialtyId', specialtyIds)
          .where(function() {
            this.sum('specialtyVote.value as votes').having('votes', '>', '-1');
          });
      }

      if (tagIds && tagIds.length > 0) {
        query = query
          .join('questionTagVote as tagVote', 'question.id', 'tagVote.questionId')
          .whereIn('tagVote.tagId', tagIds)
          .where(function() {
            this.sum('tagVote.value as votes').having('votes', '>', '-1');
          });
      }

      if (text) {
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
    images: async ({ id }, args, ctx: Context) => {
      const images = await QuestionImage.query().where({ questionId: id });
      return images.map((image) => image.link);
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
    publicComments: async ({ id }, _, ctx: Context) => {
      const publicComments = await Comment.query()
        .where('questionId', id)
        .where({ private: 0 });
      return publicComments.map((pc) => ({ id: pc.id }));
    },
    privateComments: async ({ id }, args, ctx: Context) => {
      if (!ctx.user) return [];
      let privateComments = await Comment.query().where({
        questionId: id,
        private: 1,
        userId: ctx.user.id
      });
      return privateComments.map((comment) => ({ id: comment.id }));
    },
    correctAnswers: async ({ id }, args, ctx: Context) => {
      const correctAnswers = await QuestionCorrectAnswer.query().where('questionId', id);
      return correctAnswers.map((ca) => ca.answer);
    },
    specialtyVotes: async ({ id }, args, ctx: Context) => {
      const specialtyVotes = await QuestionSpecialtyVote.query().where('questionId', id);
      return specialtyVotes.map((sv) => ({ id: sv.id }));
    },
    tagVotes: async ({ id }, _, ctx: Context) => {
      const tagVotes = await QuestionTagVote.query().where('questionId', id);
      return tagVotes.map((tv) => ({ id: tv.id }));
    },
    createdAt: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.createdAt.toISOString();
    },
    updatedAt: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      return question.updatedAt.toISOString();
    },
    specialties: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      const specialties = await QuestionSpecialtyVote.query()
        .where({ questionId: question.id })
        .where(function() {
          this.sum('specialtyVote.value as votes').having('votes', '>', '-1');
        })
        .distinct('specialtyId');

      return specialties.map((s) => ({ id: s.specialtyId }));
    },
    tags: async ({ id }, args, ctx: Context) => {
      const question = await ctx.questionLoaders.questionLoader.load(id);
      const tags = await QuestionTagVote.query()
        .where({ questionId: question.id })
        .where(function() {
          this.sum('tagVote.value as votes').having('votes', '>', '-1');
        })
        .distinct('tagId');

      console.log(tags);

      return tags.map((t) => ({ id: t.tagId }));
    }
  }
};
