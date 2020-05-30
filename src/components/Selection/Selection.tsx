import React, { useEffect, lazy, Suspense } from 'react';
import selectionTranslations from './selectionTranslations.json';
import { withLocalize, LocalizeContextProps } from 'react-localize-redux';
import { Container, Header, Divider, Button, Message } from 'semantic-ui-react';
import SelectionSemesterSelector from 'components/Selection/SelectionComponents/SelectionSemesterSelector';
import SelectionTypeSelector from 'components/Selection/SelectionComponents/SelectionTypeSelector';
import SelectionUniqueSelector from 'components/Selection/SelectionComponents/SelectionUniqueSelector';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Semester from 'classes/Semester';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import SelectionStartButton from './SelectionComponents/SelectionStartButton';
import QuestionCount from './SelectionComponents/QuestionCount';
import { useHistory } from 'react-router-dom';
import SuspenseLoader from 'components/Misc/Utility/SuspenseLoader';
const SelectionRandom = lazy(() => import('./SelectionRandom'));
const SelectionMetadata = lazy(() => import('./SelectionMetadata'));
const SelectionSets = lazy(() => import('./SelectionSets'));

export interface SelectionProps extends LocalizeContextProps {}

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 */
const Selection: React.SFC<SelectionProps> = ({ addTranslation }) => {
  const history = useHistory();
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const type = useSelector((state: ReduxState) => state.selection.type);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const notice = useSelector((state: ReduxState) => state.settings.notice);

  /**
   * Fetch all semester metadata on return to selection
   */
  useEffect(() => {
    addTranslation(selectionTranslations);
    Semester.fetchAll();
  }, [addTranslation]);

  if (!semesters || semesters.length < 0) return <LoadingPage />;
  return (
    <div className="flex-container">
      <Container className="content">
        <Header as="h1" style={{ textAlign: 'center' }}>
          MedMcq
        </Header>
        <Divider />
        {notice?.message && <Message color={notice.color as any}>{notice.message}</Message>}
        <SelectionSemesterSelector />
        <QuestionCount />
        <Divider />
        <SelectionTypeSelector />
        <Divider hidden />
        <Suspense fallback={<SuspenseLoader />}>
          {type === 'random' && <SelectionRandom />}
          {type === 'metadata' && <SelectionMetadata />}
          {type === 'set' && <SelectionSets />}
        </Suspense>
        {user && type !== 'set' && (
          <>
            <Divider />
            <SelectionUniqueSelector />
          </>
        )}
        <Divider hidden />
        <SelectionStartButton />
        <div style={{ height: '5px' }} />
        {user?.role.id < 3 && (
          <Button onClick={() => history.push('/createquestion')} fluid basic color="black">
            Opret spørgsmål
          </Button>
        )}
        <Divider hidden />
      </Container>
    </div>
  );
};

export default withLocalize(Selection);
