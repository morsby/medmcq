import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

const QuestionMetadataDropdown = ({ options, onChange, text, type }) => {
  const handleDropdownPick = (e, { value }) => {
    onChange(value);
  };

  const createDropdownItems = (tags) => {
    let items = [];

    for (const t of tags) {
      items.push(
        <Dropdown.Item onClick={handleDropdownPick} text={t.text} value={t.value} key={t.value} />
      );
    }

    if (items.length === 0) {
      items.push(<Dropdown.Item text="Ingen tags..." />);
    }

    return items;
  };

  const createDropdowns = () => {
    if (type === 'tag') {
      let dropdown = [];

      const groupedTags = _.groupBy(options, (t) => t.category);

      for (const key in groupedTags) {
        dropdown.push(
          <Dropdown.Item key={key}>
            <Dropdown scrolling text={key.charAt(0).toUpperCase() + key.slice(1)}>
              <Dropdown.Menu>{createDropdownItems(groupedTags[key])}</Dropdown.Menu>
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
