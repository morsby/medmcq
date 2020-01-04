import { UserAnswer, Bookmark } from 'classes/User';
import Comment from 'classes/Comment';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';
import profileReducer from 'redux/reducers/profile';
import { store } from 'IndexApp';
import Tag from './Tag';

interface Profile {
  answers: UserAnswer[];
  publicComments: Comment[];
  privateComments: Comment[];
  bookmarks: Bookmark[];
  tries: Attempt;
}

export type Attempt = { [key: string]: { tries: number; correct: number; questionId: number } };

const mapAnswers = (answers: UserAnswer[]): Attempt => {
  let mapped = {} as Attempt;

  for (let answer of answers) {
    if (!mapped[answer.question.id]) {
      mapped[answer.question.id] = { correct: 0, tries: 0, questionId: answer.question.id };
    }
    mapped[answer.question.id].tries++;
    if (answer.question.correctAnswers.includes(answer.answer)) {
      mapped[answer.question.id].correct++;
    }
  }

  return mapped;
};

class Profile {
  static fetch = async (options: { semester: number }) => {
    const query = gql`
      query($semester: Int) {
        profile {
          answers(semester: $semester) {
            id
            answer
            answerTime
            question {
              id
              correctAnswers
              tags {
                ...Tag
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
          bookmarks {
            id
            question {
              id
              text
              correctAnswers
              answer1
              answer2
              answer3
            }
          }
        }
      }
      ${Comment.fragmentFull}
      ${Tag.fragmentFull}
    `;

    const profileData = await Apollo.query<Profile>('profile', query, {
      semester: options.semester
    });

    profileData.tries = mapAnswers(profileData.answers);

    store.dispatch(profileReducer.actions.setProfile(profileData));
  };
}

export default Profile;
