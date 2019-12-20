import client from 'apolloClient';
import jwtDecode from 'jwt-decode';
import { gql } from 'apollo-boost';
import Question from './Question';
import { store } from 'IndexApp';
import Apollo from './Apollo';
import authReducer from 'redux/reducers/auth';

export interface UserLoginInput {
  username: string;
  password: string;
}

export interface UserSignupInput {
  username: string;
  password: string;
  email?: string;
}

interface UserAnswer {
  id: number;
  answer: number;
  answerTime: number;
  question: Question;
}

interface User {
  id: number;
  username: string;
  email: string;
  answers: UserAnswer[];
  likes: number;
}

class User {
  static login = async (data: UserLoginInput) => {
    const mutation = gql`
      mutation($data: LoginInput) {
        login(data: $data)
      }
    `;

    await Apollo.mutate<string>('login', mutation, { data }); // Sets a JWT as cookie

    const query = gql`
      query {
        user {
          id
          username
          email
          likes {
            commentId
            userId
          }
        }
      }
    `;

    const user = await Apollo.query<User>('user', query);
    await store.dispatch(authReducer.actions.login(user));
    return user;
  };

  static logout = async () => {
    const mutation = gql`
      mutation {
        logout
      }
    `;

    await Apollo.mutate('logout', mutation); // Removes the JWT cookie
  };

  static signup = async (data: UserSignupInput) => {
    const mutation = gql`
    mutation(data: LoginInput) 
    { 
      signup(data:$data) 
    }
`;

    const jwt = await Apollo.mutate<string>('signup', mutation, { data });

    const user = jwtDecode<User>(jwt);
    return user;
  };

  static fetch = async () => {
    const query = gql`
      query {
        user {
          id
          username
          likes {
            commentId
          }
        }
      }
    `;

    const user = await Apollo.query<User>('user', query);

    await store.dispatch(authReducer.actions.login(user));
  };

  static getAnsweredQuestions = async () => {
    const res = await client.query<{ user: Partial<User> }>({
      query: gql`
        query {
          user {
            answers {
              id
              answer
              answerTime
              question {
                id
              }
            }
          }
        }
      `
    });

    return res.data.user;
  };

  static getProfileData = async (options: { semester: number }) => {
    const res = await client.query<{ user: Partial<User> }>({
      query: gql`
        query($semester: Int) {
          user {
            answers(semester: $semester) {
              id
              answer
              answerTime
              question {
                id
              }
            }
            publicComments(semester: $semester) {
              id
              text
              user {
                id
                username
              }
              question {
                id
              }
            }
            privateComments(semester: $semester) {
              id
              text
              user {
                id
                username
              }
              question {
                id
              }
            }
            bookmarks {
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
      `,
      variables: { semester: options.semester }
    });

    return res.data.user;
  };

  static forgotPassword = async (email: string): Promise<string> => {
    return 'message';
  };
}

export default User;
