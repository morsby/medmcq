import BaseModel from './_base_model';

interface Logger {
  method: string;
  url: string;
  query: string;
  body: string;
}

class Logger extends BaseModel {
  static get tableName() {
    return 'logger';
  }
}

export default Logger;
