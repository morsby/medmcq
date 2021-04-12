import React from 'react';
import { Loader } from 'semantic-ui-react';

export interface LoadingPageProps {}

const LoadingPage: React.SFC<LoadingPageProps> = () => {
  return (
    <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loader active size="huge" />
    </div>
  );
};

export default LoadingPage;
