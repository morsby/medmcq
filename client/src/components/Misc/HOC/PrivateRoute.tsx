import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { urls } from 'utils/common';

import LoadingPage from '../Utility-pages/LoadingPage';
import { ReduxState } from 'redux/reducers';
import User from 'classes/User';

/**
 * Higher Order Component der blokerer visse URLS for brugere der ikke er logget ind
 * (fx profilen m.v.)
 */
export interface PrivateRouteProps {
  path: string;
  component: React.SFC;
}

const PrivateRoute: React.SFC<PrivateRouteProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: ReduxState) => state.auth.user);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) await User.fetch();
      setLoading(false);
    };

    fetchUser();
  }, [user]);

  if (loading) return <LoadingPage />;
  if (!user && !loading) return <Redirect to={urls.login} />;
  return <Route {...props} />;
};

export default PrivateRoute;
