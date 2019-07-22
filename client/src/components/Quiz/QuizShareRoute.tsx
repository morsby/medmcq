import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions } from 'actions';
import { IReduxState } from 'reducers';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'pages/Quiz';
import * as types from '../../actions/types';

export interface QuizShareRouteProps extends RouteComponentProps {
  match: any;
}

const QuizShareRoute: React.SFC<QuizShareRouteProps> = ({ match }) => {
  const dispatch = useDispatch();
  const isFetching = useSelector((state: IReduxState) => state.questions.isFetching);
  const questions = useSelector((state: IReduxState) => state.questions.entities.questions);

  useEffect(() => {
    const fetchQuestions = async () => {
      const ids = match.params.ids.split(',');
      await dispatch(getQuestions({ ids, quiz: true }));
      await dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
    };

    fetchQuestions();
  }, [dispatch, match.params.id, match.params.ids]);

  if (isFetching || (questions && questions.length < 1)) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareRoute;
