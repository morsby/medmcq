import React, { useState } from 'react';

import { Image } from 'semantic-ui-react';
import Lightbox from 'react-image-lightbox';

/**
 * Viser spørgsmålsbilledet. Kaldes hvis billedet findes. Props er fra Question.js
 * @param {String}  img     src til billede
 */
const QuestionImage = ({ img }) => {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <div>
      <Image src={img} onClick={() => setImageOpen(true)} className="click" />
      {imageOpen && <Lightbox mainSrc={img} onCloseRequest={() => setImageOpen(false)} />}
    </div>
  );
};

export default QuestionImage;
