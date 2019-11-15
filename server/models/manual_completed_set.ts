import { Model } from 'objection';

class manualCompletedSet extends Model {
  static get tableName() {
    return 'manualCompletedSets';
  }
}

export default manualCompletedSet;
