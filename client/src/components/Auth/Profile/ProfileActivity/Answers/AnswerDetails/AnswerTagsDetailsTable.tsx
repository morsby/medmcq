import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from 'reducers';
import { Table, Tag } from 'antd';
import * as uiActions from 'actions/ui';
import * as questionActions from 'actions/question';
import _ from 'lodash';
import { useHistory } from 'react-router';

export interface AnswerTagsDetailsTableProps {
  answers: any[];
}

const AnswerTagsDetailsTable: React.SFC<AnswerTagsDetailsTableProps> = ({ answers }) => {
  const questions = useSelector((state: IReduxState) => state.questions.entities.questions);
  let { tags } = useSelector((state: IReduxState) => state.metadata.entities);
  const [answeredTags, setAnsweredTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedSemester = useSelector((state: IReduxState) => state.ui.selection.selectedSemester);
  const dispatch = useDispatch();
  const history = useHistory();

  const getPercentCorrect = (record) => Math.round((record.correct / record.tries) * 100);

  const getColor = (record) => {
    const percent = getPercentCorrect(record);

    if (percent >= 80) return 'green';
    if (percent < 80 && percent >= 50) return 'volcano';
    if (percent < 50 && percent >= 30) return 'purple';
    if (percent < 30) return 'red';
  };

  const handleTagSelect = async (tagId: number) => {
    await dispatch(uiActions.changeSelection('selectedTagIds', [tagId]));
    await dispatch(uiActions.changeSelection('n', 80));
    await dispatch(questionActions.getQuestions({}));
    history.push('/quiz');
  };

  useEffect(() => {
    const answeredTags = {};
    tags = _.filter(tags, { semesterId: selectedSemester });

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
    _.map(answers, (answer, questionId) => {
      for (let tag of _.map<any>(questions[questionId].tags)) {
        answeredTags[tag.tagId].correct += answer.correct;
        answeredTags[tag.tagId].tries += answer.tries;
      }
    });

    // Send the array to state, to refresh table
    setAnsweredTags(_.map(answeredTags));
  }, []);

  const columns = [
    {
      title: 'Tag',
      sorter: (a, b) => a.name - b.name,
      render: (record) => (
        <p
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => handleTagSelect(record.id)}
        >
          {record.name}
        </p>
      )
    },
    {
      title: 'Korrekt',
      dataIndex: 'correct',
      sorter: (a, b) => a.correct - b.correct
    },
    {
      title: 'Forsøg',
      dataIndex: 'tries',
      sorter: (a, b) => a.tries - b.tries
    },
    {
      title: 'Percent',
      render: (record) => {
        if (isNaN(Math.round(record.correct / record.tries))) {
          return <Tag color="blue">0%</Tag>;
        } else {
          return <Tag color={getColor(record)}>{getPercentCorrect(record)}%</Tag>;
        }
      },
      sorter: (a, b) => getPercentCorrect(a) - getPercentCorrect(b)
    }
  ];

  return (
    <Table loading={answeredTags.length < 1} bordered columns={columns} dataSource={answeredTags} />
  );
};

export default AnswerTagsDetailsTable;
