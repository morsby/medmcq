import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tree } from 'antd';
import 'antd/lib/tree/style/css';

import { Translate } from 'react-localize-redux';

import { Form, Header, Message, Grid } from 'semantic-ui-react';
import { IReduxState } from 'reducers';
import * as uiActions from './../../../actions/ui';
import _ from 'lodash';

interface IMetadataEntity {
  id: number;
  name: string;
  semesterId: number;
  parentId: number;
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
  const metadata = useSelector((state: IReduxState) => state.metadata.entities);
  const { selectedSemester, selectedSpecialtyIds, selectedTagIds } = selection;
  const semester = metadata.semesters[selectedSemester];
  const dispatch = useDispatch();
  const [tagTree, setTagTree]: [IMetadataSelectionObject[] | null, Function] = useState(null);

  const onChange = (value: string[], type: string) => {
    dispatch(uiActions.changeSelection(type, value));
  };

  useEffect(() => {
    const convertMetadataToTree = () => {
      return _.filter(metadata.tags, (t) => !t.parentId && t.semesterId === selectedSemester).map(
        (t) => ({
          title: `${t.name} (${t.questionCount})`,
          key: t.id,
          children: getChildrenOfMetadata(t.id)
        })
      );
    };

    const getChildrenOfMetadata: any = (tagId: number) => {
      return _.filter(metadata.tags, (t) => t.parentId === tagId).map((t) => ({
        title: `${t.name} (${t.questionCount})`,
        key: t.id,
        children: getChildrenOfMetadata(t.id)
      }));
    };

    setTagTree(convertMetadataToTree());
  }, [metadata.tags, selectedSemester]);

  const renderTreeNodes = (tags: IMetadataSelectionObject[]) =>
    tags.map((item: IMetadataSelectionObject) => {
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
                {_.filter(metadata.specialties, (s) => s.semesterId === selectedSemester).map(
                  (s) => (
                    <Tree.TreeNode
                      title={`${s.name} (${s.questionCount})`}
                      key={s.id}
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
            {tagTree && (
              <Tree
                checkedKeys={selectedTagIds}
                onCheck={(tags: any) => onChange(tags, 'selectedTagIds')}
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
