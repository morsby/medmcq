import BaseModel from './_base_model';

interface ShareLink {
  link: string;
  question_id: number;
  published: boolean;
  shareId: number;
  questionId: number;
}

class ShareLink extends BaseModel {
  static get tableName() {
    return 'share_links';
  }
}

export default ShareLink;
