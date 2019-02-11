import React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';

/**
 * Loading page. Bruges mens data hentes på visse sider, fx profil, feedback.
 */
const LoadingPage = () => (
    <Dimmer active page>
        <Loader active inline="centered" />
    </Dimmer>
);

export default LoadingPage;
