import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from 'reducers';
import LoadingPage from 'components/Misc/Utility-pages/LoadingPage';
import Quiz from 'pages/Quiz';
import * as types from '../../actions/types';

export interface QuizShareBuilderLoader extends RouteComponentProps {
  match: any;
}

const QuizShareBuilderLoader: React.SFC<QuizShareBuilderLoader> = ({ match }) => {
  const dispatch = useDispatch();
  const isFetching = useSelector((state: IReduxState) => state.questions.isFetching);
  const questions = useSelector((state: IReduxState) => state.questions.entities.questions);

  useEffect(() => {
    const fetchQuestions = async () => {
      const ids = match.params.id;
      // Hent sharelink ud fra shared
      // Tæl antal af besøg til dette link
      await dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
    };

    fetchQuestions();
  }, [dispatch, match.params.id, match.params.ids]);

  if (isFetching || (questions && questions.length < 1)) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareBuilderLoader;
