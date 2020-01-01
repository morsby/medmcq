import { useEffect } from 'react';

import User from 'classes/User';
import { useHistory } from 'react-router-dom';

export interface LogoutProps {}

const Logout: React.SFC<LogoutProps> = () => {
  const history = useHistory();

  useEffect(() => {
    User.logout();
    history.push('/');
  }, []);

  return null;
};

export default Logout;
