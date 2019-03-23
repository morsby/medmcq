import React from 'react';

import { Translate } from 'react-localize-redux';

/**
 * Component der viser de "smarte/skjulte" funktioner. Kaldes af About.js
 */
const FancyFeatures = () => (
  <div>
    <h2>
      <Translate id="fancyFeatures.header" />
    </h2>
    <Translate id="fancyFeatures.body" />
  </div>
);

export default FancyFeatures;
