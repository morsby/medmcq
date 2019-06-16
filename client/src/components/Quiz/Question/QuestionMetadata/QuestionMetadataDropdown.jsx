import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import 'antd/lib/dropdown/style/css';
import 'antd/lib/menu/style/css';
import { Icon } from 'semantic-ui-react';
const { SubMenu } = Menu;

const QuestionMetadataDropdown = ({ options, onChange, type }) => {
  const handleDropdownPick = ({ key }) => {
    onChange(key);
  };

  const createDropdownItems = (tags) => {
    let items = [];

    for (const t of tags) {
      items.push(
        <Menu.Item onClick={handleDropdownPick} key={t.id}>
          {t.name}
        </Menu.Item>
      );
    }

    if (items.length === 0) {
      items.push(<Menu.Item text="Ingen tags..." />);
    }

    return items;
  };

  const createDropdowns = () => {
    if (type === 'tag') {
      let dropdown = [];

      const groupedTags = _.groupBy(options, (t) => t.category);

      for (const key in groupedTags) {
        dropdown.push(
          <SubMenu title={key.charAt(0).toUpperCase() + key.slice(1)}>
            {createDropdownItems(groupedTags[key])}
          </SubMenu>
        );
      }

      return dropdown;
    }

    if (type === 'specialty') {
      return _.map(options, (o) => {
        return (
          <Menu.Item onClick={handleDropdownPick} key={o.id}>
            {o.name}
          </Menu.Item>
        );
      });
    }
  };

  return (
    <span
      style={{
        margin: '5px',
        padding: '6px',
        backgroundColor: '#ededed',
        borderRadius: '5px',
        color: '#727272',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: '700'
      }}
    >
      <Dropdown overlay={<Menu>{createDropdowns()}</Menu>}>
        <span>
          <Icon name="plus" />
          Add {type}
          <Icon name="dropdown" />
        </span>
      </Dropdown>
    </span>
  );
};

QuestionMetadataDropdown.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  type: PropTypes.string
};

export default QuestionMetadataDropdown;
