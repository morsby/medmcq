import _ from 'lodash';
import request from 'supertest';
const tagApi = '/api/tags';
let server;
let agent;

describe('tags route', () => {
  beforeEach(() => {
    server = require('../../server');
    agent = request.agent(server);
  });

  afterEach(() => {
    server.close();
  });

  // Settings vars to reuse across tests
  let firstTagId, newTagId;

  it("GET '/' -- should get all tags", async () => {
    let response = await request(server).get(tagApi);
    let tags = response.body;

    // To reuse the id without making a second API call -- id can change if rerunning seeds
    firstTagId = tags[0].id;
    let sortedTags = _.sortBy(tags, ['name']);
    let seededTags = require('../../seeds/data/13_sample_tags.json');
    seededTags = seededTags.map((s) => s.name).sort();

    expect(sortedTags.map((sem) => sem.name)).toEqual(seededTags);
  });

  it("POST '/' -- should fail non-admin", async () => {
    let { status, body } = await request(server)
      .post(tagApi)
      .send({
        name: 'Test',
        semesterId: 4
      });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("POST '/' -- should insert a new tag", async () => {
    await agent.post('/api/auth').send({ username: 'TestAdmin', password: 'TestPassword123' });

    let { body } = await agent.post(tagApi).send({
      name: 'Test',
      semesterId: 4
    });
    newTagId = body.id;
    expect(body.semesterId).toEqual(4);
    expect(body.name).toEqual('Test');
  });

  it("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await agent.post(tagApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  it("GET '/:id' -- should get one tag", async () => {
    let { body } = await request(server).get(`${tagApi}/${firstTagId}`);

    expect(body.name).toEqual('Paraklinik');
    expect(body.semesterId).toEqual(1);
    expect(body).toHaveProperty('semester');
    expect(body).toHaveProperty('voteCount');
    expect(Array.isArray(body.questions)).toBe(true);
  });

  it("PATCH '/:id' -- should fail non-admin", async () => {
    let { status, body } = await request(server)
      .patch(`${tagApi}/${newTagId}`)
      .send({
        name: 'NewName'
      });
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("PATCH '/:id' -- should patch a tag", async () => {
    let { body } = await agent.patch(`${tagApi}/${newTagId}`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  it("DELETE '/:id' -- should fail non-admin", async () => {
    let { status, body } = await request(server).delete(`${tagApi}/${newTagId}`);
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  it("DELETE '/:id' -- should delete a tag", async () => {
    let { body } = await agent.delete(`${tagApi}/${newTagId}`);
    expect(body.type).toEqual('deleteTag');
  });
});
