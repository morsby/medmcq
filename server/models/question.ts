import { Model } from 'objection';

interface Question {
  id: number;
  oldId: string;
  text: string;
  image: string;
  answer1: string;
  answer2: string;
  answer3: string;
  userId: number;
  examSetQno: number;
  examSetId: number;
  createdAt: Date;
  updatedAt: Date;
}

class Question extends Model {
  static tableName = 'question';
}

export default Question;
