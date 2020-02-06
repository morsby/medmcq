import { Model } from 'objection';

interface UserRole {
  id: number;
  name: string;
  level: number;
}

class UserRole extends Model {
  static get tableName() {
    return 'userRole';
  }
}

export default UserRole;
