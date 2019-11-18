import client from 'apolloClient';
import jwtDecode from 'jwt-decode';
import { gql } from 'apollo-boost';
import Question from './Question';

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
  answers: UserAnswer[];
}

class User {
  static login = async (data: UserLoginInput) => {
    const res = await client.mutate<{ login: string }>({
      mutation: gql`
        mutation($data: LoginInput) {
          login(data: $data)
        }
      `,
      variables: { data }
    });

    const user = jwtDecode<User>(res.data.login);
    return { ...user, jwt: res.data.login };
  };

  static logout = () => {};

  static signup = async (data: UserSignupInput) => {
    const jwt = await client.mutate<{ signup: string }>({
      mutation: gql`
            mutation(data: LoginInput) { signup(data:$data) }
        `,
      variables: { data }
    });

    const user = jwtDecode<User>(jwt.data.signup);
    return user;
  };

  static checkUser = async () => {
    const res = await client.query<{ checkUser: User }>({
      query: gql`
        query {
          checkUser {
            id
            username
            likes {
              commentId
            }
          }
        }
      `
    });

    return res.data.checkUser;
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
}

export default User;
