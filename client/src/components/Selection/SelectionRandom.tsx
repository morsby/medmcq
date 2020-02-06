import React from 'react';
import SelectionNSelector from './SelectionComponents/SelectionNSelector';
import SelectionSearch from './SelectionComponents/SelectionSearch';
import { Divider } from 'semantic-ui-react';

export interface SelectionRandomProps {}

const SelectionRandom: React.SFC<SelectionRandomProps> = () => {
  return (
    <div>
      <SelectionNSelector />
      <Divider />
      <SelectionSearch />
    </div>
  );
};

export default SelectionRandom;
