import React, { useState } from 'react';

import { Image } from 'semantic-ui-react';
import Lightbox from 'react-image-lightbox';

export interface QuestionImageProps {
  img: string;
}

const QuestionImage: React.SFC<QuestionImageProps> = ({ img }) => {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <div>
      <Image src={img} onClick={() => setImageOpen(true)} className="click" />
      {imageOpen && <Lightbox mainSrc={img} onCloseRequest={() => setImageOpen(false)} />}
    </div>
  );
};

export default QuestionImage;
