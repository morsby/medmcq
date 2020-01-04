import React, { useState, useEffect } from 'react';

import { breakpoints, urls } from 'utils/common';

import selectionTranslations from './selectionTranslations.json';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';

import { Container, Header, Divider, Message, Input } from 'semantic-ui-react';

import SelectionSemesterSelector from 'components/Selection/SelectionComponents/SelectionSemesterSelector';
import SelectionNSelector from 'components/Selection/SelectionComponents/SelectionNSelector';
import SelectionSetSelector from 'components/Selection/SelectionComponents/SelectionSetSelector';
import SelectionMetadataSelector from 'components/Selection/SelectionComponents/SelectionMetadataSelector';
import SelectionTypeSelector from 'components/Selection/SelectionComponents/SelectionTypeSelector';
import SelectionUniqueSelector from 'components/Selection/SelectionComponents/SelectionUniqueSelector';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Semester from 'classes/Semester';
import Quiz from 'classes/Quiz';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import User from 'classes/User';
import SelectionStartButton from './SelectionComponents/SelectionStartButton';
import SelectionClass from 'classes/Selection';
import { useHistory } from 'react-router-dom';

export interface SelectionProps extends LocalizeContextProps {}

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 */
const Selection: React.SFC<SelectionProps> = ({ addTranslation, translate }) => {
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const [startLoading, setStartLoading] = useState(false);
  const search = useSelector((state: ReduxState) => state.selection.search);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const type = useSelector((state: ReduxState) => state.selection.type);
  const selectedSemester = useSelector((state: ReduxState) => state.selection.semesterId);
  const user = useSelector((state: ReduxState) => state.auth.user);

  useEffect(() => {
    addTranslation(selectionTranslations);
    Semester.fetchAll();
  }, [addTranslation]);

  useEffect(() => {
    User.fetch();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      Quiz.start();
      history.push(urls.quiz);
    }
  };

  const handleSearch = (search: string) => {
    SelectionClass.change({ type: 'search', value: search });
  };

  if (!semesters) return <LoadingPage />;
  return (
    <div className="flex-container">
      <Container className="content">
        <Header as="h1" style={{ textAlign: 'center' }}>
          MedMcq
        </Header>
        <Divider />
        <SelectionSemesterSelector />
        <Divider hidden />
        <SelectionTypeSelector />
        <Divider hidden />
        {type !== 'set' && (
          <>
            <SelectionNSelector />
            <Divider hidden />
            <Translate
              id="selectionNSelector.total_n"
              data={{
                n: semesters.find((semester) => semester.id === selectedSemester)?.questionCount
              }}
            />
            <Divider />
          </>
        )}

        {type !== 'specialer' && type !== 'set' && (
          <>
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
            <Divider />
          </>
        )}

        {type === 'specialer' && (
          <>
            <SelectionMetadataSelector />
            <Divider />
          </>
        )}

        {type === 'set' && <SelectionSetSelector />}

        {errors.length > 0 && (
          <Message negative>
            {errors.map((err) => {
              return <p key={err}>{err}</p>;
            })}
          </Message>
        )}
        {window.innerWidth < breakpoints.mobile && <Divider hidden />}
        {user && type !== 'set' && <SelectionUniqueSelector />}
        <SelectionStartButton />
        <Divider hidden />
      </Container>
    </div>
  );
};

export default withLocalize(Selection);
