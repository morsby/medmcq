import React, { useEffect } from 'react';
import selectionTranslations from './selectionTranslations.json';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import { Container, Header, Divider } from 'semantic-ui-react';
import SelectionSemesterSelector from 'components/Selection/SelectionComponents/SelectionSemesterSelector';
import SelectionTypeSelector from 'components/Selection/SelectionComponents/SelectionTypeSelector';
import SelectionUniqueSelector from 'components/Selection/SelectionComponents/SelectionUniqueSelector';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Semester from 'classes/Semester';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import User from 'classes/User';
import SelectionStartButton from './SelectionComponents/SelectionStartButton';
import SelectionRandom from './SelectionRandom';
import SelectionMetadata from './SelectionMetadata';
import SelectionSets from './SelectionSets';
import QuestionCount from './SelectionComponents/QuestionCount';

export interface SelectionProps extends LocalizeContextProps {}

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 */
const Selection: React.SFC<SelectionProps> = ({ addTranslation }) => {
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const type = useSelector((state: ReduxState) => state.selection.type);
  const user = useSelector((state: ReduxState) => state.auth.user);

  /**
   * Fetch all semester metadata on return to selection
   */
  useEffect(() => {
    addTranslation(selectionTranslations);
    Semester.fetchAll();
  }, [addTranslation]);

  /**
   * Fetch user whenever the user goes back to the selection screen
   */
  useEffect(() => {
    User.fetch();
  }, []);

  if (!semesters) return <LoadingPage />;
  return (
    <div className="flex-container">
      <Container className="content">
        <Header as="h1" style={{ textAlign: 'center' }}>
          MedMcq
        </Header>
        <Divider />
        <SelectionSemesterSelector />
        <QuestionCount />
        <Divider />
        <SelectionTypeSelector />
        <Divider hidden />
        {type === 'random' && <SelectionRandom />}
        {type === 'metadata' && <SelectionMetadata />}
        {type === 'set' && <SelectionSets />}
        {user && type !== 'set' && (
          <>
            <Divider />
            <SelectionUniqueSelector />
          </>
        )}
        <Divider hidden />
        <SelectionStartButton />
        <Divider hidden />
      </Container>
    </div>
  );
};

export default withLocalize(Selection);
