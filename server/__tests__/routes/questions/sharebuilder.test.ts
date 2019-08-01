import request from 'supertest';
import ShareLink from '../../../models/shareLink';
import { createQuestions, cleanUp, createUsers } from '../../../_testconfigs_/functions/creation';
let server;

const shareId = 1234567890;
const questionId = 1;

describe('sharebuilder', () => {
  beforeEach(async () => {
    server = require('../../../server');
    await createUsers();
    await createQuestions();

    await ShareLink.query().insert({
      shareId,
      questionId
    });
  });

  afterEach(async () => {
    await ShareLink.query().delete();
    await cleanUp();
    server.close();
  });

  it('should create a share', async () => {
    const result = await request(server)
      .post('/graphql')
      .send({
        query: `
            mutation {
               createShareLink(questionIds: "${[questionId]}")
            }
        `
      })
      .expect(200);

    expect(result.error.text).toBeUndefined();
    expect(result.body.error).toBeUndefined();
    expect(result.body.data.createShareLink).not.toBeNull();
  });

  it('should fetch a share', async () => {
    const result = await request(server)
      .post('/graphql')
      .send({
        query: `
          query {
              shareLink(shareId: "${shareId}")
          }
        `
      })
      .expect(200);

    expect(result.body.data.shareLink[0]).toMatch(questionId.toString());
  });

  it('should return an empty array if ID is incorect', async () => {
    const result = await request(server)
      .post('/graphql')
      .send({
        query: `
        query {
            shareLink(shareId: "123")
        }
      `
      })
      .expect(200);

    expect(result.body.data.shareLink).toHaveLength(0);
  });
});
