import React from 'react';

import { Pagination } from 'semantic-ui-react';

const QuestionNavigator = props => {
	return (
		<Pagination
			fluid
			widths={props.qmax < 7 ? props.qmax + 4 : 11}
			defaultActivePage={1}
			activePage={props.qn + 1}
			totalPages={props.qmax}
			onPageChange={(event, data) => {
				props.clickHandler(data.activePage);
			}}
		/>
	);
};
export default QuestionNavigator;
