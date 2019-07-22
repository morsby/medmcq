import request from 'supertest';
import _ from 'lodash';
import { createQuestions, createUsers, cleanUp } from '../../../_testconfigs_/functions/creation';
let server;
let user;

describe('Question bookmarks', () => {
  beforeEach(async () => {
    server = require('../../../server');
    user = request.agent(server);

    await createUsers();
    await createQuestions();

    let res = await user.post('/api/auth').send({ username: 'user', password: '123abc' });
    expect(res.body.type).toMatch(/success/i);
  });

  afterEach(async () => {
    await cleanUp();
    server.close();
  });

  describe('create and delete bookmark', () => {
    it('should fail without a user provided', async () => {
      const res = await request(server).post('/api/questions/2/bookmark');

      expect(res.body.message).toMatch(/must be logged in/i);
      expect(res.body.type).not.toMatch(/success/i);
    });

    it('should fail if the bookmark already exists', async () => {
      const res = await user.post('/api/questions/1/bookmark');

      expect(res.body.type).toMatch(/already exists/i);
    });

    it('should post a bookmark if valid', async () => {
      const res = await user.post('/api/questions/2/bookmark');

      expect(res.body.type).toMatch(/success/i);
    });

    it('should delete a bookmark', async () => {
      const res = await user.delete('/api/questions/1/bookmark');

      expect(res.body.type).toMatch(/success/i);
    });
  });

  describe('fetch bookmarks', () => {
    it('should fetch bookmarks from /api/questions', async () => {
      const res = await user.get('/api/questions?n=5');

      res.body = _.sortBy(res.body, 'id');

      expect(res.body[0]).toMatchObject({ isBookmarked: { questionId: 1, userId: 2 } });
    });

    it('should fetch bookmarks from /api/questions/search', async () => {
      const res = await user.post('/api/questions/search').send({
        semester: 1,
        searchString: '"Hvilket af følgende udsagn om PSA"'
      });

      expect(res.body[0]).toMatchObject({ isBookmarked: { questionId: 1, userId: 2 } });
    });

    it('should fetch bookmarks from profile', async () => {
      const res = await user.get('/api/questions?profile=true');

      expect(res.body[0]).toMatchObject({ isBookmarked: { questionId: 1, userId: 2 } });
    });
  });
});
