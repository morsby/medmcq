import { gql } from 'apollo-server-express';
import Question from 'models/question';
import QuestionSpecialtyVote from 'models/question_specialty_vote';
import Comment from 'models/question_comment';
import QuestionCorrectAnswer from 'models/question_correct_answer';
import QuestionTagVote from 'models/question_tag_vote';
import QuestionImage from 'models/question_image';
import QuestionUserAnswer from 'models/question_user_answer';
import QuestionComment from 'models/question_comment';
import { urls } from 'misc/vars';
import ExamSet from 'models/exam_set';
import Semester from 'models/semester';
import sgMail from '@sendgrid/mail';
import _ from 'lodash';
import User from 'models/user';
import { Resolvers } from 'types/resolvers-types';

export const typeDefs = gql`
  extend type Query {
    questions(filter: QuestionFilterInput!): [Question!]
  }

  extend type Mutation {
    reportQuestion(report: String!, questionId: Int!): String
    createQuestion(data: QuestionInput): Question
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
    examSetId: Int
    onlyNew: Boolean
    onlyWrong: Boolean
    commentIds: [Int]
    profile: Boolean
    search: String
  }

  type Question {
    id: Int
    text: String
    answer1: QuestionAnswer
    answer2: QuestionAnswer
    answer3: QuestionAnswer
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

  type QuestionAnswer {
    answer: String
    correctPercent: Int
  }

  input QuestionInput {
    answer1: String!
    answer2: String!
    answer3: String!
    correctAnswers: [Int!]!
    text: String!
    images: [String]
    examSetQno: Int!
    examSetId: Int!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    questions: async (args, { filter }, ctx) => {
      const {
        ids,
        season,
        year,
        semesterId,
        text,
        tagIds,
        specialtyIds,
        examSetId,
        search,
        onlyNew,
        onlyWrong,
        commentIds
      } = filter;
      let { n } = filter;

      if (!filter) throw new Error('No arguments for filter provided');
      let query = Question.query();

      if (ids) return query.findByIds(ids);
      if (commentIds)
        return QuestionComment.query()
          .findByIds(commentIds)
          .select('questionId as id');

      query = query
        .join('semesterExamSet as examSet', 'question.examSetId', 'examSet.id')
        .join('semester', 'examSet.semesterId', 'semester.id');
      if (semesterId) {
        query = query.where('semester.id', '=', semesterId);
      }

      // Specifics
      if (examSetId) return query.where('examSet.id', examSetId);
      if (search)
        return query.whereRaw(
          'MATCH (text, answer1, answer2, answer3) AGAINST (? IN BOOLEAN MODE)',
          search
        );

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
        const votes = await QuestionSpecialtyVote.query()
          .whereIn('specialtyId', specialtyIds)
          .groupBy('questionId')
          .sum('value as votes')
          .having('votes', '>', '-1')
          .select('questionId');

        query = query
          .join('questionSpecialtyVote as specialtyVote', 'question.id', 'specialtyVote.questionId')
          .whereIn(
            'question.id',
            votes.map((specialtyVote) => specialtyVote.questionId)
          );
      }

      if (tagIds && tagIds.length > 0) {
        const votes = await QuestionTagVote.query()
          .whereIn('tagId', tagIds)
          .groupBy('questionId')
          .sum('value as votes')
          .having('votes', '>', '-1')
          .select('questionId');

        query = query
          .join('questionTagVote as tagVote', 'question.id', 'tagVote.questionId')
          .whereIn(
            'question.id',
            votes.map((vote) => vote.questionId)
          );
      }

      if (text) {
        query = query.whereRaw(
          'MATCH (text, answer1, answer2, answer3) AGAINST (? IN BOOLEAN MODE)',
          filter.text
        );
      }

      if (ctx.user && onlyWrong) {
        const correctAnswers = QuestionUserAnswer.query()
          .where({ userId: ctx.user.id })
          .join(
            'questionCorrectAnswer',
            'questionUserAnswer.questionId',
            '=',
            'questionCorrectAnswer.questionId'
          )
          .whereRaw('question_user_answer.answer = question_correct_answer.answer')
          .select('questionUserAnswer.questionId');

        query = query.whereNotIn('question.id', correctAnswers);
      } else if (ctx.user && onlyNew) {
        query = query.whereNotIn(
          'question.id',
          QuestionUserAnswer.query()
            .where({ userId: ctx.user.id })
            .distinct('questionId')
        );
      }

      const questions = await query.groupBy('question.id').select('question.id as id');
      return questions.map((question) => ({ id: question.id }));
    }
  },

  Mutation: {
    createQuestion: async (root, { data }, ctx) => {
      const user = await User.query().findById(ctx.user?.id);
      if (user?.roleId >= 3) throw new Error('Not permitted');
      const {
        answer1,
        answer2,
        answer3,
        correctAnswers,
        text,
        images,
        examSetQno,
        examSetId
      } = data;
      const question = await Question.query().insertAndFetch({
        answer1,
        answer2,
        answer3,
        text,
        examSetId,
        examSetQno
      });
      await QuestionCorrectAnswer.query().insertGraph(
        correctAnswers.map((answer) => ({ answer, questionId: question.id }))
      );
      if (!!images) {
        await QuestionImage.query().insertGraph(
          images.map((image) => ({ link: image, questionId: question.id }))
        );
      }

      return { id: question.id };
    },
    reportQuestion: async (root, { report, questionId }) => {
      const question = await Question.query().findById(questionId);
      const examSet = await ExamSet.query().findById(question.examSetId);
      const semester = await Semester.query().findById(examSet.semesterId);

      const msg = {
        to: urls.issue,
        from: `medMCQ-app <${urls.fromEmail}>`,
        subject: `Fejl i spørgsmål med id ${question.id}`,
        text: `
  Der er blevet rapporteret en fejl i følgende spørgsmål:
  - ID: ${question.id}
  - Semester: ${semester.value}
  - Sæt: ${examSet.year}/${examSet.season}
  - Spørgsmålnummer: ${question.examSetQno}
  <hr>
  <strong>Indrapporteringen lyder:</strong>
  ${report}
  <hr>
  <strong>Spørgsmålet lyder:</strong>
  ${question.text}<br>
  A. ${question.answer1}<br>
  B. ${question.answer2}<br>
  C. ${question.answer3}
  `
      };

      sgMail.send(msg);

      return `Question (ID: ${question.id}) reported`;
    }
  },

  Question: {
    id: ({ id }) => id,
    text: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      return question.text;
    },
    answer1: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      let answers = await ctx.userAnswersByQuestionIdLoader.load(id);
      answers = _(answers)
        .sortBy((answer) => answer.createdAt, 'asc')
        .uniqBy((answer) => answer.userId)
        .value();
      let correctPercent = 100;
      if (answers.length > 0) {
        correctPercent = Math.round(
          (answers.filter((answer) => answer.answer === 1).length / answers.length) * 100
        );
      }
      return { answer: question.answer1, correctPercent };
    },
    answer2: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      let answers = await ctx.userAnswersByQuestionIdLoader.load(id);
      answers = _(answers)
        .sortBy((answer) => answer.createdAt, 'asc')
        .uniqBy((answer) => answer.userId)
        .value();
      const correctPercent = Math.round(
        (answers.filter((answer) => answer.answer === 2).length / answers.length) * 100
      );
      return { answer: question.answer2, correctPercent };
    },
    answer3: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      let answers = await ctx.userAnswersByQuestionIdLoader.load(id);
      answers = _(answers)
        .sortBy((answer) => answer.createdAt, 'asc')
        .uniqBy((answer) => answer.userId)
        .value();
      const correctPercent = Math.round(
        (answers.filter((answer) => answer.answer === 3).length / answers.length) * 100
      );
      return { answer: question.answer3, correctPercent };
    },
    images: async ({ id }, args, ctx) => {
      const images = await QuestionImage.query().where({ questionId: id });
      return images.map((image) => image.link);
    },
    oldId: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      return question.oldId;
    },
    examSetQno: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      return question.examSetQno;
    },
    examSet: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      const examSet = await ctx.examSetsLoader.load(question.examSetId);
      return { id: examSet.id };
    },
    publicComments: async ({ id }, _, ctx) => {
      const publicComments = await Comment.query()
        .where('questionId', id)
        .where({ private: 0 });
      return publicComments.map((pc) => ({ id: pc.id }));
    },
    privateComments: async ({ id }, args, ctx) => {
      if (!ctx.user) return [];
      let privateComments = await Comment.query().where({
        questionId: id,
        private: 1,
        userId: ctx.user.id
      });
      return privateComments.map((comment) => ({ id: comment.id }));
    },
    correctAnswers: async ({ id }, args, ctx) => {
      const correctAnswers = await QuestionCorrectAnswer.query().where('questionId', id);
      return correctAnswers.map((ca) => ca.answer);
    },
    specialtyVotes: async ({ id }, args, ctx) => {
      const specialtyVotes = await QuestionSpecialtyVote.query().where('questionId', id);
      return specialtyVotes.map((sv) => ({ id: sv.id }));
    },
    tagVotes: async ({ id }, _, ctx) => {
      const tagVotes = await QuestionTagVote.query().where('questionId', id);
      return tagVotes.map((tv) => ({ id: tv.id }));
    },
    createdAt: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      return question.createdAt.toISOString();
    },
    updatedAt: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      return question.updatedAt.toISOString();
    },
    specialties: async ({ id }, args, ctx) => {
      const specialties = await QuestionSpecialtyVote.query()
        .where({ questionId: id })
        .groupBy('specialtyId')
        .sum('value as votes')
        .having('votes', '>', '-1')
        .orderBy('votes', 'desc')
        .select('specialtyId');

      return specialties.map((s) => ({ id: s.specialtyId }));
    },
    tags: async ({ id }, args, ctx) => {
      const tags = await QuestionTagVote.query()
        .where({ questionId: id })
        .groupBy('tagId')
        .sum('value as votes')
        .having('votes', '>', '-1')
        .orderBy('votes', 'desc')
        .select('tagId');

      return tags.map((t) => ({ id: t.tagId }));
    }
  }
};
