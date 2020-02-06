import React, { useState } from 'react';
import { Icon, Label, Popup, Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { ReduxState } from 'redux/reducers';
import Metadata from 'classes/Metadata';
import Tag, { TagVote } from 'classes/Tag';
import Specialty, { SpecialtyVote } from 'classes/Specialty';

export interface QuestionMetadataLabelProps {
  metadata: Tag | Specialty;
  type: 'tag' | 'specialty';
  metadataVotes: (TagVote|SpecialtyVote)[];
  voteCount: number
}

const QuestionMetadataLabel: React.SFC<QuestionMetadataLabelProps> = ({
  metadata,
  children,
  type,
  voteCount, metadataVotes
}) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector((state: ReduxState) => state.questions.questions[questionIndex])
  const chosenSemesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const { tags } = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === chosenSemesterId)
  );
  const user = useSelector((state: ReduxState) => state.auth.user)
  const tagChildren = _.filter(tags, (tag) => tag.parent.id === metadata.id);

  const vote = async (vote: number, metadataId?: number) => {
    setButtonLoading(true);
    if (!metadataId && isVotedOn() === vote) {
      vote = 0;
    }
    if (metadataId) {
      await Metadata.vote({ questionId: question.id, type, metadataId, vote });
    } else {
      await Metadata.vote({ questionId: question.id, type, metadataId: metadata.id, vote });
    }
    setButtonLoading(false);
  };

  const childrenTagged = () => {
    if (type === 'specialty') return true; // Specialer har ingen children, og derfór altid alle children tagged
    const questionTagIds = question.tags.map((tag) => tag.id);
    const children = tagChildren.map((t) => t.id);
    if (children.length < 1) return true; // Hvis der ingen children er, er alle children tagges by default
    const isChildrenTagged = children.some((c) => questionTagIds.includes(c)); // Tjek om en af children er tagged
    return isChildrenTagged;
  };

  const isVotedOn = () => metadataVotes.find((vote) => vote.user.id === user.id)?.vote;

  const label = (
    <Label style={{ marginTop: '2px' }} size="small">
      {user && !childrenTagged() && <Icon name="chevron circle up" color="yellow" />}
      {children}
      {user && (
        <>
          <Icon
            onClick={() => vote(1)}
            name="arrow up"
            color={isVotedOn() === 1 ? 'green' : null}
            style={{ margin: '2px', cursor: 'pointer' }}
          />
          <Icon
            onClick={() => vote(-1)}
            name="arrow down"
            color={isVotedOn() === -1 ? 'red' : null}
            style={{ margin: '2px', cursor: 'pointer' }}
          />{' '}
          {voteCount}
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
