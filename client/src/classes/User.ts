import client from 'apolloClient';
import { gql } from 'apollo-boost';
import Question from './Question';
import { store } from 'IndexApp';
import Apollo from './Apollo';
import authReducer from 'redux/reducers/auth';
import Like from './Like';

export interface UserLoginInput {
  username: string;
  password: string;
}

export interface UserSignupInput {
  username: string;
  password: string;
  email?: string;
}

interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
  answers: Answer[];
  likes: Like[];
  manualCompletedSets: { examSetId: number }[];
  bookmarks: Bookmark[];
  answeredSets: { examSetId: number; count: number }[];
}

export interface Answer {
  id: number;
  answer: number;
  answerTime: number;
  question: Question;
}

export interface Bookmark {
  id: number;
  question: Question;
}

class User {
  static login = async (data: UserLoginInput): Promise<User> => {
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
    await store.dispatch(authReducer.actions.logout());
  };

  static signup = async (data: UserSignupInput) => {
    const mutation = gql`
      mutation($data: UserInput) {
        signup(data: $data)
      }
    `;

    await Apollo.mutate<string>('signup', mutation, { data });
    await User.fetch();
  };

  /**
   * Fetches the user based on the stored cookie in "user". The stored cookie is
   * manipulated based on login and logout.
   */
  static fetch = async () => {
    const query = gql`
      query {
        user {
          id
          username
          email
          likes {
            commentId
          }
          bookmarks {
            question {
              id
            }
          }
          answeredSets {
            examSetId
            count
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

  static resetPassword = async ({
    token,
    password
  }: {
    token: string;
    password: string;
  }): Promise<string> => {
    const mutation = gql`
      mutation($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password)
      }
    `;

    const message = await Apollo.mutate<string>('resetPassword', mutation, { token, password });
    return message;
  };

  static forgotPassword = async ({ email }: { email: string }) => {
    const mutation = gql`
      mutation($email: String!) {
        forgotPassword(email: $email)
      }
    `;

    await Apollo.mutate('forgotPassword', mutation, { email });
  };

  static edit = async (data: Partial<User>) => {
    const mutation = gql`
      mutation($data: UserEditInput) {
        editUser(data: $data)
      }
    `;

    await Apollo.mutate('editUser', mutation, { data });
    await User.fetch();
  };

  /**
   * Checks if the supplied username or email is available.
   */
  static checkAvailable = async (data: Partial<User>) => {
    const query = gql`
      query($data: UserAvailableInput) {
        checkUsernameAvailability(data: $data)
      }
    `;

    const isAvailable = await Apollo.query<boolean>('checkUsernameAvailability', query, {
      data
    });
    return isAvailable;
  };

  static manualCompleteSet = async ({ setId }: { setId: number }) => {
    const mutation = gql`
      mutation($setId: Int!, $userId: Int!) {
        manualCompleteSet(setId: $setId, userId: $userId)
      }
    `;

    await Apollo.mutate('manualCompleteSet', mutation, { setId });

    await store.dispatch(authReducer.actions.manualCompleteSet({ setId }));
  };

  static bookmark = async ({ questionId }: { questionId: number }) => {
    const mutation = gql`
      mutation($questionId: Int!) {
        bookmark(questionId: $questionId)
      }
    `;

    const bookmark = await Apollo.mutate<Bookmark>('bookmark', mutation, { questionId });
    await store.dispatch(authReducer.actions.setBookmark(bookmark));
  };
}

export default User;
