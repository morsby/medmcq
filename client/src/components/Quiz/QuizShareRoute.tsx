import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions } from 'actions';
import { IReduxState } from 'reducers';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'pages/Quiz';
import * as types from '../../actions/types';
import { toast } from 'react-toastify';

export interface QuizShareRouteProps extends RouteComponentProps {
  match: any;
}

const QuizShareRoute: React.SFC<QuizShareRouteProps> = ({ match, history }) => {
  const dispatch = useDispatch();
  const isFetching = useSelector((state: IReduxState) => state.questions.isFetching);
  const questions = useSelector((state: IReduxState) => state.questions.entities.questions);
  const error = useSelector((state: IReduxState) => state.ui.error);

  useEffect(() => {
    const fetchQuestions = async () => {
      const ids = match.params.ids.split(',');

      // Check if valid ids
      ids.forEach((id: string | number) => {
        if (isNaN(Number(id))) {
          toast('Invalid Id(s)', { autoClose: 3000, type: toast.TYPE.ERROR });
          return history.push('/');
        }
      });

      await dispatch(getQuestions({ ids, quiz: true }));
      await dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
    };

    fetchQuestions();
  }, [dispatch, history, match.params.id, match.params.ids]);

  if (error) {
    toast(error.message + ' from id', { autoClose: 3000, type: toast.TYPE.ERROR });
    history.push('/');
    return null;
  }
  if (isFetching || !questions) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareRoute;
