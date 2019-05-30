import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

import { Icon } from 'semantic-ui-react';

import FeedbackListItem from './FeedbackListItem';

/**
 * Component der viser oversigt over forslag, selve listen.
 * Kaldes af ../FeedbackIndex.js
 */
class FeedbackList extends Component {
  state = { sortBy: 'votes', order: 'desc' };

  sortBy (key) {
    if (key === this.state.sortBy) {
      let order = this.state.order === 'desc' ? 'asc' : 'desc';
      this.setState({ order });
    } else {
      this.setState({ sortBy: key });
    }
  }

  render () {
    let { feedback, getSpecificFeedback } = this.props;

    let { sortBy, order } = this.state;

    let sortedFeedback = _.orderBy(feedback, sortBy, order);

    let icon = order === 'desc' ? <Icon name='sort descending' /> : <Icon name='sort ascending' />;

    return (
      <div>
        <p>
          <Translate id='feedbackList.sort_by' />{' '}
          <span
            style={{ fontWeight: 'bold' }}
            className='click'
            onClick={() => this.sortBy('date')}
          >
            <Translate id='feedbackList.date' />
          </span>{' '}
          {sortBy === 'date' && icon}
          <Translate id='feedbackList.or' />{' '}
          <span
            style={{ fontWeight: 'bold' }}
            className='click'
            onClick={() => this.sortBy('votes')}
          >
            <Translate id='feedbackList.popularity' />
          </span>
          {sortBy === 'votes' && icon}
        </p>

        {sortedFeedback.map((e) => {
          return <FeedbackListItem key={e._id} feedback={e} handleClick={getSpecificFeedback} />;
        })}
      </div>
    );
  }
}

FeedbackList.propTypes = {
  /**
   * Array af feedback-forslag.
   * Fra ../FeedbackIndex.js
   */
  feedback: PropTypes.array,

  /**
   * Funktion der henter detaljer omkring et bestemt forslag.
   * Fra redux
   */
  getSpecificFeedback: PropTypes.func
};
export default withRouter(FeedbackList);
