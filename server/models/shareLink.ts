import { Model } from 'objection';

interface ShareLink {
  link: string;
  question_id: number;
  published: boolean;
  shareId: number;
  questionId: number;
}

class ShareLink extends Model {
  static get tableName() {
    return 'share_links';
  }
}

export default ShareLink;
