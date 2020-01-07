import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import LoadingPage from 'components/Misc/Utility/LoadingPage';

export interface QuestionCountProps {}

const QuestionCount: React.SFC<QuestionCountProps> = () => {
  const selectedSemester = useSelector((state: ReduxState) => state.selection.semesterId);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === selectedSemester)
  );

  if (!semester) return <LoadingPage />;
  return (
    <div style={{ margin: '1rem auto' }}>
      <Translate
        id="selectionNSelector.total_n"
        data={{
          n: semester.questionCount,
          semesterNumber: semester.value
        }}
      />
    </div>
  );
};

export default QuestionCount;
