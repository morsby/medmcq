import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag } from 'antd';
import _ from 'lodash';
import { useHistory } from 'react-router';
import { ReduxState } from 'redux/reducers';
import Quiz from 'classes/Quiz';
import Selection from 'classes/Selection';

type AnsweredTag = { id: number; name: string; correct: number; tries: number };
type AnsweredTags = { [key: string]: AnsweredTag };

export interface AnswerTagsDetailsTableProps {}

const AnswerTagsDetailsTable: React.SFC<AnswerTagsDetailsTableProps> = () => {
  const [answeredTags, setAnsweredTags] = useState([]);
  const history = useHistory();
  const selectedSemester = useSelector((state: ReduxState) => state.selection.semesterId);
  const userAnswers = useSelector((state: ReduxState) => state.profile.userAnswers);
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const tags = useSelector(
    (state: ReduxState) =>
      state.metadata.semesters.find((semester) => semester.id === selectedSemester).tags
  );

  const getPercentCorrect = (record: AnsweredTag) => {
    const percent = Math.round((record.correct / record.tries) * 100);
    if (isNaN(percent)) return 0;
    return percent;
  };

  const getColor = (record: AnsweredTag) => {
    const percent = getPercentCorrect(record);

    if (percent >= 80) return 'green';
    if (percent < 80 && percent >= 50) return 'volcano';
    if (percent < 50 && percent >= 30) return 'purple';
    if (percent < 30) return 'red';
  };

  const handleTagSelect = async (tagId: number) => {
    await Selection.change({ type: 'tagIds', value: [tagId] });
    await Selection.change({ type: 'n', value: 80 });
    await Quiz.start();
    history.push('/quiz');
  };

  useEffect(() => {
    const answeredTags: AnsweredTags = {};

    // Insert tags into answeredTags
    for (let tag of tags) {
      answeredTags[tag.id] = {
        id: tag.id,
        name: tag.name,
        correct: 0,
        tries: 0
      };
    }

    // For each answer, add the count to answeredTags
    for (let attempt of tries) {
      for (let tag of userAnswers.find((ua) => ua.answer.question.id === attempt.questionId).answer
        .question.tags) {
        if (answeredTags[tag.id]) {
          answeredTags[tag.id].correct += attempt.correct;
          answeredTags[tag.id].tries += attempt.tries;
        }
      }
    }

    // Send the array to state, to refresh table
    setAnsweredTags(_.map(answeredTags));
  }, [tags, tries, userAnswers]);

  const columns = [
    {
      title: 'Tag',
      render: (record: AnsweredTag) => (
        <p
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => handleTagSelect(record.id)}
        >
          {record.name}
        </p>
      ),
      sorter: (a: AnsweredTag, b: AnsweredTag) => a.name.localeCompare(b.name)
    },
    {
      title: 'Korrekt',
      dataIndex: 'correct',
      sorter: (a: AnsweredTag, b: AnsweredTag) => a.correct - b.correct
    },
    {
      title: 'Forsøg',
      dataIndex: 'tries',
      sorter: (a: AnsweredTag, b: AnsweredTag) => a.tries - b.tries
    },
    {
      title: 'Percent',
      render: (record: AnsweredTag) => {
        if (isNaN(Math.round(record.correct / record.tries))) {
          return <Tag color="blue">0%</Tag>;
        } else {
          return <Tag color={getColor(record)}>{getPercentCorrect(record)}%</Tag>;
        }
      },
      sorter: (a: AnsweredTag, b: AnsweredTag) => getPercentCorrect(a) - getPercentCorrect(b)
    }
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        size="small"
        loading={answeredTags.length < 1}
        bordered
        columns={columns}
        dataSource={answeredTags}
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default AnswerTagsDetailsTable;
