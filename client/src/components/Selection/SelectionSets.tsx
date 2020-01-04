import React from 'react';
import SelectionSetSelector from './SelectionComponents/SelectionSetSelector';

export interface SelectionSetsProps {}

const SelectionSets: React.SFC<SelectionSetsProps> = () => {
  return (
    <div>
      <SelectionSetSelector />
    </div>
  );
};

export default SelectionSets;
