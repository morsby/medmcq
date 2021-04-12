import { Model } from 'objection';

interface Notification {
  id: number;
  message: string;
  semesterId: number;
  userId: number;
  isRead: 1 | 0;
  createdAt: Date;
  updatedAt: Date;
}

class Notification extends Model {
  static tableName = 'notifications';

  $beforeInsert() {
    this.createdAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export default Notification;
