import { Model } from 'objection';

interface Specialty {
  id: number;
  name: string;
  semesterId: number;
}

class Specialty extends Model {
  static get tableName() {
    return 'questionSpecialty';
  }
}

export default Specialty;
