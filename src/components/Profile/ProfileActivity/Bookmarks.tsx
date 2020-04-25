import React, { useState } from 'react';
import marked from 'marked';
import { Translate } from 'react-localize-redux';
import { Divider, Button, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import Quiz from 'classes/Quiz';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import _ from 'lodash';
import Highlight from 'react-highlighter';

/**
 * Component that displays questions
 */
export interface BookmarksProps {}

const Bookmarks: React.SFC<BookmarksProps> = () => {
  const [search, setSearch] = useState('');
  const history = useHistory();
  const bookmarks = useSelector((state: ReduxState) => state.profile.bookmarks);
  if (bookmarks.length === 0) return <Translate id="profileBookmarks.no_bookmarks" />;

  const openAll = async () => {
    Quiz.start({ ids: _.map(bookmarks, (bookmark) => bookmark.question.id) });
    history.push('/quiz');
  };

  return (
    <div>
      <Button basic color="blue" onClick={openAll}>
        <Translate id="profileActivity.accordionElements.startAll" />
      </Button>
      <div style={{ height: '5px' }} />
      <Input
        fluid
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Søg..."
      />
      <Divider />
      {bookmarks
        .filter(
          (bookmark) =>
            bookmark.question.text.toLowerCase().includes(search.toLowerCase()) ||
            bookmark.question.answers.some((a) => a.text.includes(search.toLowerCase()))
        )
        .map((bookmark, i) => (
          <div key={bookmark.id}>
            {Number(i) > 0 && <Divider />}
            <div dangerouslySetInnerHTML={{ __html: marked(bookmark.question.text) }} />
            <ol type="A">
              {bookmark.question.answers.map((a) => (
                <li className={a.isCorrect ? 'svar-korrekt' : ''}>
                  <Highlight search={search}>{a.text}</Highlight>
                </li>
              ))}
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
