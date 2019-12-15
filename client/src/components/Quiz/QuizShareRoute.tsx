import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions } from 'actions';
import { IReduxState } from 'reducers';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'components/Quiz/Quiz';
import * as types from '../../actions/types';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router';

export interface QuizShareRouteProps {}

const QuizShareRoute: React.SFC<QuizShareRouteProps> = () => {
  const history = useHistory();
  const params = useParams<{ ids: string }>();
  const dispatch = useDispatch();
  const isFetching = useSelector((state: IReduxState) => state.questions.isFetching);
  const questions = useSelector((state: IReduxState) => state.questions.entities.questions);
  const error = useSelector((state: IReduxState) => state.ui.error);

  useEffect(() => {
    const fetchQuestions = async () => {
      const ids = params.ids.split(',');

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
  }, [dispatch, history, params.ids]);

  if (error) {
    toast(error.message + ' from id', { autoClose: 3000, type: toast.TYPE.ERROR });
    history.push('/');
    return null;
  }
  if (isFetching || !questions) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareRoute;
