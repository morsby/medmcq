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
    column: null,
    direction: null,
    data: this.props.performance.answeredQuestions
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.performance.answeredQuestions !== this.props.performance.answeredQuestions) {
      this.setState({
        data: this.props.performance.answeredQuestions,
        filter: null,
        direction: null,
        column: null
      });
    }

    if (this.state.filter !== prevState.filter) {
      let { summary } = this.props.performance;
      if (this.state.filter) {
        this.setState({
          data: _.filter(this.props.performance.answeredQuestions, (q) => {
            return summary[this.state.filter].indexOf(q._id) !== -1;
          })
        });
        this.handleSort(this.state.column);
      } else {
        this.setState({ data: this.props.performance.answeredQuestions });
        this.handleSort(this.state.column);
      }
    }
  };

  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      switch (clickedColumn) {
        case 'percent':
          this.setState({
            column: clickedColumn,
            data: _.sortBy(data, (q) =>
              Math.round(
                (q.userAnswers.correct / (q.userAnswers.correct + q.userAnswers.wrong)) * 100,
                2
              )
            ),
            direction: 'ascending'
          });
          break;
        case 'specialty':
          this.setState({
            column: clickedColumn,
            data: _.sortBy(data, (q) => {
              return this.getSpecialties(q);
            }),
            direction: 'ascending'
          });
          break;
        default:
          this.setState({
            column: clickedColumn,
            data: _.sortBy(data, [clickedColumn]),
            direction: 'ascending'
          });
          break;
      }
      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    });
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

  handleFilter = (filter) => {
    this.setState({ filter });
  };

  gotoQuestion = (id) => {
    const settings = {
      type: 'specific',
      id: id
    };
    this.props.getQuestions(settings);
    this.props.history.push('/quiz');
  };

  getSpecialties = (q) => {
    let specialties = [];

    for (const spec of q.newSpecialties) {
      specialties.push(spec.specialty.text);
    }

    return specialties.join(', ');
  };

  render() {
    let { summary } = this.props.performance;
    const { column, direction, data } = this.state;
    let total = Object.keys(data).length;

    return (
      <div>
        <Divider hidden />
        {total > 0 && (
          <Button onClick={this.startQuiz}>
            <Translate id="profileAnswerDetails.start_quiz_button" data={{ n: total }} />
          </Button>
        )}
        <Divider hidden />
        <h4>
          <Translate id="profileAnswerDetails.filter.header" />
        </h4>
        <Button.Group widths="4">
          <Button basic color="blue" onClick={() => this.handleFilter(null)}>
            <Translate id="profileAnswerDetails.filter.show_all" />
          </Button>
          <Button basic positive onClick={() => this.handleFilter('allRight')}>
            <Translate id="profileAnswerDetails.filter.show_correct" />
          </Button>
          <Button basic negative onClick={() => this.handleFilter('allWrong')}>
            <Translate id="profileAnswerDetails.filter.show_wrong" />
          </Button>
          <Button basic color="yellow" onClick={() => this.handleFilter('mixed')}>
            <Translate id="profileAnswerDetails.filter.show_mixed" />
          </Button>
        </Button.Group>
        <Divider hidden />
        <div style={{ overflowX: 'auto' }}>
          <Table sortable unstackable celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'question' ? direction : null}
                  onClick={this.handleSort('question')}
                >
                  <Translate id="profileAnswerDetails.table_headers.question" />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'specialty' ? direction : null}
                  onClick={this.handleSort('specialty')}
                >
                  <Translate id="profileAnswerDetails.table_headers.specialty" />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'examYear' ? direction : null}
                  onClick={this.handleSort('examYear')}
                >
                  <Translate id="profileAnswerDetails.table_headers.set" />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'percent' ? direction : null}
                  onClick={this.handleSort('percent')}
                  textAlign="right"
                >
                  <Translate id="profileAnswerDetails.table_headers.performance" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(this.state.data, (q) => {
                return (
                  <Table.Row
                    style={{ cursor: 'pointer' }}
                    warning={summary.mixed.indexOf(q._id) !== -1}
                    positive={summary.allRight.indexOf(q._id) !== -1}
                    negative={summary.allWrong.indexOf(q._id) !== -1}
                    key={q._id}
                    verticalAlign="top"
                    onClick={() => this.gotoQuestion(q._id)}
                  >
                    <Table.Cell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: marked(q.question)
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>{this.getSpecialties(q)}</Table.Cell>
                    <Table.Cell collapsing>
                      {q.examSeason}
                      {q.examYear}
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="right">
                      {Math.round(
                        (q.userAnswers.correct / (q.userAnswers.correct + q.userAnswers.wrong)) *
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
  history: ReactRouterPropTypes.history
};

export default withRouter(
  connect(
    null,
    actions
  )(ProfileAnswerDetails)
);
