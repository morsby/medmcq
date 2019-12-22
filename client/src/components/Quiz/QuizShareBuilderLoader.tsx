import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'components/Quiz/Quiz';
import { useQuery } from 'react-apollo-hooks';
import { fetchQuestionIdsFromShareLink as query_fetchQuestionIdsFromShareLink } from 'queries/shareLink';
import ErrorBoundary from 'components/Misc/Utility-pages/ErrorBoundary';
import Question from 'classes/Question';

export interface QuizShareBuilderLoader {}

const QuizShareBuilderLoader: React.SFC<QuizShareBuilderLoader> = () => {
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { data, error, loading } = useQuery(query_fetchQuestionIdsFromShareLink, {
    variables: { shareId: params.id }
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      await Question.fetch({ ids: data.shareLink });
    };

    // Når ID'er er hentet gennem useQuery, så henter vi spørgsmålene fra ID'erne normalt
    if (!loading) {
      fetchQuestions();
    }
  }, [data, dispatch, loading, params.id]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorBoundary />;
  return <Quiz />;
};

export default QuizShareBuilderLoader;
