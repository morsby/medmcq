import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Quiz from 'components/Quiz/Quiz';
import QuizClass from 'classes/Quiz';
import { Container } from 'semantic-ui-react';

export interface QuizShareBuilderLoader {}

const QuizShareBuilderLoader: React.SFC<QuizShareBuilderLoader> = () => {
  const [isInvalid, setIsInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const shareId = params.id;

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!shareId) {
        setIsInvalid(true);
      } else {
        await QuizClass.start({ shareId });
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [params.id, shareId]);

  if (loading) return <LoadingPage />;
  if (isInvalid)
    return (
      <Container>
        <p>Dit link er ugyldigt</p>
      </Container>
    );
  return <Quiz />;
};

export default QuizShareBuilderLoader;
