import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import _ from 'lodash';
import { Translate } from 'react-localize-redux';
import { Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';

/**
 * Component that displays questions
 */
const Bookmarks = ({ bookmarks, history }) => {
  if (Object.keys(bookmarks).length === 0) return <Translate id="profileBookmarks.no_bookmarks" />;
  return (
    <div>
      {_.map(bookmarks, (bookmark, i) => (
        <div key={bookmark.id}>
          {i > 0 && <Divider />}
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

Bookmarks.propTypes = {
  /**
   * An object of bookmarked questions
   */
  bookmarks: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(Bookmarks);
