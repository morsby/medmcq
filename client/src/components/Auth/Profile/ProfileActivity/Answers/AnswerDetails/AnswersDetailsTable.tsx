import React from 'react';
import { Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { Tag, Table } from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useHistory } from 'react-router';
import AnswerDetailsTableExtendedRow from './AnswerDetailsTableExtendedRow';
import { ReduxState } from 'redux/reducers';

export interface AnswersDetailsTableProps {
  answers: any[];
  toggleCheckbox: Function;
  questions: any[];
}

const AnswersDetailsTable: React.SFC<AnswersDetailsTableProps> = ({
  answers,
  toggleCheckbox,
  questions
}) => {
  const history = useHistory();
  const { specialties, examSets, tags } = useSelector((state: ReduxState) => state.metadata);

  const getColor = (answer) => {
    if (answer.correct === answer.tries) return 'green';
    if (answer.correct < answer.tries && answer.correct > 0) return 'orange';
    if (answer.correct === 0) return 'red';
  };

  const columns = [
    {
      title: <Translate id="profileAnswerDetails.table_headers.performance" />,
      render: (record) => (
        <Tag color={getColor(record)}>
          {record.correct} / {record.tries} ({Math.round((record.correct / record.tries) * 100)}
          %)
        </Tag>
      ),
      sorter: (a, b) =>
        Math.round((a.correct / a.tries) * 100) - Math.round((b.correct / b.tries) * 100)
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.question" />,
      key: 'text',
      render: (record) => (
        <p
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => history.push(`quiz/${record.key}`)}
        >
          {questions[record.key].text.substr(0, 100)}...
        </p>
      )
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.specialty" />,
      render: (record) =>
        _.map(questions[record.questionId].specialties, (specialty) => (
          <Tag color="blue">{specialties[specialty.id].name}</Tag>
        ))
    },
    {
      title: 'Tags',
      render: (record) =>
        _.map(questions[record.questionId].tags, (tag) => (
          <Tag color="geekblue">{tags[tag.id].name}</Tag>
        ))
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.set" />,
      render: (record) => (
        <>
          <Translate
            id={`profileAnswerDetails.${examSets[questions[record.questionId].examSet].season}`}
          />
          {examSets[questions[record.questionId].examSet].year}
        </>
      )
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys);
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
        dataSource={_.map(answers, (a, questionId) => ({ ...a, key: questionId }))}
        expandedRowRender={(record) => {
          const question = questions[record.key];

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
