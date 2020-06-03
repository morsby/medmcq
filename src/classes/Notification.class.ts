import { Notification as NotificationType } from 'types/generated';
import { gql } from 'apollo-boost';
import Apollo from './Apollo';
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
    }
  `;

  static find = async () => {
    const query = gql`
      query Notifications {
        notifications {
          ...Notification
        }
      }
      ${Notification.fragment}
    `;

    const notifications = await Apollo.query<Notification[]>('notifications', query);
    console.log(notifications);
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

    const notification = await Apollo.mutate<Notification>('toggleReadNotification', mutation, {
      id
    });
    return store.dispatch(authReducer.actions.addNotifications(notification));
  };

  static readAll = async () => {
    const mutation = gql`
      mutation ToggleReadAllNotifications {
        toggleReadAllNotifications
      }
    `;

    await Apollo.mutate<string>('toggleReadAllNotifications', mutation);
    await Notification.find();
  };
}

export default Notification;
