import { Model } from 'objection';

interface QuestionImage {
  id: number;
  link: string;
  question_id: number;
}

class QuestionImage extends Model {
  static tableName = 'questionImage';
}

export default QuestionImage;
