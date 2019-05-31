import request from 'supertest';
import server from '../../server';
const examSetApi = '/api/exam_sets';
const agent = request.agent(server);
afterEach(() => {
  server.close();
});

describe('exam_sets route', () => {
  // Settings vars so they can be reused across tests
  let firstExamSetId, newExamSetId, semesterId;

  test("GET '/' -- should get all 3 exam sets", async () => {
    let response = await request(server).get(examSetApi);
    let examSets = response.body;

    // To reuse the id without making a second API call -- id can change if rerunning seeds
    firstExamSetId = examSets[0].id;
    semesterId = examSets[0].semesterId;

    expect(examSets.length).toEqual(4);
    expect(examSets[0]).toHaveProperty('semester');
  });

  test("POST '/' -- should fail because not authed", async () => {
    let { body, status } = await request(server)
      .post(examSetApi)
      .send({
        semesterId,
        season: 'F',
        year: 2018
      });
    newExamSetId = body.id;
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("POST '/' -- should post a new exam set", async () => {
    await agent
      .post('/api/auth')
      .send({ username: 'TestAdmin', password: 'TestPassword123' });

    let { body } = await agent.post(examSetApi).send({
      semesterId,
      season: 'F',
      year: 2018
    });
    newExamSetId = body.id;
    expect(body.semesterId).toEqual(semesterId);
    expect(body.year).toEqual(2018);
  });

  test("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await agent.post(examSetApi).send({
      season: 'F',
      year: 2099
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  test("GET '/:id' -- should get one exam set", async () => {
    let { body } = await request(server).get(`${examSetApi}/${firstExamSetId}`);

    expect(body.semesterId).toEqual(semesterId);
    expect(body).toHaveProperty('semester');
  });

  test("PATCH '/:id' -- should patch a examSet", async () => {
    let { body } = await agent.patch(`${examSetApi}/${newExamSetId}`).send({
      season: 'E'
    });
    expect(body.season).toEqual('E');
  });

  test("PATCH '/:id' -- should fail because not authed", async () => {
    let { status, body } = await request(server)
      .patch(`${examSetApi}/${newExamSetId}`)
      .send({
        season: 'E'
      });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("DELETE '/:id' -- should delete a examSet", async () => {
    let { body } = await agent.delete(`${examSetApi}/${newExamSetId}`);
    expect(body.type).toEqual('deleteExamSet');
  });

  test("DELETE '/:id' -- should delete a examSet", async () => {
    let { status, body } = await request(server).delete(
      `${examSetApi}/${newExamSetId}`
    );
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("GET '/:id/questions' -- should get questions for the exam set", async () => {
    let { body } = await request(server).get(`${examSetApi}/4/questions`);

    expect(body.length).toEqual(2);
    expect(body[0].examSetId).toEqual(4); // vi finder sæt m id = 4
    expect(body[0]).toHaveProperty('specialties');
    expect(body[0]).toHaveProperty('tags');
    expect(body[0]).toHaveProperty('publicComments');
  });
});
