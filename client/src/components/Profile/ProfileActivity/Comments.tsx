import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import CommentClass from 'classes/Comment';
import { ReduxState } from 'redux/reducers';
import Quiz from 'classes/Quiz';
import Highlighter from 'react-highlighter';
import { Tag, Table } from 'antd';

export interface CommentsProps {
  comments: CommentClass[];
  type: 'public' | "private"
}

const Comments: React.SFC<CommentsProps> = ({ comments, type }) => {
  const [search, setSearch] = useState('');
  const selectedSemesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const specialties = useSelector(
    (state: ReduxState) => state.metadata.semesters.find((semester) => semester.id === selectedSemesterId).specialties
  );
  const history = useHistory();

  const startAll = async () => {
    await Quiz.start({ ids: _.map(comments, (comment) => comment.question.id) });
    history.push('/quiz');
  };

  const likesColumn =
    type === 'public'
      ? [
          {
            title: 'Likes',
            render: (record: CommentClass) => record.likes.length,
            sorter: (a: CommentClass, b: CommentClass) => a.likes.length - b.likes.length
          }
        ]
      : [];

  const columns = [
    {
      title: 'Dato',
      render: (record: CommentClass) => new Date(record.createdAt).toLocaleDateString(),
      sorter: (a: CommentClass, b: CommentClass) =>
        (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)
    },
    {
      title: 'Kommentar',
      render: (record: CommentClass) => (
        <Highlighter
          matchElement="span"
          search={search}
          matchStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        >
          {record.text}
        </Highlighter>
      )
    },
    {
      title: 'Specialer',
      render: (record: CommentClass) =>
        record.question.specialties.map((specialty) => (
          <Tag key={specialty.id} color="blue">
            {specialties.find((s) => s.id === specialty.id)?.name}
          </Tag>
        ))
    },
    ...likesColumn,
    {
      title: 'Valg',
      render: (record: CommentClass) => (
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

  return (
    <div>
      <Button style={{ marginBottom: '1rem' }} onClick={startAll}>
        <Translate id="profileActivity.accordionElements.startAll" />
      </Button>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey={(record: CommentClass) => String(record.id)}
          bordered
          title={() => (
            <Input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Søg..."
              style={{ width: '100%' }}
            />
          )}
          dataSource={comments.filter((comment) => comment.text.includes(search))}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Comments;
