import React from 'react';

import { Image } from 'semantic-ui-react';
import Lightbox from 'react-image-lightbox';

const QuestionImage = props => {
	return (
		<div>
			<Image src={props.img} onClick={props.onClick} />
			{props.imgOpen && (
				<Lightbox mainSrc={props.img} onCloseRequest={props.onClose} />
			)}
		</div>
	);
};

export default QuestionImage;
