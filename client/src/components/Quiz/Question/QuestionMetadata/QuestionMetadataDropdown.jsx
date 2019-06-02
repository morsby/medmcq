import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

const QuestionMetadataDropdown = ({ options, onChange, text, type }) => {
  const handleDropdownPick = (e, { value }) => {
    onChange(value);
  };

  const createDropdownItems = (category) => {
    let items = [];

    for (const o of options) {
      if (o.category === category) {
        items.push(
          <Dropdown.Item onClick={handleDropdownPick} text={o.text} value={o.value} key={o.value} />
        );
      }
    }

    if (items.length === 0) {
      items.push(<Dropdown.Item text="Ingen tags..." />);
    }

    return items;
  };

  const createDropdowns = () => {
    if (type === 'tag') {
      let categories = [];
      let dropdown = [];

      for (const o of options) {
        categories.push(o.category);
      }
      categories = _.uniq(categories);

      for (const c of categories) {
        dropdown.push(
          <Dropdown.Item key={c}>
            <Dropdown scrolling text={c.charAt(0).toUpperCase() + c.slice(1)}>
              <Dropdown.Menu>{createDropdownItems(c)}</Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
        );
      }

      return dropdown;
    }

    if (type === 'specialty') {
      return options.map((o) => {
        return (
          <Dropdown.Item onClick={handleDropdownPick} key={o.value} text={o.text} value={o.value} />
        );
      });
    }
  };

  return (
    <span style={{ margin: '5px', border: '1px solid lightgrey', padding: '5px' }}>
      <Dropdown text={text}>
        <Dropdown.Menu>{createDropdowns()}</Dropdown.Menu>
      </Dropdown>
    </span>
  );
};

export default QuestionMetadataDropdown;
