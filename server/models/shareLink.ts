import { Model } from 'objection';

interface ShareLink {
  link: string;
  questionId: number;
  userId: number;
  published: boolean;
  shareId: string;
}

class ShareLink extends Model {
  static get tableName() {
    return 'share_links';
  }
}

export default ShareLink;
