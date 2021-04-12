import { Model } from "objection";


interface Log {
    id: number;
    name: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

class Log extends Model {
    static tableName = 'logs'

  $beforeInsert() {
    this.createdAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export default Log