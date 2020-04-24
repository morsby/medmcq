import React from 'react';
import { Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { Tag, Table } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import AnswerDetailsTableExtendedRow from './AnswerDetailsTableExtendedRow';
import { ReduxState } from 'redux/reducers';
import { Answer } from 'types/generated';
import { TableRowSelection } from 'antd/lib/table/interface';

export interface AnswersDetailsTableProps {
  answers: Answer[];
  toggleCheckbox: Function;
  selectedIds: number[];
}

const AnswersDetailsTable: React.SFC<AnswersDetailsTableProps> = ({
  answers,
  toggleCheckbox,
  selectedIds,
}) => {
  const history = useHistory();
  const semesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const { specialties, tags, examSets } = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((s) => s.id === semesterId)
  );

  const getColor = (answer) => {
    if (answer.correct === answer.tries) return 'green';
    if (answer.correct < answer.tries && answer.correct > 0) return 'orange';
    if (answer.correct === 0) return 'red';
  };

  const columns = [
    {
      title: <Translate id="profileAnswerDetails.table_headers.performance" />,
      render: (record: Answer) => {
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
      },
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.question" />,
      key: 'text',
      render: (record: Answer) => (
        <p style={{ cursor: 'pointer' }} onClick={() => history.push(`quiz/${record.question.id}`)}>
          {record.question.text.substr(0, 100)}...
        </p>
      ),
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.specialty" />,
      render: (record: Answer) =>
        record.question.specialties.map((s) => {
          const specialty = specialties.find((sp) => sp.id === s.id);
          return <Tag color="blue">{specialty.name}</Tag>;
        }),
    },
    {
      title: 'Tags',
      render: (record: Answer) =>
        record.question.tags.map((tag) => {
          tag = tags.find((t) => t.id === tag.id);
          return <Tag color="geekblue">{tag.name}</Tag>;
        }),
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.set" />,
      render: (record: Answer) => {
        const examSet = examSets.find((set) => set.id === record.question.examSet.id);
        return (
          <>
            <Translate id={`profileAnswerDetails.${examSet.season}`} />
            {examSet.year}
          </>
        );
      },
    },
  ];

  const rowSelection: TableRowSelection<any> = {
    onChange: (selectedRowKeys) => {
      toggleCheckbox(selectedRowKeys);
    },
    selectedRowKeys: selectedIds,
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="small"
        rowSelection={rowSelection}
        rowKey={(record: Answer) => record.id}
        bordered
        columns={columns}
        dataSource={answers}
        expandedRowRender={(record: Answer) => {
          return (
            <>
              <p>{record.question.text}</p>
              <Divider />
              <AnswerDetailsTableExtendedRow question={record.question} />
            </>
          );
        }}
      />
    </div>
  );
};

export default AnswersDetailsTable;
