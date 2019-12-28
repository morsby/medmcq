import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tree } from 'antd';

import { Translate } from 'react-localize-redux';

import { Form, Header, Grid, Input, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { ReduxState } from 'redux/reducers';
import 'antd/lib/tree/style/css';
import UIReducer from 'redux/reducers/ui';

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = () => {
  const dispatch = useDispatch();
  const { semesterId, specialtyIds, tagIds } = useSelector(
    (state: ReduxState) => state.ui.selection
  );
  const metadata = useSelector((state: ReduxState) => state.metadata);
  const semester = metadata.semesters.find((semester) => semester.id === semesterId);
  const [tagTree, setTagTree] = useState(null);
  const [tagSearch, setTagSearch] = useState('');

  const handleChange = (value: string[], type: 'tagIds' | 'specialtyIds') => {
    const numberedValues = value.map((id) => Number(id));
    dispatch(UIReducer.actions.changeSelection({ type, value: numberedValues }));
  };

  useEffect(() => {
    const convertMetadataToTree = () => {
      return metadata.tags
        .filter((t) => !t.parent.id)
        .map((t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id,
          children: getChildrenOfMetadata(t.id)
        }));
    };

    const getChildrenOfMetadata = (tagId: number) => {
      return _.filter(metadata.tags, (t) => t.parent.id === tagId).map((t) => ({
        title: `${t.name} (${t.questionCount})`,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    setTagTree(convertMetadataToTree());
  }, [metadata.tags, semesterId]);

  const renderTreeNodes = (tags) =>
    _.sortBy(tags, (t) => t.title).map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.key} {...item} />;
    });

  if (!semesterId) {
    return (
      <Header as="h3">
        <Translate id="selectionSpecialtiesSelector.choose_semester" />
      </Header>
    );
  }

  return (
    <Form>
      <Grid columns="equal" stackable>
        <Grid.Column>
          <Grid.Row>
            <Header as="h3">
              <Translate
                id="selectionSpecialtiesSelector.header"
                data={{ semester: semester.value }}
              />
            </Header>
            {metadata.specialties && (
              <>
                <Tree
                  checkable
                  checkedKeys={specialtyIds.map((id) => String(id))}
                  onCheck={(specialties) => handleChange(specialties as string[], 'specialtyIds')}
                >
                  {metadata.specialties.map((s) => (
                    <Tree.TreeNode
                      title={`${s.name} (${s.questionCount})`}
                      key={String(s.id)}
                      dataRef={s}
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
            <Translate>
              {({ translate }) => (
                <Input
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                  }}
                  fluid
                  placeholder={translate('selectionSpecialtiesSelector.search')}
                />
              )}
            </Translate>
            {tagSearch && metadata.tags && (
              <Tree
                checkedKeys={_.filter(
                  metadata.tags,
                  (t: any) =>
                    t.semesterId === semesterId &&
                    t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
                    tagIds.includes(String(t.id))
                ).map((t) => String(t.id))}
                onCheck={(tags: any, { node }) => {
                  handleChange(
                    [...tags, ..._.filter(tagIds, (id) => id !== String(node.props.dataRef.id))],
                    'tagIds'
                  ); // Ovenstående er en ret omstændig måde at få ID'er fra det filtrerede array til at også virke med det ikke filtrerede (da ID'er ikke vil eksistere i træet, når de udelukkes i søgning)
                }}
                checkable
              >
                {_(metadata.tags)
                  .filter(
                    (t) =>
                      t.semester.id === semesterId &&
                      t.name.toLowerCase().includes(tagSearch.toLowerCase())
                  )
                  .sortBy((t) => t.name)
                  .value()
                  .map((t) => (
                    <Tree.TreeNode
                      title={`${t.name} (${t.questionCount})`}
                      key={String(t.id)}
                      dataRef={t}
                    ></Tree.TreeNode>
                  ))}
              </Tree>
            )}
            {!tagSearch && tagTree && (
              <>
                <Tree
                  checkedKeys={tagIds.map((id) => String(id))}
                  onCheck={(tags: any) => handleChange(tags, 'tagIds')}
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

export default SelectionSpecialtiesSelector;
