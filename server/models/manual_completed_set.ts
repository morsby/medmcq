import { Model } from 'objection';

interface ManualCompletedSet {
  id: number;
  examSetId: number;
  userId: number;
}

class ManualCompletedSet extends Model {
  static get tableName() {
    return 'manualCompletedSets';
  }
}

export default ManualCompletedSet;
