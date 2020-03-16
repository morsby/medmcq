import { Model } from 'objection';

interface ShareLink {
  link: string;
  questionId: number;
  userId: number;
  published: boolean;
  shareId: number;
}

class ShareLink extends Model {
  static get tableName() {
    return 'share_links';
  }
}

export default ShareLink;
