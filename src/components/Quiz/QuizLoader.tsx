import React, { useState, useEffect } from 'react';
import { Divider, Button } from 'semantic-ui-react';
import LoadingPage from '../Misc/Utility/LoadingPage';

/**
 * Loading-screen component ved start af quiz.
 * Kan forsøge igen eller fortryde anmodningen om spørgsmål
 *
 * Virker ved at sætte et interval - afhængig af tiden det tager, vises
 * forskellige beskeder.
 */
export interface QuizLoaderProps {
  handleRetry: Function;
  handleAbort: Function;
  text: { long_wait: string; retry: string; abort: string; fetching: string };
}

const QuizLoader: React.SFC<QuizLoaderProps> = ({ handleAbort, text }) => {
  const [hasLoadedSeconds, setHasLoadedSeconds] = useState(0);

  useEffect(() => {
    const tick = () => {
      setHasLoadedSeconds(hasLoadedSeconds + 1);
    };

    const interval = setInterval(tick, 5000);
    return clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  let longWait;
  if (hasLoadedSeconds >= 2) {
    longWait = (
      <div style={{ margin: '5px 0' }}>
        <Divider hidden />
        <p>{text.long_wait}</p>
        <Button basic color="yellow" onClick={() => handleAbort()}>
          {text.abort}
        </Button>
      </div>
    );
  }
  return (
    <div style={{ margin: '1rem 5rem', textAlign: 'center', minHeight: '100vh' }}>
      <LoadingPage />
      {longWait}
    </div>
  );
};

export default QuizLoader;
