import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import Selection from 'classes/Selection';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import { Button } from 'semantic-ui-react';
import { LocalizeContextProps, withLocalize, Translate } from 'react-localize-redux';
import _ from 'lodash';

interface TagSelectionObject {
  title: string;
  key: string;
  children: TagSelectionObject[];
}

export interface SelectionMetadataTagTreeProps extends LocalizeContextProps {
  defaultExpandAll?: boolean;
  search?: string;
}

const SelectionMetadataTagTree: React.SFC<SelectionMetadataTagTreeProps> = ({
  defaultExpandAll,
  search
}) => {
  const [tagTree, setTagTree] = useState(null);
  const { tagIds, semesterId } = useSelector((state: ReduxState) => state.selection);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === semesterId)
  );

  const handleChange = (value: number[], type: 'tagIds' | 'specialtyIds') => {
    Selection.change({ type, value });
  };

  useEffect(() => {
    const convertMetadataToTree = () => {
      return semester.tags
        .filter((t) => !t.parent.id)
        .map((t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id,
          children: getChildrenOfMetadata(t.id)
        }));
    };

    const getChildrenOfMetadata = (tagId: number) => {
      return semester.tags
        .filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()))
        .filter((t) => t.parent.id === tagId)
        .map((t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id,
          children: getChildrenOfMetadata(t.id)
        }));
    };

    setTagTree(convertMetadataToTree());
  }, [semester, semesterId, search, defaultExpandAll]);

  const renderTreeNodes = (tags: TagSelectionObject[]) =>
    _.sortBy(tags, (t) => t.title).map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.key} {...item} />;
    });

  return (
    <>
      <Tree
        defaultExpandAll={defaultExpandAll}
        checkStrictly
        checkedKeys={tagIds.map((id) => id)}
        onCheck={(tags: number[], { node, checked }) => {
          if (checked) return handleChange([...tagIds, node.key], 'tagIds');
          handleChange(
            tagIds.filter((id) => id !== node.key),
            'tagIds'
          );
        }}
        checkable
      >
        {renderTreeNodes(tagTree)}
      </Tree>
      <div style={{ textAlign: 'center' }}>
        <Button onClick={() => handleChange([], 'tagIds')} size="small" fluid basic>
          <Translate id="selectionSpecialtiesSelector.clear" />
        </Button>
      </div>
    </>
  );
};

export default withLocalize(SelectionMetadataTagTree);
