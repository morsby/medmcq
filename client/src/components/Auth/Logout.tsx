import { useEffect } from 'react';

import User from 'classes/User';
import { useHistory } from 'react-router-dom';

export interface LogoutProps {}

const Logout: React.SFC<LogoutProps> = () => {
  const history = useHistory();

  useEffect(() => {
    const logout = async () => {
      await User.logout();
      history.push('/');
    };

    logout();
  }, []);

  return null;
};

export default Logout;
