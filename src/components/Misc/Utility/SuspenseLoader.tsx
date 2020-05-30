import React from 'react';
import { Loader } from 'semantic-ui-react';

export interface SuspenseLoaderProps {}

const SuspenseLoader: React.SFC<SuspenseLoaderProps> = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Loader active inline />
    </div>
  );
};

export default SuspenseLoader;
