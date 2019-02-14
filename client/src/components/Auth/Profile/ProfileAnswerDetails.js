import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../../actions';
import _ from 'lodash';
import marked from 'marked';

import { Table, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

/**
 * Component der viser detaljer omkring ens svar. Kaldes af ./Profile.js
 */
class ProfileAnswerDetails extends Component {
    state = {
        filter: null,
    };

    startQuiz = () => {
        let ids;
        let { summary } = this.props.performance;
        if (!this.state.filter) {
            ids = [...summary.allRight, ...summary.allWrong, ...summary.mixed];
        } else {
            ids = summary[this.state.filter];
        }

        this.props.getQuestions({ type: 'ids' }, ids);
        this.props.history.push('/quiz');
    };

    handleFilter = filter => {
        this.setState({ filter });
    };

    render() {
        let { answeredQuestions, summary } = this.props.performance;
        if (this.state.filter) {
            answeredQuestions = _.filter(answeredQuestions, q => {
                return summary[this.state.filter].indexOf(q._id) !== -1;
            });
        }
        let total = Object.keys(answeredQuestions).length;
        // TODO: Tillad sortering

        return (
            <div>
                <Divider hidden />
                {total > 0 && (
                    <Button onClick={this.startQuiz}>
                        <Translate
                            id="profileAnswerDetails.start_quiz_button"
                            data={{ n: total }}
                        />
                    </Button>
                )}
                <Divider hidden />
                <h4>
                    <Translate id="profileAnswerDetails.filter.header" />
                </h4>
                <Button.Group widths="4">
                    <Button
                        basic
                        color="blue"
                        onClick={() => this.handleFilter(null)}
                    >
                        <Translate id="profileAnswerDetails.filter.show_all" />
                    </Button>
                    <Button
                        basic
                        positive
                        onClick={() => this.handleFilter('allRight')}
                    >
                        <Translate id="profileAnswerDetails.filter.show_correct" />
                    </Button>
                    <Button
                        basic
                        negative
                        onClick={() => this.handleFilter('allWrong')}
                    >
                        <Translate id="profileAnswerDetails.filter.show_wrong" />
                    </Button>
                    <Button
                        basic
                        color="yellow"
                        onClick={() => this.handleFilter('mixed')}
                    >
                        <Translate id="profileAnswerDetails.filter.show_mixed" />
                    </Button>
                </Button.Group>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Translate id="profileAnswerDetails.table_headers.question" />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Translate id="profileAnswerDetails.table_headers.specialty" />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Translate id="profileAnswerDetails.table_headers.set" />
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">
                                <Translate id="profileAnswerDetails.table_headers.performance" />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {_.map(answeredQuestions, q => {
                            return (
                                <Table.Row
                                    warning={
                                        summary.mixed.indexOf(q._id) !== -1
                                    }
                                    positive={
                                        summary.allRight.indexOf(q._id) !== -1
                                    }
                                    negative={
                                        summary.allWrong.indexOf(q._id) !== -1
                                    }
                                    key={q._id}
                                    verticalAlign="top"
                                >
                                    <Table.Cell>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: marked(q.question),
                                            }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        {q.specialty.join(', ')}
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        <Translate
                                            id={`profileAnswerDetails.${
                                                q.examSeason
                                            }`}
                                        />
                                        {q.examYear}
                                    </Table.Cell>
                                    <Table.Cell collapsing textAlign="right">
                                        {Math.round(
                                            (q.userAnswers.correct /
                                                (q.userAnswers.correct +
                                                    q.userAnswers.wrong)) *
                                                100,
                                            2
                                        )}
                                        %
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

ProfileAnswerDetails.propTypes = {
    /**
     * Object indeholdende hvordan brugeren har klaret sig
     */
    performance: PropTypes.object,

    /**
     * currentLanguage (passet fra ./Profile.js, bruges til at ændre sæt til engelsk)
     */
    currentLanguage: PropTypes.string,

    /**
     * Func der starter quiz med de valgte spørgsmål
     */
    getQuestions: PropTypes.func,

    /**
     * Fra react router
     */
    history: ReactRouterPropTypes.history,
};

export default withRouter(
    connect(
        null,
        actions
    )(ProfileAnswerDetails)
);
