import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions } from 'actions';
import { Table, Input, Tag } from 'antd';
import { IReduxState } from 'reducers';
import Highlighter from 'react-highlighter';

export interface CommentsProps {
  questions: any;
  comments: any;
  type: string;
}

const Comments: React.SFC<CommentsProps> = ({ questions = {}, comments = {}, type = 'public' }) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const publicComments = useSelector(
    (state: IReduxState) => state.questions.entities.publicComments
  );
  const privateComments = useSelector(
    (state: IReduxState) => state.questions.entities.privateComments
  );
  const specialties = useSelector((state: IReduxState) => state.metadata.entities.specialties);

  if (Object.keys(comments).length === 0) return <Translate id="profileComments.no_comments" />;

  const startAll = async () => {
    await dispatch(getQuestions({ ids: _.map(comments, (comment) => comment.questionId) }));
    history.push('/quiz');
  };

  const columns = [
    {
      title: 'Dato',
      render: (record) => new Date(record.comment.createdAt).toLocaleDateString(),
      sorter: (a, b) =>
        (new Date(a.comment.createdAt) as any) - (new Date(b.comment.createdAt) as any)
    },
    {
      title: 'Kommentar',
      render: (record) => (
        <Highlighter matchElement="span" search={search} matchStyle={{ backgroundColor: '#ffc069', padding: 0 }}>{record.comment.text}</Highlighter>
      )
    },
    {
      title: 'Speciale',
      render: (record) =>
        _.map(record.question.specialties, (specialty) => (
          <Tag key={specialty.specialtyId} color="blue">
            {specialties[specialty.specialtyId].name}
          </Tag>
        ))
    },
    {
      title: 'Likes',
      render: (record) => (type === 'public' ? record.comment.likes.length : 0),
      sorter: (a, b) => a.comment.likes?.length - b.comment.likes?.length
    },
    {
      title: 'Valg',
      render: (record) => (
        <Button
          color="blue"
          basic
          size="tiny"
          onClick={() => history.push(`/quiz/${record.question.id}`)}
        >
          Gå til spørgsmål
        </Button>
      )
    }
  ];

  const searchComments = (comments) => {
    if (search) {
      if (type === 'public') {
        return _.filter(comments, (comment) =>
          publicComments[comment.id].text.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
      }
      if (type === 'private') {
        return _.filter(comments, (comment) =>
          privateComments[comment.id].text.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
      }
    }

    return _.map(comments);
  };

  return (
    <div>
      <Button style={{ marginBottom: '1rem' }} onClick={startAll}>
        <Translate id="profileActivity.accordionElements.startAll" />
      </Button>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey={(record) => record.comment.id}
          bordered
          title={() => (
            <Input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Søg..."
              style={{ width: '100%' }}
            />
          )}
          dataSource={searchComments(comments).map((comment) => {
            if (type === 'public') {
              return {
                comment: publicComments[comment.id],
                question: questions[comment.questionId]
              };
            } else if (type === 'private') {
              return {
                comment: privateComments[comment.id],
                question: questions[comment.questionId]
              };
            }
          })}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Comments;
