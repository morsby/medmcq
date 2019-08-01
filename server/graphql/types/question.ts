import { gql } from 'apollo-server-express';
import Question from 'models/question';

export const typeDefs = gql`
  extend type Query {
    questions(filter: FilterInput, ids: [Int]): [Question]
  }

  input FilterInput {
    text: String
    specialties: [Int]
    tags: [Int]
    semester: Int
    year: Int
    season: String
    id: String
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
    examSetId: Int
    semester: Semester
    publicComments: [Comment]
    correctAnswers: [CorrectAnswer]
    specialties: [SpecialtyVote]
    tags: [TagVote]
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

  type SpecialtyVote {
    specialtyId: Int
    questionId: Int
    votes: Int
  }

  type TagVote {
    tagId: Int
    questionId: Int
    votes: Int
  }

  type User {
    id: Int
  }

  type ExamSet {
    id: Int
    year: Int
    season: String
    semesterId: Int
    createdAt: String
    updatedAt: String
  }
`;

export const resolvers = {
  Query: {
    questions: async (args, { filter, ids }) => {
      // Hvis vi får ID'er, så smider vi bare dem tilbage
      if (ids)
        return Question.query()
          .findByIds(ids)
          .eager(Question.defaultEager);

      if (filter.id)
        return [
          await Question.query()
            .findById(filter.id)
            .eager(Question.defaultEager)
        ];

      // Hvis vi ikke gør, så starter vi filteret
      let query: any = Question.query()
        .joinRelation('[semester, examSet]')
        .where('semester.id', '=', filter.semester)
        .groupBy('question.id');

      if (filter.year) {
        query = query.where('examSet.year', '=', filter.year);
      }

      if (filter.season) {
        query = query.where('examSet.season', '=', filter.season);
      }

      if (filter.specialties && filter.specialties.length > 0) {
        query = query.modify('filterOnMetadata', {
          type: 'specialties',
          ids: filter.specialties
        });
      }

      if (filter.tags && filter.tags.length > 0) {
        query = query.modify('filterOnMetadata', {
          type: 'tags',
          ids: filter.tags
        });
      }

      if (filter.text) {
        query = query.whereRaw(
          'MATCH (text, answer1, answer2, answer3) AGAINST (? IN BOOLEAN MODE)',
          filter.text
        );
      }

      return query.eager(Question.defaultEager);
    }
  }
};
