import React, { useState } from 'react';
import marked from 'marked';
import { Translate } from 'react-localize-redux';
import { Divider, Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import Quiz from 'classes/Quiz';
import Highlight from 'react-highlighter';
import Question from 'classes/Question';

/**
 * Component that displays questions
 */
export interface QuestionTableProps {
  questions: Question[];
}

const QuestionTable: React.SFC<QuestionTableProps> = ({ questions }) => {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const openAll = async () => {
    Quiz.start({ ids: questions.map((q) => q.id) });
    history.push('/quiz');
  };

  if (questions.length === 0) return <p>Ingen spørgsmål...</p>;
  return (
    <div>
      <Button basic color="blue" onClick={openAll}>
        <Translate id="profileActivity.accordionElements.startAll" />
      </Button>
      <div style={{ height: '5px' }} />
      <Input
        fluid
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Søg..."
      />
      <Divider />
      {questions
        .filter(
          (q) =>
            q.text.toLowerCase().includes(search.toLowerCase()) ||
            q.answers.some((a) => a.text.includes(search.toLowerCase()))
        )
        .map((question, i) => (
          <div key={question.id}>
            {Number(i) > 0 && <Divider />}
            <div dangerouslySetInnerHTML={{ __html: marked(question.text) }} />
            <ol type="A">
              {question.answers.map((a) => (
                <li className={a.isCorrect ? 'svar-korrekt' : ''}>
                  <Highlight search={search}>{a.text}</Highlight>
                </li>
              ))}
            </ol>
            <div style={{ textAlign: 'center', margin: '1rem' }}>
              <Button basic color="black" onClick={() => history.push(`/quiz/${question.id}`)}>
                <Translate id="profileActivity.accordionElements.accordionButton" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default QuestionTable;
