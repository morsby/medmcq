import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tree } from 'antd';

import { Translate, LocalizeContextProps, withLocalize } from 'react-localize-redux';

import { Form, Header, Grid, Input, Button } from 'semantic-ui-react';
import { ReduxState } from 'redux/reducers';
import Selection from 'classes/Selection';
import _ from 'lodash';
import 'antd/lib/tree/style/css';

interface TagSelectionObject {
  title: string;
  key: string;
  children: TagSelectionObject[];
}

/**
 * Laver en checkbox for hvert speciale.
 */
export interface SelectionSpecialtiesSelectorProps extends LocalizeContextProps {}

const SelectionSpecialtiesSelector: React.SFC<SelectionSpecialtiesSelectorProps> = ({
  translate
}) => {
  const { semesterId, specialtyIds, tagIds } = useSelector((state: ReduxState) => state.selection);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === semesterId)
  );
  const [tagTree, setTagTree] = useState(null);
  const [tagSearch, setTagSearch] = useState('');

  const handleChange = (value: number[], type: 'tagIds' | 'specialtyIds') => {
    Selection.change({ type, value });
  };

  useEffect(() => {
    if (!semester) return;
    const convertMetadataToTree = () => {
      return semester.tags
        .filter((t) => !t.parent.id)
        .map((t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id,
          children: getChildrenOfMetadata(t.id)
        }));
    };

    const getChildrenOfMetadata = (tagId: number): TagSelectionObject[] => {
      return semester.tags
        .filter((t) => t.parent.id === tagId)
        .map((t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id.toString(),
          children: getChildrenOfMetadata(t.id)
        }));
    };

    setTagTree(convertMetadataToTree());
  }, [semester, semesterId]);

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

  if (!semester) return <p>Du skal vælge et semester for at se specialer og tags.</p>;
  return (
    <Form>
      <Grid columns="equal" stackable>
        <Grid.Column>
          <Grid.Row>
            <Header as="h3">
              <Translate
                id="selectionSpecialtiesSelector.header"
                data={{ semester: semester?.value }}
              />
            </Header>
            {semester.specialties && (
              <>
                <Tree
                  checkable
                  checkedKeys={specialtyIds.map((id) => String(id))}
                  onCheck={(specialties: string[]) =>
                    handleChange(specialties.map((id) => Number(id)) as number[], 'specialtyIds')
                  }
                >
                  {semester.specialties.map((s) => (
                    <Tree.TreeNode
                      title={`${s.name} (${s.questionCount})`}
                      key={String(s.id)}
                    ></Tree.TreeNode>
                  ))}
                </Tree>
                <div style={{ textAlign: 'center' }}>
                  <Button onClick={() => handleChange([], 'specialtyIds')} size="small" fluid basic>
                    <Translate id="selectionSpecialtiesSelector.clear" />
                  </Button>
                </div>
              </>
            )}
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row>
            <Header as="h3">
              <Translate
                id="selectionSpecialtiesSelector.tags"
                data={{ semester: semester.value }}
              />
            </Header>
            <Input
              onChange={(e) => {
                setTagSearch(e.target.value);
              }}
              fluid
              placeholder={translate('selectionSpecialtiesSelector.search')}
            />
            {tagSearch && semester.tags && (
              <Tree
                checkedKeys={tagIds.map((id) => String(id))}
                onCheck={(tags: string[], { node, checked }) => {
                  if (checked) return handleChange([...tagIds, Number(node.key)], 'tagIds');
                  handleChange(
                    tagIds.filter((id) => id !== Number(node.key)),
                    'tagIds'
                  );
                }}
                checkable
              >
                {_(semester.tags)
                  .filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase()))
                  .sortBy((t) => t.name)
                  .value()
                  .map((t) => (
                    <Tree.TreeNode title={`${t.name} (${t.questionCount})`} key={t.id} />
                  ))}
              </Tree>
            )}
            {!tagSearch && tagTree && (
              <>
                <Tree
                  checkedKeys={tagIds.map((id) => String(id))}
                  onCheck={(tags: string[]) =>
                    handleChange(
                      tags.map((t) => Number(t)),
                      'tagIds'
                    )
                  }
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
            )}
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default withLocalize(SelectionSpecialtiesSelector);
