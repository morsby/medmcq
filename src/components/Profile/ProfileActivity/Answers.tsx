import React, { useState } from 'react';
import { Button, Divider, Statistic } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import AnswerDetails from './AnswerDetails/AnswerDetails';
import AnswerTagsDetailsTable from './AnswerDetails/AnswerTagsDetailsTable';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import styled from 'styled-components';
import { PieChart, Pie, Cell } from 'recharts';
import { Progress } from 'antd';
import _ from 'lodash';

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 5px;
`;

const FlexLine = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

export interface AnswersProps {}

/**
 * Component that displays a summary of the answered questions.
 */
const Answers: React.SFC<AnswersProps> = () => {
  const [details, toggleDetails] = useState(false);
  const [tagDetailsOpen, setTagsDetailsOpen] = useState(false);
  const { answers, publicComments, privateComments } = useSelector(
    (state: ReduxState) => state.profile
  );
  const tries = useSelector((state: ReduxState) => state.profile.tries);
  const semesterId = useSelector((state: ReduxState) => state.selection.semesterId);
  const questionCount = useSelector(
    (state: ReduxState) => state.metadata.semesters.find((s) => s.id === semesterId).questionCount
  );

  let totalAnswers = answers.length;
  const uniqQuestions = _.uniqBy(answers, (a) => a.question.id);
  let allRight = tries.filter((attempt) => attempt.tries === attempt.correct).length;
  let allWrong = tries.filter((a) => a.correct === 0).length;
  let mixed = tries.filter((a) => a.correct > 0 && a.correct < a.tries).length;
  const data = [
    {
      name: 'Korrekte',
      value: allRight,
      color: 'green',
    },
    {
      name: 'Forkerte',
      value: allWrong,
      color: 'red',
    },
    {
      name: 'Blandede',
      value: mixed,
      color: '#ebbd34',
    },
  ];
  const commentData = [
    {
      name: 'Offentlige',
      value: publicComments.length,
      color: 'green',
    },
    {
      name: 'Private',
      value: privateComments.length,
      color: '#ebbd34',
    },
  ];

  return (
    <div>
      <FlexLine>
        <Statistic>
          <Statistic.Value>{totalAnswers}</Statistic.Value>
          <Statistic.Label>Besvarelser</Statistic.Label>
        </Statistic>
        <StatBox>
          <Progress
            type="circle"
            percent={Math.round((uniqQuestions.length / questionCount) * 100)}
          />
          <StatLabel>Besvarede spørgsmål</StatLabel>
          <StatLabel>(uniqQuestions.length)</StatLabel>
        </StatBox>
        <StatBox>
          <PieChart height={180} width={250}>
            <Pie data={data} label nameKey="name" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={data[index].color} />
              ))}
            </Pie>
          </PieChart>
          <StatLabel>Fordeling af spørgsmålsbesvarelser</StatLabel>
          <StatLabel>
            <span style={{ color: 'green' }}>Korrekte</span>,{' '}
            <span style={{ color: 'red' }}>Forkerte</span>,{' '}
            <span style={{ color: '#ebbd34' }}>Blandet</span>
          </StatLabel>
        </StatBox>
        <StatBox>
          <PieChart height={180} width={250}>
            <Pie data={commentData} label nameKey="name" dataKey="value">
              {commentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={commentData[index].color} />
              ))}
            </Pie>
          </PieChart>
          <StatLabel>Kommentarer</StatLabel>
          <StatLabel>
            <span style={{ color: 'green' }}>Offentlige</span>,{' '}
            <span style={{ color: '#ebbd34' }}>Private</span>
          </StatLabel>
        </StatBox>
      </FlexLine>

      <Divider hidden />
      <Button
        basic
        color="blue"
        onClick={() => toggleDetails(!details)}
        disabled={totalAnswers === 0}
      >
        {details && totalAnswers > 0 ? (
          <Translate id="profileAnswers.buttons.details.hide_details" />
        ) : (
          <Translate id="profileAnswers.buttons.details.show_details" />
        )}
      </Button>
      <Button basic color="blue" onClick={() => setTagsDetailsOpen(!tagDetailsOpen)}>
        {!tagDetailsOpen ? 'Vis Tag Detaljer' : 'Skjul Tag Detaljer'}
      </Button>
      <Divider hidden />
      {details && totalAnswers > 0 && <AnswerDetails />}
      {tagDetailsOpen && <AnswerTagsDetailsTable />}
    </div>
  );
};

export default Answers;
