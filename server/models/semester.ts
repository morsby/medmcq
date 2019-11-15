import { Model } from 'objection';

interface Semester {
  id: number;
  value: number;
  name: string;
  shortName: string;
}

class Semester extends Model {
  static get tableName() {
    return 'semester';
  }
}

export default Semester;
