import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface QuestionCountProps {}

const QuestionCount: React.SFC<QuestionCountProps> = () => {
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const selectedSemester = useSelector((state: ReduxState) => state.selection.semesterId);

  return (
    <div style={{ margin: '1rem auto' }}>
      <Translate
        id="selectionNSelector.total_n"
        data={{
          n: semesters.find((semester) => semester.id === selectedSemester)?.questionCount
        }}
      />
    </div>
  );
};

export default QuestionCount;
