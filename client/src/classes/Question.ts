import client from 'apolloClient';
import { gql } from 'apollo-boost';

interface QuestionFilterInput {
  text: string;
  specialties: number[];
  tags: number[];
  semester: number;
  year: number;
  season: string;
  ids: number[];
  n: number;
  set: number;
  onlyNew: boolean;
  onlyWrong: boolean;
  commentIds: number[];
}

class Question {
  static fetch = async (filter: Partial<QuestionFilterInput>) => {
    const res = await client.query<{ questions: Question[] }>({
      query: gql`
        query($filter: QuestionFilterInput) {
          questions(filter: $filter) {
            id
            text
            examSet {
              id
              season
            }
            answer1
            answer2
            answer3
            image
          }
        }
      `,
      variables: { filter }
    });

    return res.data.questions;
  };
}

export default Question;
