import User from 'models/user';
import DataLoader from 'dataloader';
import QuestionBookmark from 'models/question_bookmark';
import Notification from 'models/notification.class';

// Batchers
const batchUsers = async (ids: number[]) => {
  const users = await User.query().findByIds(ids);
  return ids.map((id) => users.find((user) => user.id === id));
};
const batchBookmarks = async (ids: number[]) => {
  const bookmarks = await QuestionBookmark.query().findByIds(ids);
  return ids.map((id) => bookmarks.find((bookmark) => bookmark.id === id));
};
const batchNotifications = async (ids: number[]) => {
  const notifications = await Notification.query().findByIds(ids);
  return ids.map((id) => notifications.find((n) => n.id === id));
};

// Loaders
export const createUserLoader = () => new DataLoader((ids: number[]) => batchUsers(ids));
export const createBookmarkLoader = () => new DataLoader((ids: number[]) => batchBookmarks(ids));
export const createNotificationLoader = () =>
  new DataLoader((ids: number[]) => batchNotifications(ids));
