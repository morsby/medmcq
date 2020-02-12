import User from 'models/user';
import DataLoader from 'dataloader';
import QuestionBookmark from 'models/question_bookmark';

// Batchers
const batchUsers = async (ids: number[]) => {
  const users = await User.query().findByIds(ids);
  return ids.map((id) => users.find((user) => user.id === id));
};
const batchBookmarks = async (ids: number[]) => {
  const bookmarks = await QuestionBookmark.query().findByIds(ids);
  return ids.map((id) => bookmarks.find((bookmark) => bookmark.id === id));
};

// Loaders
export const createUserLoader = () => new DataLoader((ids: number[]) => batchUsers(ids));
export const createBookmarkLoader = () => new DataLoader((ids: number[]) => batchBookmarks(ids));
