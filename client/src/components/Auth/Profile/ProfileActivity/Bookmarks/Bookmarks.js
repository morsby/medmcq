import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import _ from 'lodash';
import { Divider } from 'semantic-ui-react';

/**
 * Component that displays questions
 */
const Bookmarks = ({ bookmarks }) => {
  if (bookmarks.length === 0) return 'Du har ikke bogmærket nogen spørgsmål';
  return (
    <div>
      {_.map(bookmarks, (bookmark, i) => (
        <div key={bookmark.id}>
          {i > 0 && <Divider />}
          <div dangerouslySetInnerHTML={{ __html: marked(bookmark.text) }} />
          <ol type="A">
            <li className={bookmark.correctAnswers.indexOf(1) > -1 ? 'svar-korrekt' : ''}>
              {bookmark.answer1}
            </li>
            <li className={bookmark.correctAnswers.indexOf(2) > -1 ? 'svar-korrekt' : ''}>
              {bookmark.answer2}
            </li>
            <li className={bookmark.correctAnswers.indexOf(3) > -1 ? 'svar-korrekt' : ''}>
              {bookmark.answer3}
            </li>
          </ol>
        </div>
      ))}
    </div>
  );
};

Bookmarks.propTypes = {
  /**
   * An object of bookmarked questions
   */
  bookmarks: PropTypes.object
};

export default Bookmarks;
