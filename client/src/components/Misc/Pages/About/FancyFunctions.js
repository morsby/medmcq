import React from 'react';

import { Translate } from 'react-localize-redux';

/**
 * Component der viser de "smarte/skjulte" funktioner. Kaldes af About.js
 */
const FancyFunctions = () => (
    <div>
        <h2>
            <Translate id="fancyFunctions.header" />
        </h2>
        <Translate id="fancyFunctions.body" />
    </div>
);

export default FancyFunctions;
