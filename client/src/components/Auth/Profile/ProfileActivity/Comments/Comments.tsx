import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

import ProfileActivityAccordionElem from '../ProfileActivityAccordionElem';
import CommentsQuestion from './CommentsQuestion';
import { Button } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import CommentClass from 'classes/Comment';
import Quiz from 'classes/Quiz';
import { ReduxState } from 'redux/reducers';

export interface CommentsProps {
  comments: CommentClass[];
  type: string;
}

const Comments: React.SFC<CommentsProps> = ({ comments, type }) => {
  const dispatch = useDispatch();
  const questions = useSelector((state: ReduxState) => state.questions.questions);
  const history = useHistory();
  let [activeIndex, setActiveIndex] = useState(null);

  if (Object.keys(comments).length === 0) return <Translate id="profileComments.no_comments" />;

  const startAll = async () => {
    await Quiz.start({ ids: _.map(comments, (comment) => comment.question.id) });
    history.push('/quiz');
  };

  return (
    <div>
      <Button style={{ marginBottom: '1rem' }} onClick={startAll}>
        <Translate id="profileActivity.accordionElements.startAll"></Translate>
      </Button>
      {comments.map((comment, i) => {
        const question = questions[comment.question.id];

        return (
          <div>
            <ProfileActivityAccordionElem
              key={question.id}
              title={question.text}
              active={i === activeIndex}
              index={i}
              handleClick={setActiveIndex}
            >
              <CommentsQuestion question={question} type={type} />
            </ProfileActivityAccordionElem>
            <div style={{ textAlign: 'center', margin: '1rem' }}>
              <Button basic color="black" onClick={() => history.push(`/quiz/${question.id}`)}>
                <Translate id="profileActivity.accordionElements.accordionButton" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
