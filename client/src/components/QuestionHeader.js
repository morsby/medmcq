import React from 'react';

const QuestionHeader = props => {
	return (
		<h4>
			Spørgsmål {props.qn + 1} af {props.qmax}
		</h4>
	);
};

export default QuestionHeader;
