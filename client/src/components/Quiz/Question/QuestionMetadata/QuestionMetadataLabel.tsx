import React, { useState } from 'react';
import { Icon, Label, Popup, Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from 'reducers/index';
import * as actions from 'actions';
import _ from 'lodash';

export interface QuestionMetadataLabelProps {
  metadata: { id: number };
  user: any;
  question: any;
  type: 'tag' | 'specialty';
}

const QuestionMetadataLabel: React.SFC<QuestionMetadataLabelProps> = ({
  metadata,
  user,
  question,
  children,
  type
}) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const tags = useSelector((state: IReduxState) => state.metadata.entities.tags);
  const tagChildren = _.filter(tags, (tag) => tag.parentId === metadata.id);

  const vote = async (vote: number | 'delete', metadataId?: number) => {
    setButtonLoading(true);
    if (!metadataId && isVotedOn(metadata) === vote) {
      vote = 'delete';
    }
    if (metadataId) {
      await dispatch(actions.voteAction('tag', question.id, metadataId, vote));
    } else {
      await dispatch(actions.voteAction(type, question.id, metadata.id, vote));
    }
    setButtonLoading(false);
  };

  const childrenTagged = () => {
    if (type === 'specialty') return true; // Specialer har ingen children, og derfór altid alle children tagged
    const questionTags = _.map(question.tags, (tag) => tag.tagId);
    const children = tagChildren.map((t) => t.id);
    if (children.length < 1) return true; // Hvis der ingen children er, er alle children tagges by default
    const isChildrenTagged = children.some((c) => questionTags.includes(c)); // Tjek om en af children er tagged
    return isChildrenTagged;
  };

  const isVotedOn = (metadata) => {
    let userVote;
    if (type === 'specialty') {
      userVote = _.get(question, ['userSpecialtyVotes', metadata.id], {}).value;
    } else {
      userVote = _.get(question, ['userTagVotes', metadata.id], {}).value;
    }
    return userVote || null;
  };

  let votes;
  if (type === 'specialty') {
    votes = (question.specialties[metadata.id] || {}).votes;
  } else {
    votes = (question.tags[metadata.id] || {}).votes;
  }

  const label = (
    <Label style={{ marginTop: '2px' }} size="small">
      {user && !childrenTagged() && <Icon name="chevron circle up" color="yellow" />}
      {children}
      {user && (
        <>
          <Icon
            onClick={() => vote(1)}
            name="arrow up"
            color={isVotedOn(metadata) === 1 ? 'green' : null}
            style={{ margin: '2px', cursor: 'pointer' }}
          />
          <Icon
            onClick={() => vote(-1)}
            name="arrow down"
            color={isVotedOn(metadata) === -1 ? 'red' : null}
            style={{ margin: '2px', cursor: 'pointer' }}
          />{' '}
          {votes}
        </>
      )}
    </Label>
  );

  if (user && !childrenTagged())
    return (
      <Popup position="top center" flowing hoverable trigger={label}>
        {tagChildren.map((tag) => (
          <Button key={tag.id} loading={buttonLoading} size="tiny" onClick={() => vote(1, tag.id)}>
            {tag.name}
          </Button>
        ))}
      </Popup>
    );

  return label;
};

export default QuestionMetadataLabel;
