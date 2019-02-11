import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import _ from 'lodash';

import { Icon, Message } from 'semantic-ui-react';

import FeedbackListItem from './FeedbackListItem';

/**
 * Component der viser oversigt over forslag, selve listen.
 * Kaldes af ../FeedbackIndex.js
 */
class FeedbackList extends Component {
    state = { sortBy: 'votes', order: 'desc' };

    sortBy(key) {
        if (key === this.state.sortBy) {
            let order = this.state.order === 'desc' ? 'asc' : 'desc';
            this.setState({ order });
        } else {
            this.setState({ sortBy: key });
        }
    }

    render() {
        let { feedback, getSpecificFeedback } = this.props,
            { sortBy, order } = this.state;

        let sortedFeedback = _.orderBy(feedback, sortBy, order);

        let icon =
            order === 'desc' ? (
                <Icon name="sort descending" />
            ) : (
                <Icon name="sort ascending" />
            );

        return (
            <div>
                <h2>Feedback</h2>
                <Message info>
                    Der findes kun spørgsmål fra Inflammations- og
                    Abdomensemestrene, da de kursusansvarlige for HLK- og
                    GOP-semestrene ikke ønskede at deltage. Jeg kan derfor ikke
                    tilføje disse sæt, før I får overbevist de ansvarlige om, at
                    det er en god idé.
                </Message>
                <p>
                    Sorter feedback efter{' '}
                    <span
                        style={{ fontWeight: 'bold' }}
                        className="click"
                        onClick={() => this.sortBy('date')}
                    >
                        dato
                    </span>{' '}
                    {sortBy === 'date' && icon}
                    eller{' '}
                    <span
                        style={{ fontWeight: 'bold' }}
                        className="click"
                        onClick={() => this.sortBy('votes')}
                    >
                        popularitet
                    </span>
                    {sortBy === 'votes' && icon}
                </p>

                {sortedFeedback.map(e => {
                    return (
                        <FeedbackListItem
                            key={e._id}
                            feedback={e}
                            handleClick={getSpecificFeedback}
                        />
                    );
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
    getSpecificFeedback: PropTypes.func,
};
export default withRouter(FeedbackList);
