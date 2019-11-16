import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tree } from 'antd';
import 'antd/lib/tree/style/css';

import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid, Input } from 'semantic-ui-react';
import { IReduxState } from 'reducers';
import * as uiActions from './../../../actions/ui';
import _ from 'lodash';
import Semester from 'classes/Semester';

interface IMetadataEntity {
  id: number;
  name: string;
  semester: Semester;
  parent: { id: number };
  questionCount: number;
}

interface IMetadataSelectionObject {
  title: string;
  id: number;
  key: string;
  children: [IMetadataSelectionObject];
}

/**
 * Laver en checkbox for hvert speciale.
 */
const SelectionSpecialtiesSelector = () => {
  const selection = useSelector((state: IReduxState) => state.ui.selection);
  const metadata: {
    specialties: IMetadataEntity[];
    tags: IMetadataEntity[];
    semesters: any;
  } = useSelector((state: IReduxState) => state.metadata.entities);
  const { selectedSemester, selectedSpecialtyIds, selectedTagIds } = selection;
  const semester = metadata.semesters[selectedSemester];
  const dispatch = useDispatch();
  const [tagTree, setTagTree]: [IMetadataSelectionObject[] | null, Function] = useState(null);
  const [tagSearch, setTagSearch] = useState('');

  const onChange = (value: string[], type: string) => {
    dispatch(uiActions.changeSelection(type, value));
  };

  useEffect(() => {
    const convertMetadataToTree = () => {
      return _.filter(metadata.tags, (t) => !t.parent.id && t.semester.id === selectedSemester).map(
        (t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id,
          children: getChildrenOfMetadata(t.id)
        })
      );
    };

    const getChildrenOfMetadata: any = (tagId: number) => {
      return _.filter(metadata.tags, (t) => t.parent.id === tagId).map((t) => ({
        title: `${t.name} (${t.questionCount})`,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    setTagTree(convertMetadataToTree());
  }, [metadata.tags, selectedSemester]);

  const renderTreeNodes = (tags: IMetadataSelectionObject[]) =>
    _.sortBy(tags, (t) => t.title).map((item: IMetadataSelectionObject) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.key} {...item} />;
    });

  if (!selectedSemester) {
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
              <Tree
                checkable
                checkedKeys={selectedSpecialtyIds}
                onCheck={(specialties: any) => onChange(specialties, 'selectedSpecialtyIds')}
              >
                {_.filter(metadata.specialties, (s) => s.semester.id === selectedSemester).map(
                  (s) => (
                    <Tree.TreeNode
                      title={`${s.name} (${s.questionCount})`}
                      key={String(s.id)}
                      dataRef={s}
                    ></Tree.TreeNode>
                  )
                )}
              </Tree>
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
                    t.semesterId === selectedSemester &&
                    t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
                    selectedTagIds.includes(String(t.id))
                ).map((t) => String(t.id))}
                onCheck={(tags: any, { node }) => {
                  onChange(
                    [
                      ...tags,
                      ..._.filter(selectedTagIds, (id) => id !== String(node.props.dataRef.id))
                    ],
                    'selectedTagIds'
                  ); // Ovenstående er en ret omstændig måde at få ID'er fra det filtrerede array til at også virke med det ikke filtrerede (da ID'er ikke vil eksistere i træet, når de udelukkes i søgning)
                }}
                checkable
              >
                {_(metadata.tags)
                  .filter(
                    (t) =>
                      t.semester.id === selectedSemester &&
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
              <Tree
                checkedKeys={selectedTagIds.map((tagId) => String(tagId))}
                onCheck={(tags: any) => onChange(tags.map((tag) => Number(tag)), 'selectedTagIds')}
                checkable
              >
                {renderTreeNodes(tagTree)}
              </Tree>
            )}
          </Grid.Row>
        </Grid.Column>
      </Grid>
      <Message info>
        <Translate id="selectionSpecialtiesSelector.tags_explanation" />
      </Message>
    </Form>
  );
};

export default SelectionSpecialtiesSelector;
