import { Model } from 'objection';

interface Logger {
  method: string;
  url: string;
  query: string;
  body: string;
}

class Logger extends Model {
  static get tableName() {
    return 'logger';
  }
}

export default Logger;
