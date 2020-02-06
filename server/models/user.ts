import { Model } from 'objection';
import bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  password: string;
  roleId: number;
  email?: string;
  resetPasswordExpires?: Date;
  resetPasswordToken?: string;
}

class User extends Model {
  static get tableName() {
    return 'user';
  }

  $beforeInsert = async () => {
    this.password = await bcrypt.hash(this.password, 10);
  };

  $beforeUpdate = async () => {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  };

  verifyPassword = (password: string) => {
    return bcrypt.compare(password, this.password);
  };
}

module.exports = User;
export default User;
