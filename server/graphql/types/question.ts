import { gql } from 'apollo-server-express';
import Question from 'models/question';
import QuestionSpecialtyVote from 'models/question_specialty_vote';
import Comment from 'models/question_comment';
import QuestionTagVote from 'models/question_tag_vote';
import QuestionImage from 'models/question_image';
import QuestionUserAnswer from 'models/question_user_answer';
import QuestionComment from 'models/question_comment';
import { urls } from 'misc/vars';
import sgMail from '@sendgrid/mail';
import _ from 'lodash';
import { Resolvers } from 'types/resolvers-types';
import ShareLink from 'models/shareLink';
import { permitAdmin } from 'graphql/utils';
import QuestionAnswer from 'models/questionAnswer.model';

export const typeDefs = gql`
  extend type Query {
    questions(filter: QuestionFilterInput!): [Question!]
  }

  extend type Mutation {
    reportQuestion(report: String!, questionId: Int!): String
    createQuestion(data: QuestionInput): Question
    updateQuestion(data: QuestionInput): Question
  }

  input QuestionFilterInput {
    specialtyIds: [Int]
    tagIds: [Int]
    semesterId: Int
    ids: [Int]
    n: Int
    examSetId: Int
    onlyNew: Boolean
    onlyWrong: Boolean
    commentIds: [Int]
    search: String
    shareId: String
  }

  type Question {
    id: Int
    text: String
    answers: [QuestionAnswer]
    images: [String]
    oldId: String
    examSetQno: Int
    publicComments: [Comment]
    privateComments: [Comment]
    specialtyVotes: [SpecialtyVote]
    tagVotes: [TagVote]
    specialties: [Specialty]
    tags: [Tag]
    examSet: ExamSet
    createdAt: String
    updatedAt: String
    user: User
  }

  type QuestionAnswer {
    id: Int
    index: Int
    isCorrect: Boolean
    text: String
    correctPercent: Int
    question: Question
  }

  input QuestionInput {
    id: Int
    answers: [QuestionAnswerInput]
    text: String!
    images: [String]
    examSetId: Int!
  }

  input QuestionAnswerInput {
    text: String
    index: Int
    isCorrect: Boolean
  }
`;

export const resolvers: Resolvers = {
  Query: {
    questions: async (args, { filter }, ctx) => {
      const {
        ids,
        semesterId,
        tagIds,
        specialtyIds,
        examSetId,
        search,
        onlyNew,
        onlyWrong,
        commentIds,
        shareId
      } = filter;
      let { n } = filter;

      if (!filter) throw new Error('No arguments for filter provided');
      let query = Question.query();

      if (ids) return query.findByIds(ids);
      if (shareId) {
        const shareObjs = await ShareLink.query().where({ shareId }).select('questionId');
        return query.findByIds(shareObjs.map((obj) => obj.questionId));
      }
      if (commentIds)
        return QuestionComment.query().findByIds(commentIds).select('questionId as id');

      query = query
        .join('semesterExamSet as examSet', 'question.examSetId', 'examSet.id')
        .join('semester', 'examSet.semesterId', 'semester.id');
      if (semesterId) {
        query = query.where('semester.id', '=', semesterId);
      }

      // Specifics
      if (examSetId) return query.where('examSet.id', examSetId);
      if (search)
        return query
          .join('questionAnswers', 'question.id', 'questionAnswers.questionId')
          .where(function () {
            this.whereRaw('MATCH (question.text) AGAINST (? IN BOOLEAN MODE)', search).orWhereRaw(
              'MATCH (question_answers.text) AGAINST (? IN BOOLEAN MODE)',
              search
            );
          });

      // Start filtering based on other values
      query = query.orderByRaw('rand()');

      if (!n || n > 300) n = 300; // Man må ikke hente mere end 300
      query = query.limit(n);

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

      if (ctx.user && onlyWrong) {
        const correctAnswers = QuestionUserAnswer.query()
          .where({ userId: ctx.user.id })
          .join('questionAnswers', 'questionUserAnswer.answerId', 'questionAnswers.id')
          .where({ isCorrect: 1 })
          .select('questionAnswers.questionId');

        query = query.whereNotIn('question.id', correctAnswers);
      } else if (ctx.user && onlyNew) {
        query = query.whereNotIn(
          'question.id',
          QuestionUserAnswer.query()
            .where({ userId: ctx.user.id })
            .join('questionAnswers', 'questionUserAnswer.answerId', 'questionAnswers.id')
            .distinct('questionId')
        );
      }

      const questions = await query.groupBy('question.id').select('question.id as id');
      return questions.map((question) => ({ id: question.id }));
    }
  },

  Mutation: {
    createQuestion: async (root, { data }, ctx) => {
      const user = await permitAdmin(ctx);
      const { text, images, examSetId } = data;
      const questions = await Question.query().where({ examSetId });
      const examSetQno =
        questions.reduce(
          (max, question) => (question.examSetQno > max ? question.examSetQno : max),
          0
        ) + 1;

      const question = await Question.query().insertAndFetch({
        text,
        examSetId,
        examSetQno,
        userId: user.id
      });
      await QuestionAnswer.query().insertGraph(
        data.answers.map((a) => ({
          text: a.text,
          index: a.index,
          isCorrect: (a.isCorrect ? 1 : 0) as 1 | 0,
          questionId: question.id
        }))
      );
      if (!!images) {
        await QuestionImage.query().insertGraph(
          images.map((image) => ({ link: image, questionId: question.id }))
        );
      }

      return { id: question.id };
    },
    updateQuestion: async (root, { data }, ctx) => {
      const user = await permitAdmin(ctx);
      let question = await Question.query().findById(data.id);
      if (question.userId !== user.id && user.roleId !== 1) throw new Error('Not permitted');
      const { text, images, examSetId } = data;
      question = await question
        .$query()
        .updateAndFetch({
          text,
          examSetId
        })
        .skipUndefined();

      if (!!images) {
        await QuestionImage.query().insertGraph(
          images.map((image) => ({ link: image, questionId: question.id }))
        );
      }
      if (data.answers.length > 0) {
        await QuestionAnswer.query().where({ questionId: question.id }).delete();
        console.log(data.answers);
        await QuestionAnswer.query().insertGraph(
          data.answers.map((a) => ({
            questionId: question.id,
            text: a.text,
            index: a.index,
            isCorrect: (a.isCorrect ? 1 : 0) as 1 | 0
          }))
        );
      }

      return { id: question.id };
    },
    reportQuestion: async (root, { report, questionId }, ctx) => {
      const question = await ctx.questionLoader.load(questionId);
      const examSet = await ctx.examSetsLoader.load(question.examSetId);
      const semester = await ctx.semesterLoader.load(examSet.semesterId);
      const answers = await ctx.questionAnswersByQuestionLoader.load(questionId);

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
  A. ${answers.find((a) => a.index === 1).text}<br>
  B. ${answers.find((a) => a.index === 2).text}<br>
  C. ${answers.find((a) => a.index === 3).text}
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
    answers: async ({ id }, args, ctx) => {
      const answers = await ctx.questionAnswersByQuestionLoader.load(id);
      return answers.sort((a, b) => a.index - b.index).map((a) => ({ id: a.id }));
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
      const publicComments = await Comment.query().where('questionId', id).where({ private: 0 });
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
    },
    user: async ({ id }, args, ctx) => {
      const question = await ctx.questionLoader.load(id);
      if (!question.userId) return null;
      return { id: question.userId };
    }
  },

  QuestionAnswer: {
    id: ({ id }) => id,
    text: async ({ id }, _, ctx) => {
      const answer = await ctx.questionAnswersLoader.load(id);
      return answer.text;
    },
    index: async ({ id }, _, ctx) => {
      const answer = await ctx.questionAnswersLoader.load(id);
      return answer.index;
    },
    isCorrect: async ({ id }, _, ctx) => {
      const answer = await ctx.questionAnswersLoader.load(id);
      return !!answer.isCorrect;
    },
    correctPercent: async ({ id }, args, ctx) => {
      const answer = await ctx.questionAnswersLoader.load(id);
      const questionAnswers = await ctx.questionAnswersByQuestionLoader.load(answer.questionId);
      let allUserAnswers = await QuestionUserAnswer.query().whereIn(
        'answerId',
        questionAnswers.map((qa) => qa.id)
      );
      if (allUserAnswers.length < 1) return 0;

      const firstTimeAnswers = _(allUserAnswers)
        .sortBy((answer) => answer.createdAt, 'asc')
        .uniqBy((answer) => answer.userId)
        .value();
      const answeredThisCount = firstTimeAnswers.filter((ua) => ua.answerId === id);
      const correctPercent = Math.round((answeredThisCount.length / firstTimeAnswers.length) * 100);
      return correctPercent;
    },
    question: async ({ id }, _, ctx) => {
      const answer = await ctx.questionAnswersLoader.load(id);
      return { id: answer.questionId };
    }
  }
};
