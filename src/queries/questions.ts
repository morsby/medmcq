import { gql } from 'apollo-boost';

// Returns an array of questionIds
export const fetchFilteredQuestions = gql`
  query Questions(
    $text: String
    $semester: Int
    $specialties: [Int]
    $tags: [Int]
    $year: Int
    $season: String
    $id: String
  ) {
    questions(
      filter: {
        id: $id
        text: $text
        semester: $semester
        specialties: $specialties
        year: $year
        season: $season
        tags: $tags
      }
    ) {
      id
      text
      answer1
      answer2
      answer3
      examSetQno
      semester {
        id
        value
        name
        shortName
      }
      correctAnswers {
        answer
      }
      specialties {
        specialtyId
      }
      tags {
        tagId
      }
      examSet {
        year
        season
      }
      createdAt
      updatedAt
    }
  }
`;

// Returns an array of questionIds
export const getQuestionsFromIds = gql`
  query Questions($ids: [Int]) {
    questions(ids: $ids) {
      id
      text
      answer1
      answer2
      answer3
      examSetQno
      semester {
        id
        value
        name
        shortName
      }
      correctAnswers {
        answer
      }
      specialties {
        specialtyId
      }
      tags {
        tagId
      }
      examSet {
        year
        season
      }
      createdAt
      updatedAt
    }
  }
`;
