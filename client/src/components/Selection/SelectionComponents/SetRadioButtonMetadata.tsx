import React, { useState, useCallback } from 'react';
import User from 'classes/User';
import { Icon, Loader } from 'semantic-ui-react';
import ExamSet from 'classes/ExamSet';
import _ from 'lodash';

export interface SetRadioButtonMetadataProps {
  user: User;
  examSetId: ExamSet['id'];
}

const SetRadioButtonMetadata: React.SFC<SetRadioButtonMetadataProps> = ({ user, examSetId }) => {
  const [manualLoading, setManualLoading] = useState(false);

  const handleManualCompletion = async () => {
    setManualLoading(true);
    await User.manualCompleteSet({ examSetId });
    setManualLoading(false);
  };

  const getCount = useCallback(() => {
    return user.answeredSets.find((answeredSet) => answeredSet.examSetId === examSetId)?.count;
  }, [examSetId, user]);

  const getColor = () => {
    if (getCount() === 80) {
      return 'darkgreen';
    }
    return 'darkgrey';
  };

  return (
    <span style={{ marginLeft: '0.5em' }}>
      {!manualLoading && (
        <Icon
          name="check"
          onClick={handleManualCompletion}
          style={{ cursor: 'pointer' }}
          color={
            user.manualCompletedSets.find((completedSets) => completedSets.examSetId === examSetId)
              ? 'green'
              : 'grey'
          }
        />
      )}
      {manualLoading && <Loader active inline size="mini" />}
      <span style={{ color: getColor(), margin: '0 0.5em' }}>
        {getCount() || 0} / 80 ({Math.round(((getCount() || 0) / 80) * 100)}%)
      </span>
    </span>
  );
};

export default SetRadioButtonMetadata;
