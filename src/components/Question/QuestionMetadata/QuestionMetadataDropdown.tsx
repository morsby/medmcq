import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import { Icon } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import Tag from 'classes/Tag';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Specialty from 'classes/Specialty';
const { SubMenu } = Menu;

type TagTreeItem = { title: string; key: number; children: TagTreeItem[] };

export interface QuestionMetadataDropdownProps {
  onChange: (id: number) => void;
  type: 'specialty' | 'tag';
}

const QuestionMetadataDropdown: React.SFC<QuestionMetadataDropdownProps> = ({ onChange, type }) => {
  const [tagTree, setTagTree] = useState(null);
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex]);
  const semesterId = question.examSet.semester.id;
  const { specialties, tags } = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === semesterId)
  );
  const options = type === 'specialty' ? specialties : tags;

  const handleDropdownPick = (id: number) => {
    onChange(id);
  };

  useEffect(() => {
    const convertMetadataToTree = () => {
      return _.filter(options, (t: Tag) => !t.parent?.id).map((t: Tag) => ({
        title: t.name,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    const getChildrenOfMetadata = (tagId: number): any => {
      return _.filter(options, (t: Tag) => t.parent?.id === tagId).map((t: Tag) => ({
        title: t.name,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    setTagTree(convertMetadataToTree());
  }, [options]);

  const createDropdownItems = (tags: TagTreeItem[]) => {
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
      return _.map(options, (s: Specialty) => {
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

export default QuestionMetadataDropdown;
