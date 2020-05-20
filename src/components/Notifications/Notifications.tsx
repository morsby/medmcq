import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import marked from 'marked';
import { Menu } from 'semantic-ui-react';

export interface NotificationsProps {}

const Notifications: React.SFC<NotificationsProps> = () => {
  const notifications = useSelector((state: ReduxState) => state.auth.notifications);

  return (
    <div>
      {notifications.map((n) => (
        <Menu.Item>
          <div dangerouslySetInnerHTML={{ __html: marked(n.message, { smartypants: true }) }} />
          <p style={{ color: 'grey' }}>{new Date(n.createdAt).toLocaleString()}</p>
        </Menu.Item>
      ))}
      {notifications.length === 0 && <Menu.Item>Du har ingen notifikationer</Menu.Item>}
    </div>
  );
};

export default Notifications;
