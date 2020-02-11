import User from 'models/user';
import dataLoader from 'dataloader';
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
export const userLoader = new dataLoader((ids: number[]) => batchUsers(ids), { cache: false });
export const bookmarkLoader = new dataLoader((ids: number[]) => batchBookmarks(ids), {
  cache: false
});
