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
    const res = await client.query<Partial<User>>({
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

    return res.data.answers;
  };

  static getProfileData = async (filter?: { semester: number }) => {
    const res = await client.query<Partial<User>>({
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

    return res.data;
  };
}

export default User;
