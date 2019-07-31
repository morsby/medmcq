import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch } from 'react-redux';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'pages/Quiz';
import * as types from '../../actions/types';
import { useQuery } from 'react-apollo-hooks';
import { getQuestions } from 'actions';
import { fetchQuestionIdsFromShareLink as query_fetchQuestionIdsFromShareLink } from 'queries/shareLink';
import ErrorBoundary from 'components/Misc/Utility-pages/ErrorBoundary';

export interface QuizShareBuilderLoader extends RouteComponentProps {
  match: any;
}

const QuizShareBuilderLoader: React.SFC<QuizShareBuilderLoader> = ({ match }) => {
  const dispatch = useDispatch();
  const { data, error, loading } = useQuery(query_fetchQuestionIdsFromShareLink, {
    variables: { shareId: match.params.id }
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      await dispatch(getQuestions({ ids: data.shareLink, quiz: true }));
      await dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
    };

    if (!loading) {
      fetchQuestions();
    }
  }, [data, dispatch, loading, match.params.id, match.params.ids]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorBoundary />;
  return <Quiz />;
};

export default QuizShareBuilderLoader;
