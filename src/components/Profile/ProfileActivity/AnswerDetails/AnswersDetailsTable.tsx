import React from 'react';
import { Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { Tag, Table } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import AnswerDetailsTableExtendedRow from './AnswerDetailsTableExtendedRow';
import { ReduxState } from 'redux/reducers';
import { TableRowSelection } from 'antd/lib/table/interface';
import { UserAnswer } from 'types/generated';
import { Attempt } from 'classes/Profile';

export interface AnswersDetailsTableProps {
  answers: UserAnswer[];
  toggleCheckbox: Function;
  selectedIds: number[];
}

const AnswersDetailsTable: React.SFC<AnswersDetailsTableProps> = ({
  answers,
  toggleCheckbox,
  selectedIds
}) => {
  const history = useHistory();
  const semesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const { specialties, tags, examSets } = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((s) => s.id === semesterId)
  );

  const getColor = (answer: Attempt) => {
    if (answer.correct === answer.tries) return 'green';
    if (answer.correct < answer.tries && answer.correct > 0) return 'orange';
    if (answer.correct === 0) return 'red';
  };

  const columns = [
    {
      title: <Translate id="profileAnswerDetails.table_headers.performance" />,
      render: (record: UserAnswer) => {
        const attempt = tries.find((attempt) => attempt.questionId === record.answer.question.id);

        return (
          <Tag color={getColor(attempt)}>
            {attempt.correct} / {attempt.tries} (
            {Math.round((attempt.correct / attempt.tries) * 100)}
            %)
          </Tag>
        );
      },
      sorter: (a: Attempt, b: Attempt) => {
        const aAttempts = tries.find((attempt) => attempt.questionId === a.questionId);
        const bAttempts = tries.find((attempt) => attempt.questionId === b.questionId);
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
          style={{ cursor: 'pointer' }}
          onClick={() => history.push(`quiz/${record.answer.question.id}`)}
        >
          {record.answer.question.text.substr(0, 100)}...
        </p>
      )
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.specialty" />,
      render: (record: UserAnswer) =>
        record.answer.question.specialties.map((s) => {
          const specialty = specialties.find((sp) => sp.id === s.id);
          return <Tag color="blue">{specialty.name}</Tag>;
        })
    },
    {
      title: 'Tags',
      render: (record: UserAnswer) =>
        record.answer.question.tags.map((tag) => {
          tag = tags.find((t) => t.id === tag.id);
          return <Tag color="geekblue">{tag.name}</Tag>;
        })
    },
    {
      title: <Translate id="profileAnswerDetails.table_headers.set" />,
      render: (record: UserAnswer) => {
        const examSet = examSets.find((set) => set.id === record.answer.question.examSet.id);
        return (
          <>
            <Translate id={`profileAnswerDetails.${examSet.season}`} />
            {examSet.year}
          </>
        );
      }
    }
  ];

  const rowSelection: TableRowSelection<any> = {
    onChange: (selectedRowKeys) => {
      toggleCheckbox(selectedRowKeys);
    },
    selectedRowKeys: selectedIds
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="small"
        rowSelection={rowSelection}
        rowKey={(record: UserAnswer) => record.answer.question.id}
        bordered
        columns={columns}
        dataSource={answers}
        expandedRowRender={(record: UserAnswer) => {
          return (
            <>
              <p>{record.answer.question.text}</p>
              <Divider />
              <AnswerDetailsTableExtendedRow question={record.answer.question} />
            </>
          );
        }}
      />
    </div>
  );
};

export default AnswersDetailsTable;
