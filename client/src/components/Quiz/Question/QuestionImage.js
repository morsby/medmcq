import React from 'react';

import { Image } from 'semantic-ui-react';
import Lightbox from 'react-image-lightbox';

const QuestionImage = ({ img, imgOpen, onClick }) => {
    return (
        <div>
            <Image src={img} onClick={onClick} className="click" />
            {imgOpen && <Lightbox mainSrc={img} onCloseRequest={onClick} />}
        </div>
    );
};

export default QuestionImage;
