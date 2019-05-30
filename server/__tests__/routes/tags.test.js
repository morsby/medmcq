import _ from 'lodash';
const request = require('supertest');
const server = require('../../server');
const tagApi = `/api/tags`;

const agent = request.agent(server);

afterEach(() => {
  server.close();
});

describe('tags route', () => {
  // Settings vars to reuse across tests
  let firstTagId, newTagId;

  test("GET '/' -- should get all tags", async () => {
    let response = await request(server).get(tagApi);
    let tags = response.body;

    // To reuse the id without making a second API call -- id can change if rerunning seeds
    firstTagId = tags[0].id;
    let sortedTags = _.sortBy(tags, ['name']);
    let seededTags = require('../../seeds/data/13_sample_tags.json');
    seededTags = seededTags.map(s => s.name).sort();

    expect(sortedTags.map(sem => sem.name)).toEqual(seededTags);
  });

  test("POST '/' -- should fail non-admin", async () => {
    let { status, body } = await request(server)
      .post(tagApi)
      .send({
        name: 'Test',
        semesterId: 4
      });

    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("POST '/' -- should insert a new tag", async () => {
    await agent
      .post('/api/auth')
      .send({ username: 'TestAdmin', password: 'TestPassword123' });

    let { body } = await agent.post(tagApi).send({
      name: 'Test',
      semesterId: 4
    });
    newTagId = body.id;
    expect(body.semesterId).toEqual(4);
    expect(body.name).toEqual('Test');
  });

  test("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await agent.post(tagApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  test("GET '/:id' -- should get one tag", async () => {
    let { body } = await request(server).get(`${tagApi}/${firstTagId}`);

    expect(body.name).toEqual('Paraklinik');
    expect(body.semesterId).toEqual(1);
    expect(body).toHaveProperty('semester');
    expect(body).toHaveProperty('voteCount');
    expect(Array.isArray(body.questions)).toBe(true);
  });

  test("PATCH '/:id' -- should fail non-admin", async () => {
    let { status, body } = await request(server)
      .patch(`${tagApi}/${newTagId}`)
      .send({
        name: 'NewName'
      });
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("PATCH '/:id' -- should patch a tag", async () => {
    let { body } = await agent.patch(`${tagApi}/${newTagId}`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  test("DELETE '/:id' -- should fail non-admin", async () => {
    let { status, body } = await request(server).delete(
      `${tagApi}/${newTagId}`
    );
    expect(body.type).toEqual('NotAuthorized');
    expect(status).toEqual(403);
  });

  test("DELETE '/:id' -- should delete a tag", async () => {
    let { body } = await agent.delete(`${tagApi}/${newTagId}`);
    expect(body.type).toEqual('deleteTag');
  });
});
