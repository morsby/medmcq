import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Quiz from 'components/Quiz/Quiz';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router';
import { ReduxState } from 'redux/reducers';
import QuizClass from 'classes/Quiz';

export interface QuizShareRouteProps {}

const QuizShareRoute: React.SFC<QuizShareRouteProps> = () => {
  const [isFetching, setIsFetching] = useState(true);
  const history = useHistory();
  const params = useParams<{ ids: string }>();
  const ids = params.ids.split(',').map((id) => Number(id));
  const dispatch = useDispatch();
  const error = useSelector((state: ReduxState) => state.ui.error);

  useEffect(() => {
    const fetchQuestions = async () => {
      // Check if valid ids
      ids.forEach((id) => {
        if (isNaN(id)) {
          toast('Invalid Id(s)', { autoClose: 3000, type: toast.TYPE.ERROR });
          return history.push('/');
        }
      });

      await QuizClass.start({ ids });
      setIsFetching(false);
    };

    fetchQuestions();
  }, [dispatch, history, params.ids]);

  if (error) {
    toast('Intet spørgsmål blev fundet', { autoClose: 3000, type: toast.TYPE.ERROR });
    history.push('/');
    return null;
  }
  if (isFetching) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareRoute;
