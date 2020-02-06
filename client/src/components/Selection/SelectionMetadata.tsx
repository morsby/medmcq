import React from 'react';
import SelectionNSelector from './SelectionComponents/SelectionNSelector';
import SelectionMetadataSelector from 'components/Selection/SelectionComponents/SelectionMetadataSelector';
import { Divider } from 'semantic-ui-react';

export interface SelectionMetadataProps {}

const SelectionMetadata: React.SFC<SelectionMetadataProps> = () => {
  return (
    <div>
      <SelectionNSelector />
      <Divider />
      <SelectionMetadataSelector />
    </div>
  );
};

export default SelectionMetadata;
