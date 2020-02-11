import React from 'react';
import { Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { Tag, Table } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import AnswerDetailsTableExtendedRow from './AnswerDetailsTableExtendedRow';
import { ReduxState } from 'redux/reducers';
import Question from 'classes/Question';
import { UserAnswer } from 'classes/User';

export interface AnswersDetailsTableProps {
  answers: UserAnswer[];
  toggleCheckbox: Function;
  questions: Question[];
}

const AnswersDetailsTable: React.SFC<AnswersDetailsTableProps> = ({
  answers,
  toggleCheckbox,
  questions
}) => {
  const history = useHistory();
  const tries = useSelector((state: ReduxState) => state.profile.tries);

  const getColor = (answer) => {
    if (answer.correct === answer.tries) return 'green';
    if (answer.correct < answer.tries && answer.correct > 0) return 'orange';
    if (answer.correct === 0) return 'red';
  };

  const columns = [
    {
      title: <Translate id="profileAnswerDetails.table_headers.performance" />,
      render: (record: UserAnswer) => {
        const attempt = tries.find((attempt) => attempt.questionId === record.question.id);

        return (
          <Tag color={getColor(attempt)}>
            {attempt.correct} / {attempt.tries} (
            {Math.round((attempt.correct / attempt.tries) * 100)}
            %)
          </Tag>
        );
      },
      sorter: (a, b) => {
        const aAttempts = tries.find((attempt) => attempt.questionId === a.question.id);
        const bAttempts = tries.find((attempt) => attempt.questionId === b.question.id);
        return (
          Math.round((aAttempts.correct / aAttempts.tries) * 100) -
          Math.round((bAttempts.correct / bAttempts.tries) * 100)
        );
      }
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.question" />,
      key: 'text',
      render: (record: UserAnswer) => (
        <p
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => history.push(`quiz/${record.question.id}`)}
        >
          {record.question.text.substr(0, 100)}...
        </p>
      )
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.specialty" />,
      render: (record: UserAnswer) =>
        record.question.specialties.map((specialty) => <Tag color="blue">{specialty.name}</Tag>)
    },
    {
      title: 'Tags',
      render: (record: UserAnswer) =>
        record.question.tags.map((tag) => <Tag color="geekblue">{tag.name}</Tag>)
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.set" />,
      render: (record: UserAnswer) => (
        <>
          <Translate id={`profileAnswerDetails.${record.question.examSet.season}`} />
          {record.question.examSet.year}
        </>
      )
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      toggleCheckbox(selectedRowKeys);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="small"
        rowSelection={rowSelection}
        rowKey={(record) => record.key}
        bordered
        columns={columns}
        dataSource={answers}
        expandedRowRender={(record: UserAnswer) => {
          const question = questions.find((question) => question.id === record.question.id);

          return (
            <>
              <p>{question.text}</p>
              <Divider />
              <AnswerDetailsTableExtendedRow question={question} />
            </>
          );
        }}
      />
    </div>
  );
};

export default AnswersDetailsTable;
