import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import CommentClass from 'classes/Comment';
import { ReduxState } from 'redux/reducers';
import Quiz from 'classes/Quiz';
import Highlighter from 'react-highlight-words';
import { Tag, Table } from 'antd';

export interface CommentsProps {
  comments: CommentClass[];
}

const Comments: React.SFC<CommentsProps> = ({ comments }) => {
  const [search, setSearch] = useState('');
  const selectedSemesterId = useSelector((state: ReduxState) => state.ui.selection.semesterId);
  const specialties = useSelector(
    (state: ReduxState) => state.metadata.semesters.find((semester) => semester.id === selectedSemesterId).specialties
  );
  const history = useHistory();

  const startAll = async () => {
    await Quiz.start({ ids: _.map(comments, (comment) => comment.question.id) });
    history.push('/quiz');
  };

  const columns = [
    {
      title: 'Dato',
      render: (record: CommentClass) => new Date(record.createdAt).toLocaleDateString(),
      sorter: (a, b) =>
        (new Date(a.comment.createdAt) as any) - (new Date(b.comment.createdAt) as any)
    },
    {
      title: 'Kommentar',
      render: (record: CommentClass) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[search]}
          textToHighlight={record.text}
        />
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
