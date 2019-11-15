import client from 'apolloClient';
import jwtDecode from 'jwt-decode';
import { gql } from 'apollo-boost';

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
}

class User {
  static login = async (data: UserLoginInput) => {
    const jwt = await client.mutate<string>({
      mutation: gql`
        mutation($data: LoginInput) {
          login(data: $data)
        }
      `,
      variables: { data }
    });

    const user = jwtDecode<User>(jwt.data);
    return user;
  };

  static logout = () => {};

  static signup = async (data: UserSignupInput) => {
    const jwt = await client.mutate<string>({
      mutation: gql`
            mutation(data: LoginInput) {signup(data:$data)}
        `,
      variables: { data }
    });

    const user = jwtDecode<User>(jwt.data);
    return user;
  };

  static checkUser = async () => {
    const jwt = await client.query<string>({
      query: gql`
        query {
          checkUser
        }
      `
    });

    const user = jwtDecode<User>(jwt.data);
    return user;
  };
}

export default User;
