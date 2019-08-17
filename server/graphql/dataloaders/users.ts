import User from '../../models/user';
import { AuthenticationError } from 'apollo-server';

export const userByIds = async (ids: number[]) => {
  const users = await User.query().whereIn('id', ids);
  return ids.map((id) => users.find((x) => x.id === id));
};
