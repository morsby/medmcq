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
    votes: Int
  }

  type SpecialtyVote {
    id: Int
    specialty: Specialty
    question: Question
    user: User
    value: Int
  }

  input VoteInput {
    questionId: Int!
    metadataId: Int!
    vote: String
  }

  extend type Mutation {
    voteTag(data: VoteInput): TagVote
    voteSpecialty(data: VoteInput): SpecialtyVote
    suggestTag(tag: String!, questionId: Int!): String
  }
`;

export const resolvers = {
  Mutation: {
    voteTag: async (root, { questionId, metadataId, vote }, ctx: Context) => {
      const exists = await QuestionTagVote.query().findOne({ questionId, tagId: metadataId });
      let tagVote;
      if (exists) {
        tagVote = await QuestionTagVote.query().updateAndFetchById(exists.id, { value: vote });
      } else {
        tagVote = await QuestionTagVote.query().insertAndFetch({
          userId: ctx.user.id,
          tagId: metadataId,
          questionId,
          value: vote
        });
      }

      return tagVote || 'Deleted';
    },
    voteSpecialty: async (root, { questionId, metadataId, vote }, ctx: Context) => {
      const exists = await QuestionSpecialtyVote.query().findOne({ questionId, tagId: metadataId });
      let tagVote;
      if (exists) {
        tagVote = await QuestionSpecialtyVote.query().updateAndFetchById(exists.id, {
          value: vote
        });
        await QuestionSpecialtyVote.query().deleteById(exists.id);
      } else {
        tagVote = await QuestionSpecialtyVote.query().insertAndFetch({
          userId: ctx.user.id,
          specialtyId: metadataId,
          questionId,
          value: vote
        });
      }

      return tagVote || 'Deleted';
    }
  },
  TagVote: {
    id: ({ id }) => id,
    tag: () => {
      // TODO
    },
    question: () => {},
    user: () => {},
    votes: () => {}
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
    value: async ({ id }, args, ctx: Context) => {
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
        .distinct('questionId')
        .where(function() {
          this.sum('tagVote.value as votes').having('votes', '>', '-1');
        });

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
        .distinct('questionId')
        .where(function() {
          this.sum('specialtyVote.value as votes').having('votes', '>', '-1');
        });

      return questions.length;
    }
  }
};
