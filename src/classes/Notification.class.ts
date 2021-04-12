import { Notification as NotificationType } from 'types/generated';
import gql from 'graphql-tag';
import API from './API.class';
import { store } from 'IndexApp';
import authReducer from 'redux/reducers/auth';

interface Notification extends NotificationType {}

class Notification {
  static fragment = gql`
    fragment Notification on Notification {
      id
      message
      isRead
      createdAt
      semester {
        id
        value
      }
    }
  `;

  static find = async (semesterId: number) => {
    const query = gql`
      query Notifications($semesterId: Int) {
        notifications(semesterId: $semesterId) {
          ...Notification
        }
      }
      ${Notification.fragment}
    `;

    const notifications = await API.query<Notification[]>('notifications', query, {
      semesterId
    });
    return store.dispatch(authReducer.actions.setNotifications(notifications));
  };

  static toggleRead = async (id: number) => {
    const mutation = gql`
      mutation ToggleReadNotification($id: Int) {
        toggleReadNotification(id: $id) {
          ...Notification
        }
      }
      ${Notification.fragment}
    `;

    const notification = await API.mutate<Notification>('toggleReadNotification', mutation, {
      id
    });
    return store.dispatch(authReducer.actions.addNotifications(notification));
  };

  static readAll = async (semesterId: number) => {
    const mutation = gql`
      mutation ToggleReadAllNotifications {
        toggleReadAllNotifications
      }
    `;

    await API.mutate<string>('toggleReadAllNotifications', mutation);
    await Notification.find(semesterId);
  };
}

export default Notification;
