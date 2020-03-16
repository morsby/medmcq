import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Quiz from 'components/Quiz/Quiz';
import QuizClass from 'classes/Quiz';

export interface QuizShareBuilderLoader {}

const QuizShareBuilderLoader: React.SFC<QuizShareBuilderLoader> = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const shareId = Number(params.id);

  useEffect(() => {
    const fetchQuestions = async () => {
      await QuizClass.start({ shareId });
      setLoading(false);
    };

    fetchQuestions();
  }, [params.id]);

  if (loading) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareBuilderLoader;
