import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'semantic-ui-react';
import Lightbox from 'react-image-lightbox';

/**
 * Viser spørgsmålsbilledet. Kaldes hvis billedet findes. Props er fra Question.js
 * @param {String}  img     src til billede
 * @param {Boolean} imgOpen Er lightbox-popoveren åben?
 * @param {func}    onClick Func der åbner/lukker lightbox-popoveren
 */
const QuestionImage = ({ img, imgOpen, onClick }) => {
    return (
        <div>
            <Image src={img} onClick={onClick} className="click" />
            {imgOpen && <Lightbox mainSrc={img} onCloseRequest={onClick} />}
        </div>
    );
};

QuestionImage.propTypes = {
    img: PropTypes.string,
    imgOpen: PropTypes.bool,
    onClick: PropTypes.func,
};

export default QuestionImage;
