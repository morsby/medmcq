import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import marked from 'marked';
import { Menu, Icon, Button } from 'semantic-ui-react';
import Notification from 'classes/Notification.class';

export interface NotificationsProps {}

const Notifications: React.SFC<NotificationsProps> = () => {
  const [loading, setLoading] = useState(false);
  const notifications = useSelector((state: ReduxState) => state.auth.notifications);
  const semesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((s) => s.id === semesterId)
  );
  const notReadCount = notifications.reduce((sum, n) => (n.isRead ? sum : sum + 1), 0);

  const handleRead = async (id: number) => {
    await Notification.toggleRead(id);
  };

  const handleReadAll = async () => {
    setLoading(true);
    await Notification.readAll(semesterId);
    setLoading(false);
  };

  return (
    <div>
      {notifications.length > 0 && (
        <Menu.Item>
          <Button
            size="tiny"
            onClick={handleReadAll}
            basic
            color="blue"
            disabled={notReadCount < 1}
            fluid
            loading={loading}
          >
            Sæt alle læst ({notReadCount})
          </Button>
        </Menu.Item>
      )}
      {notifications.map((n) => (
        <Menu.Item style={{ backgroundColor: n.isRead ? null : '#f0ffff' }}>
          <div dangerouslySetInnerHTML={{ __html: marked(n.message, { smartypants: true }) }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'grey' }}>
              {n.semester.value}. semester
              <br />
              {new Date(n.createdAt).toLocaleString()}
            </p>
            {n.isRead ? (
              <Icon
                style={{ cursor: 'pointer' }}
                name="close"
                color="grey"
                onClick={() => handleRead(n.id)}
              />
            ) : (
              <Icon
                style={{ cursor: 'pointer' }}
                name="check"
                color="green"
                onClick={() => handleRead(n.id)}
              />
            )}
          </div>
        </Menu.Item>
      ))}
      {notifications.length === 0 && (
        <Menu.Item style={{ textAlign: 'center' }}>
          {semester?.value
            ? `Du har ingen notifikationer på ${semester.value}. semester`
            : 'Vælg et semester for at se notifikationer'}
        </Menu.Item>
      )}
    </div>
  );
};

export default Notifications;
