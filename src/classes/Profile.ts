import Comment from 'classes/Comment';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import profileReducer from 'redux/reducers/profile';
import { store } from 'IndexApp';
import { User as UserType, UserAnswer } from 'types/generated';
import Question from './Question';

interface Profile extends UserType {
  tries: Attempt[];
}

export type Attempt = { tries: number; correct: number; questionId: number };

const mapAnswers = (userAnswers: UserAnswer[]): Attempt[] => {
  let attempts = [] as Attempt[];

  for (let userAnswer of userAnswers) {
    const attemptExists = attempts.find(
      (attempt) => attempt.questionId === userAnswer.answer.question.id
    );

    if (!attemptExists) {
      attempts.push({ correct: 0, tries: 0, questionId: userAnswer.answer.question.id });
    }
    attempts.find((attempt) => attempt.questionId === userAnswer.answer.question.id).tries++;
    if (userAnswer.answer.isCorrect) {
      attempts.find((attempt) => attempt.questionId === userAnswer.answer.question.id).correct++;
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
            answerTime
            answer {
              ...QuestionAnswer
              question {
                id
                text
                answers {
                  ...QuestionAnswer
                }
                tags {
                  id
                }
                specialties {
                  id
                }
                examSet {
                  id
                }
              }
            }
          }
          publicComments(semester: $semester) {
            ...Comment
            question {
              id
              specialties {
                id
              }
            }
          }
          privateComments(semester: $semester) {
            ...Comment
            question {
              id
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
              answers {
                ...QuestionAnswer
              }
            }
          }
        }
      }
      ${Comment.fragmentFull}
      ${Question.questionAnswerFragment}
    `;

    const profileData = await Apollo.query<Profile>('profile', query, {
      semester: options.semester,
    });

    profileData.tries = mapAnswers(profileData.answers);

    store.dispatch(profileReducer.actions.setProfile(profileData));
  };
}

export default Profile;
