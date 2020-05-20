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
}

export default Notification;
