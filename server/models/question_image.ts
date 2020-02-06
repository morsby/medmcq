import { Model } from 'objection';

interface QuestionImage {
  id: number;
  link: string;
  questionId: number;
}

class QuestionImage extends Model {
  static tableName = 'questionImage';
}

export default QuestionImage;
