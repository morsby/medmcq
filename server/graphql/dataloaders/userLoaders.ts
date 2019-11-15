import User from 'models/user';
import dataLoader from 'dataloader';

// Batchers
const batchUsers = async (ids: number[]) => {
  const users = await User.query().findByIds(ids);
  return ids.map((id) => users.find((user) => user.id === id));
};

// Loaders
export const userLoader = new dataLoader((ids: number[]) => batchUsers(ids));
