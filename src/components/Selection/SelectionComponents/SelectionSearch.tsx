import React from 'react';
import { withLocalize, LocalizeContextProps, Translate } from 'react-localize-redux';
import Selection from 'classes/Selection';
import { useHistory } from 'react-router-dom';
import Quiz from 'classes/Quiz';
import { urls } from 'utils/common';
import { ReduxState } from 'redux/reducers';
import { useSelector } from 'react-redux';
import { Input } from 'semantic-ui-react';

export interface SelectionSearchProps extends LocalizeContextProps {}

const SelectionSearch: React.SFC<SelectionSearchProps> = ({ translate }) => {
  const history = useHistory();
  const search = useSelector((state: ReduxState) => state.selection.search);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      Quiz.start();
      history.push(urls.quiz);
    }
  };

  const handleSearch = (search: string) => {
    Selection.change({ type: 'search', value: search });
  };

  return (
    <div>
      <h3>
        <Translate id="search.title" />
      </h3>
      <p>
        <Translate id="search.description" />
      </p>
      <Input
        value={search}
        onChange={(e, { value }) => handleSearch(value)}
        fluid
        icon="search"
        iconPosition="left"
        placeholder={translate('search.placeholder')}
        onKeyPress={(e) => handleKeyPress(e)}
      />
    </div>
  );
};

export default withLocalize(SelectionSearch);
