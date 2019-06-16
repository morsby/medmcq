import { DBErrors } from 'objection-db-errors';
const { Model } = require('objection');
const visibilityPlugin = require('objection-visibility').default;
export const hiddenCols = ['oldId', 'createdAt', 'updatedAt'];

/**
 * BaseModel is the base model all other models are based on.
 * It provides meaningful error messages and ability to hide columns in returned
 * json.
 *
 * It extends `DBErrors` from 'objection-db-errors' and `visibilityPlugin`
 * from 'objection-visibility'.
 * @extends DBErrors
 * @extends visibilityPlugin
 */
export default class BaseModel extends DBErrors(visibilityPlugin(Model)) {
  /**
   * columns to hide on output to JSON.
   * @type {Array}
   */
  static get hidden() {
    return hiddenCols;
  }
}

/**
 * A custom query builder that allows passing arguments to filters/modifiers.
 * @extends Objection.Model.QueryBuilder
 */
export class CustomQueryBuilder extends Model.QueryBuilder {
  /**
   * Merging arguments into context to use in eager expressions.
   * @param  {string} expr A RelationExpression to eager load.
   * @param  {object} args The filters to apply to the eager
   * @return {object}      The eager method(?)
   */
  eager(expr, args) {
    if (args) {
      this.mergeContext({ namedFilterArgs: args });
    }
    return super.eager(expr);
  }

  /**
   * Merging arguments into context to use in modify expressions.
   * @param  {string} expr A RelationExpression to modify.
   * @param  {object} args The filters to apply to the modify
   * @return {object}      The modify method(?)
   */
  modify(expr, args) {
    if (args) {
      this.mergeContext({ namedFilterArgs: args });
    }
    return super.modify(expr);
  }

  /**
   * Method to get the named filters in eager and modify expressions.
   * @param  {string} filterName The name of the filter
   * @return {object}            The filters
   */
  namedFilterArgs(filterName) {
    return (this.context().namedFilterArgs || {})[filterName];
  }
}

/**
 * A selection of modifiers used to filter relation queries.
 * @type {Object}
 */
export const modifiers = {
  /**
   * Small function to modify a query to only select those belonging to the user.
   * @param  {function} builder A QueryBuilder instance
   * @return {function}         A QueryBuilder instance
   */
  belongsToUser: (builder) => {
    const args = builder.namedFilterArgs('userId');
    return builder.where('userId', args);
  },

  /**
   * A function that joins active metadata properties (specialties or tags)
   * with their associated questions. Currently only used on the Question model.
   * @param  {function} builder A builder instance from Objection
   * @return {function}         A builder instance with the joins
   */
  filterOnMetadata: (builder) => {
    const type = builder.namedFilterArgs('type');
    const typeSingular = type === 'specialties' ? 'specialty' : 'tag';
    const ids = builder.namedFilterArgs('ids');
    let voteModel;
    if (type === 'specialties') {
      voteModel = require('./question_specialty_vote');
    } else if (type === 'tags') {
      voteModel = require('./question_tag_vote');
    }

    return builder
      .rightJoin(
        voteModel
          .query()
          .modify('active')
          .as(type),
        'Question.id',
        `${type}.questionId`
      )
      .select('Question.*')
      .groupBy('question.id')
      .whereIn(`${type}.${typeSingular}_id`, ids);
  },
  /**
   * A function that filters metadata votes to only the active ones
   * (i.e. having a sum of 0r or more).
   * Is used on SpecialtyVote and TagVote models.
   * @param  {[type]} builder [A builder instance from Objection]
   * @return {[type]}         [A builder instance containing only the active metadata]
   */
  activeMetadata: (builder) => {
    let model = builder._modelClass;
    let tableName = model.name;
    let type = tableName.toLowerCase().includes('specialty') ? 'specialty' : 'tag';

    return builder
      .select(`${type}Id`, 'questionId')
      .sum('value as votes')
      .having('votes', '>', '-1')
      .groupBy(`${type}Id`, 'questionId');
  }
};
