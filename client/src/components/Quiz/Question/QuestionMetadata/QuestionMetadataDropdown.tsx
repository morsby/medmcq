import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import 'antd/lib/dropdown/style/css';
import 'antd/lib/menu/style/css';
import { Icon } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
const { SubMenu } = Menu;

const QuestionMetadataDropdown = ({ options, onChange, type }) => {
  const [tagTree, setTagTree] = useState(null);

  const handleDropdownPick = (id) => {
    onChange(id);
  };

  useEffect(() => {
    const convertMetadataToTree = () => {
      return _.filter(options, (t) => !t.parent.id).map((t) => ({
        title: t.name,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    const getChildrenOfMetadata = (tagId) => {
      return _.filter(options, (t) => t.parent.id === tagId).map((t) => ({
        title: t.name,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    setTagTree(convertMetadataToTree());
  }, [options]);

  const createDropdownItems = (tags) => {
    let items = [];

    for (const t of tags) {
      if (t.children.length > 0) {
        items.push(
          <SubMenu
            onTitleClick={() => handleDropdownPick(t.key)}
            title={t.title.charAt(0).toUpperCase() + t.title.slice(1)}
            key={t.key}
          >
            {createDropdownItems(t.children)}
          </SubMenu>
        );
      } else {
        items.push(
          <Menu.Item onClick={() => handleDropdownPick(t.key)} key={t.key}>
            {t.title}
          </Menu.Item>
        );
      }
    }

    if (items.length === 0) {
      items.push(<Menu.Item>Ingen tags...</Menu.Item>);
    }

    return items;
  };

  const createDropdowns = () => {
    if (type === 'tag') {
      let dropdown = [];

      for (const t of tagTree) {
        dropdown.push(
          <SubMenu
            onTitleClick={() => handleDropdownPick(t.key)}
            title={t.title.charAt(0).toUpperCase() + t.title.slice(1)}
            key={t.key}
          >
            {createDropdownItems(t.children)}
          </SubMenu>
        );
      }

      return dropdown;
    }

    if (type === 'specialty') {
      return _.map(options, (s) => {
        return (
          <Menu.Item onClick={() => handleDropdownPick(s.id)} key={s.id}>
            {s.name}
          </Menu.Item>
        );
      });
    }
  };

  if (!tagTree) return null;
  return (
    <span
      style={{
        margin: '5px',
        padding: '4px',
        backgroundColor: '#ededed',
        borderRadius: '5px',
        color: '#727272',
        display: 'inline-block',
        fontSize: '11px'
      }}
    >
      <Dropdown overlay={<Menu>{createDropdowns()}</Menu>}>
        <span>
          <Icon name="plus" />
          {type === 'specialty' ? (
            <Translate id="questionMetadata.addSpecialty" />
          ) : (
            <Translate id="questionMetadata.addTag" />
          )}
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
