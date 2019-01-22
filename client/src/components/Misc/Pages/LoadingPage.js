import React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingPage = () => (
    <Dimmer active page>
        <Loader active inline="centered" />
    </Dimmer>
);

export default LoadingPage;
