import React from 'react';
import SelectionNSelector from './SelectionComponents/SelectionNSelector';

export interface SelectionRandomProps {}

const SelectionRandom: React.SFC<SelectionRandomProps> = () => {
  return (
    <div>
      <SelectionNSelector />
    </div>
  );
};

export default SelectionRandom;
