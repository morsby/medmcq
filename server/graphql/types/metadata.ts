import { gql } from 'apollo-server-express';
import { Context } from 'graphql/apolloServer';
import QuestionTagVote from 'models/question_tag_vote';
import QuestionSpecialtyVote from 'models/question_specialty_vote';

export const typeDefs = gql`
  type Specialty {
    id: Int
    name: String
    semester: Semester
    createdAt: String
    updatedAt: String
    oldId: String
    questionCount: Int
  }

  type Tag {
    id: Int
    name: String
    semester: Semester
    createdAt: String
    updatedAt: String
    oldId: String
    parent: Tag
    questionCount: Int
  }

  type TagVote {
    id: Int
    tag: Tag
    question: Question
    user: User
    vote: Int
  }

  type SpecialtyVote {
    id: Int
    specialty: Specialty
    question: Question
    user: User
    vote: Int
  }

  input VoteInput {
    questionId: Int!
    metadataId: Int!
    vote: Int
  }

  extend type Mutation {
    voteTag(data: VoteInput): Question
    voteSpecialty(data: VoteInput): Question
    suggestTag(tag: String!, questionId: Int!): String
  }
`;

export const resolvers = {
  Mutation: {
    voteTag: async (root, { data }, ctx: Context) => {
      const { questionId, metadataId, vote } = data;
      const userId = ctx.user.id;
      const exists = await QuestionTagVote.query().findOne({
        questionId,
        tagId: metadataId,
        userId
      });
      let tagVote: QuestionTagVote;
      if (exists) {
        tagVote = await exists.$query().updateAndFetch({ value: vote });
      } else {
        tagVote = await QuestionTagVote.query().insert({
          userId,
          tagId: metadataId,
          questionId,
          value: vote
        });
      }

      // Kan ikke få det til at virke uden
      ctx.questionLoaders.questionLoader.clear(questionId);
      ctx.metadataLoaders.tagVotesLoader.clear(tagVote.id);

      return { id: questionId };
    },
    voteSpecialty: async (root, { data }, ctx: Context) => {
      const { questionId, metadataId, vote } = data;
      const userId = ctx.user.id;
      const exists = await QuestionSpecialtyVote.query().findOne({
        questionId,
        specialtyId: metadataId,
        userId
      });

      let specialtyVote: QuestionSpecialtyVote;
      if (exists) {
        specialtyVote = await exists.$query().updateAndFetch({
          value: vote
        });
        // await QuestionSpecialtyVote.query().deleteById(exists.id);
      } else {
        specialtyVote = await QuestionSpecialtyVote.query().insertAndFetch({
          userId: ctx.user.id,
          specialtyId: metadataId,
          questionId,
          value: vote
        });
      }

      ctx.questionLoaders.questionLoader.clear(questionId);
      ctx.metadataLoaders.specialtyVoteLoader.clear(specialtyVote.id);
      return { id: questionId };
    }
  },
  TagVote: {
    id: ({ id }) => id,
    tag: async ({ id }, _, ctx: Context) => {
      const tagVote = await ctx.metadataLoaders.tagVotesLoader.load(id);
      return { id: tagVote.tagId };
    },
    question: async ({ id }, _, ctx: Context) => {
      const tagVote = await ctx.metadataLoaders.tagVotesLoader.load(id);
      return { id: tagVote.questionId };
    },
    user: async ({ id }, _, ctx: Context) => {
      const tagVote = await ctx.metadataLoaders.tagVotesLoader.load(id);
      return { id: tagVote.userId };
    },
    vote: async ({ id }, _, ctx: Context) => {
      const tagVote = await ctx.metadataLoaders.tagVotesLoader.load(id);
      return tagVote.value;
    }
  },
  SpecialtyVote: {
    id: ({ id }) => id,
    specialty: async ({ id }, _, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return { id: specialtyVote.specialtyId };
    },
    question: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return { id: specialtyVote.questionId };
    },
    user: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return { id: specialtyVote.userId };
    },
    vote: async ({ id }, args, ctx: Context) => {
      const specialtyVote = await ctx.metadataLoaders.specialtyVoteLoader.load(id);
      return specialtyVote.value;
    }
  },
  Tag: {
    id: ({ id }) => id,
    name: async ({ id }, _, ctx: Context) => {
      const tag = await ctx.metadataLoaders.tagLoader.load(id);
      return tag.name;
    },
    semester: async ({ id }, _, ctx: Context) => {
      const tag = await ctx.metadataLoaders.tagLoader.load(id);
      return { id: tag.semesterId };
    },
    parent: async ({ id }, _, ctx: Context) => {
      const tag = await ctx.metadataLoaders.tagLoader.load(id);
      return { id: tag.parentId };
    },
    questionCount: async ({ id }, _, ctx: Context) => {
      const questions = await QuestionTagVote.query()
        .where({ tagId: id })
        .groupBy('questionId')
        .sum('value as votes')
        .having('votes', '>', '-1')
        .orderBy('votes', 'desc')
        .select('questionId');

      return questions.length;
    }
  },
  Specialty: {
    id: ({ id }) => id,
    name: async ({ id }, _, ctx: Context) => {
      const specialty = await ctx.metadataLoaders.specialtyLoader.load(id);
      return specialty.name;
    },
    semester: async ({ id }, _, ctx: Context) => {
      const specialty = await ctx.metadataLoaders.specialtyLoader.load(id);
      return { id: specialty.semesterId };
    },
    questionCount: async ({ id }, _, ctx: Context) => {
      const questions = await QuestionSpecialtyVote.query()
        .where({ specialtyId: id })
        .groupBy('questionId')
        .sum('value as votes')
        .having('votes', '>', '-1')
        .orderBy('votes', 'desc')
        .select('questionId');

      return questions.length;
    }
  }
};
