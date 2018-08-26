import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import _ from "lodash";

import { Icon } from "semantic-ui-react";

import FeedbackListItem from "./FeedbackListItem";

class FeedbackList extends Component {
    state = { sortBy: "votes", order: "desc" };

    sortBy(key) {
        if (key === this.state.sortBy) {
            let order = this.state.order === "desc" ? "asc" : "desc";
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
            order === "desc" ? (
                <Icon name="sort descending" />
            ) : (
                <Icon name="sort ascending" />
            );

        return (
            <div>
                <h2>Feedback</h2>
                <p>
                    Sorter feedback efter{" "}
                    <span
                        style={{ fontWeight: "bold" }}
                        className="click"
                        onClick={() => this.sortBy("date")}
                    >
                        dato
                    </span>{" "}
                    {sortBy === "date" && icon}
                    eller{" "}
                    <span
                        style={{ fontWeight: "bold" }}
                        className="click"
                        onClick={() => this.sortBy("votes")}
                    >
                        popularitet
                    </span>
                    {sortBy === "votes" && icon}
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
    feedback: PropTypes.array,
    getSpecificFeedback: PropTypes.func.isRequired
};
export default withRouter(FeedbackList);
