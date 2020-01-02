import React from 'react';
import marked from 'marked';
import { Translate } from 'react-localize-redux';
import { Divider, Button } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import Quiz from 'classes/Quiz';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import _ from 'lodash';

/**
 * Component that displays questions
 */
export interface BookmarksProps {}

const Bookmarks: React.SFC<BookmarksProps> = () => {
  const history = useHistory();
  const bookmarks = useSelector((state: ReduxState) => state.profile.bookmarks);
  if (bookmarks.length === 0) return <Translate id="profileBookmarks.no_bookmarks" />;

  const openAll = async () => {
    Quiz.start({ ids: _.map(bookmarks, (bookmark) => bookmark.id) });
    history.push('/quiz');
  };

  return (
    <div>
      <Button onClick={openAll}>
        <Translate id="profileActivity.accordionElements.startAll" />
      </Button>
      {_.map(bookmarks, (bookmark, i) => (
        <div key={bookmark.id}>
          {Number(i) > 0 && <Divider />}
          <div dangerouslySetInnerHTML={{ __html: marked(bookmark.question.text) }} />
          <ol type="A">
            <li className={bookmark.question.correctAnswers.indexOf(1) > -1 ? 'svar-korrekt' : ''}>
              {bookmark.question.answer1}
            </li>
            <li className={bookmark.question.correctAnswers.indexOf(2) > -1 ? 'svar-korrekt' : ''}>
              {bookmark.question.answer2}
            </li>
            <li className={bookmark.question.correctAnswers.indexOf(3) > -1 ? 'svar-korrekt' : ''}>
              {bookmark.question.answer3}
            </li>
          </ol>
          <div style={{ textAlign: 'center', margin: '1rem' }}>
            <Button
              basic
              color="black"
              onClick={() => history.push(`/quiz/${bookmark.question.id}`)}
            >
              <Translate id="profileActivity.accordionElements.accordionButton" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookmarks;
