import BaseModel from './_base_model';

class manualCompletedSet extends BaseModel {
  static get tableName() {
    return 'manualCompletedSets';
  }
}

export default manualCompletedSet;
