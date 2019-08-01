import React from 'react';
import { Input } from 'antd';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import { Dropdown } from 'semantic-ui-react';

export interface SearchDropdownProps {
  value: string | string[];
  onChange: any;
  type: 'search' | 'dropdown';
  options?: any;
}

const SearchDropdown: React.SFC<SearchDropdownProps> = ({ value, onChange, type, options }) => {
  if (type === 'dropdown')
    return (
      <div style={{ padding: 8, width: 300 }}>
        <Dropdown
          fluid
          search
          multiple
          selection
          options={options}
          onChange={(e, { value }) => onChange(value)}
        />
      </div>
    );
  if (type === 'search')
    return (
      <div style={{ padding: 8, width: 300 }}>
        <Input
          placeholder={'Søg'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ marginBottom: 8, display: 'block' }}
        />
      </div>
    );
};

export default SearchDropdown;
