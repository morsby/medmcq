import client from 'apolloClient';
import { gql } from 'apollo-boost';
import Comment from 'classes/Comment';
import Specialty, { SpecialtyVote } from 'classes/Specialty';
import Tag, { TagVote } from './Tag';

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

interface Question {
  // API
  id: number;
  text: string;
  answer1: string;
  answer2: string;
  answer3: string;
  examSetQno: number;
  examSetId: number;
  semester: number;
  correctAnswers: number[];
  specialties: Specialty[];
  tags: Tag[];
  publicComments: Comment[];
  images: string[];
  privateComments: Comment[];
  tagVotes: TagVote[];
  specialtyVotes: SpecialtyVote[];
  isBookmarked: boolean;
  isLiked: boolean;
  // FrontEnd
  answer: number;
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
            specialties {
              id
            }
            tags {
              id
            }
            specialtyVotes {
              id
              specialty {
                id
              }
            }
            tagVotes {
              id
              tag {
                id
                parent {
                  id
                }
              }
            }
            answer1
            answer2
            answer3
            image
            correctAnswers
            publicComments {
              id
              text
              user {
                id
                username
              }
              likes {
                commentId
                userId
              }
            }
            privateComments {
              id
              text
              user {
                id
                username
              }
              likes {
                commentId
                userId
              }
            }
            examSet {
              id
            }
          }
        }
      `,
      variables: { filter }
    });

    return res.data.questions;
  };
}

export default Question;
