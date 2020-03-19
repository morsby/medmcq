import Comment from 'classes/Comment';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import profileReducer from 'redux/reducers/profile';
import { store } from 'IndexApp';
import Tag from './Tag';
import Specialty from './Specialty';
import ExamSet from './ExamSet';
import { User as UserType, Answer } from 'types/generated';

interface Profile extends UserType {
  tries: Attempt[];
}

export type Attempt = { tries: number; correct: number; questionId: number };

const mapAnswers = (answers: Answer[]): Attempt[] => {
  let attempts = [] as Attempt[];

  for (let answer of answers) {
    const attemptExists = attempts.find((attempt) => attempt.questionId === answer.question.id);

    if (!attemptExists) {
      attempts.push({ correct: 0, tries: 0, questionId: answer.question.id });
    }
    attempts.find((attempt) => attempt.questionId === answer.question.id).tries++;
    if (answer.question.correctAnswers.includes(answer.answer)) {
      attempts.find((attempt) => attempt.questionId === answer.question.id).correct++;
    }
  }

  return attempts;
};

class Profile {
  static fetch = async (options: { semester: number }) => {
    const query = gql`
      query Profile($semester: Int) {
        profile {
          answers(semester: $semester) {
            id
            answer
            answerTime
            question {
              id
              text
              correctAnswers
              tags {
                ...Tag
              }
              specialties {
                ...Specialty
              }
              examSet {
                ...ExamSet
              }
            }
          }
          publicComments(semester: $semester) {
            ...Comment
            question {
              specialties {
                id
              }
            }
          }
          privateComments(semester: $semester) {
            ...Comment
            question {
              specialties {
                id
              }
            }
          }
          bookmarks(semester: $semester) {
            id
            question {
              id
              text
              correctAnswers
              answer1 {
                answer
              }
              answer2 {
                answer
              }
              answer3 {
                answer
              }
            }
          }
        }
      }
      ${Comment.fragmentFull}
      ${Tag.fragmentFull}
      ${Specialty.fragmentFull}
      ${ExamSet.fragmentFull}
    `;

    console.log(options.semester);

    const profileData = await Apollo.query<Profile>('profile', query, {
      semester: options.semester
    });

    profileData.tries = mapAnswers(profileData.answers);

    store.dispatch(profileReducer.actions.setProfile(profileData));
  };
}

export default Profile;
