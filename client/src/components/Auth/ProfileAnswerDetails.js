import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../actions';
import _ from 'lodash';
import marked from 'marked';

import { Table, Button, Divider } from 'semantic-ui-react';

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
                        Start en quiz med {total > 1 ? 'alle' : ''} nedenstående{' '}
                        {total} spørgsmål
                    </Button>
                )}
                <Divider hidden />
                <h4>Filtrer spørgsmål:</h4>
                <Button.Group widths="4">
                    <Button
                        basic
                        color="blue"
                        onClick={() => this.handleFilter(null)}
                    >
                        Vis alle
                    </Button>
                    <Button
                        basic
                        positive
                        onClick={() => this.handleFilter('allRight')}
                    >
                        Vis altid rigtige
                    </Button>
                    <Button
                        basic
                        negative
                        onClick={() => this.handleFilter('allWrong')}
                    >
                        Vis altid forkerte
                    </Button>
                    <Button
                        basic
                        color="yellow"
                        onClick={() => this.handleFilter('mixed')}
                    >
                        Vis blandede
                    </Button>
                </Button.Group>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Spørgsmål</Table.HeaderCell>
                            <Table.HeaderCell>Speciale</Table.HeaderCell>
                            <Table.HeaderCell>Sæt</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">
                                Din svarprocent
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
                                        {q.specialty.join()}
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        {q.examSeason}
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

export default withRouter(
    connect(
        null,
        actions
    )(ProfileAnswerDetails)
);
