import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'pages/Quiz';
import * as types from '../../actions/types';
import { useQuery } from 'react-apollo-hooks';
import { getQuestions } from 'actions';
import { fetchQuestionIdsFromShareLink as query_fetchQuestionIdsFromShareLink } from 'queries/shareLink';
import ErrorBoundary from 'components/Misc/Utility-pages/ErrorBoundary';

export interface QuizShareBuilderLoader {
}

const QuizShareBuilderLoader: React.SFC<QuizShareBuilderLoader> = () => {
  const params: any = useParams();
  const dispatch = useDispatch();
  const { data, error, loading } = useQuery(query_fetchQuestionIdsFromShareLink, {
    variables: { shareId: params.id }
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      await dispatch(getQuestions({ ids: data.shareLink, quiz: true }));
      await dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
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
