const request = require('supertest');
const server = require('../../server');
const semesterApi = '/api/semesters';

afterEach(() => {
  server.close();
});

// For at gemme sessions
const user = request.agent(server);
const admin = request.agent(server);

describe('semesters route', () => {
  // Settings vars to reuse across tests
  let firstSemesterId, newSemesterId;

  test("GET '/' -- should get all 4 semesters in the right order", async () => {
    let response = await request(server).get(semesterApi);
    let semesters = response.body;

    // To reuse the id without making a second API call -- id can change if rerunning seeds
    firstSemesterId = semesters[0].id;

    expect(semesters.map(sem => sem.name)).toEqual([
      'Inflammation',
      'Abdomen',
      'Hjerte-lunge-kar',
      'Familie-samfund / GOP'
    ]);
  });

  test("POST '/' -- should fail because user not permitted", async () => {
    await user
      .post('/api/auth')
      .send({ username: 'TestBruger', password: 'TestPassword123' });

    let { status, body } = await user.post(semesterApi).send({
      value: 12,
      name: 'Test',
      shortName: 'Testing2'
    });
    newSemesterId = body.id;
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("POST '/' -- should insert a new semester", async () => {
    await admin
      .post('/api/auth')
      .send({ username: 'TestAdmin', password: 'TestPassword123' });

    let { body } = await admin.post(semesterApi).send({
      value: 12,
      name: 'Test',
      shortName: 'Testing2'
    });
    newSemesterId = body.id;
    expect(body.value).toEqual(12);
    expect(body.name).toEqual('Test');
  });

  test("POST '/' -- should fail with missing props", async () => {
    let { status, body } = await admin.post(semesterApi).send({
      name: 'Should fail'
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  test("GET '/:id' -- should get one semester", async () => {
    let { body } = await request(server).get(
      `${semesterApi}/${firstSemesterId}`
    );

    expect(body.value).toEqual(7);
    expect(body.name).toEqual('Inflammation');
    expect(body.shortName).toEqual('Inf');
    expect(body).toHaveProperty('questionCount');
    expect(body).toHaveProperty('examSets');
    expect(body).toHaveProperty('specialties');
    expect(body).toHaveProperty('tags');
  });

  test("PATCH '/:id' -- should fail as user", async () => {
    let { status, body } = await user
      .patch(`${semesterApi}/${newSemesterId}`)
      .send({
        name: 'NewName'
      });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("PATCH '/:id' -- should patch a semester as admin", async () => {
    let { body } = await admin.patch(`${semesterApi}/${newSemesterId}`).send({
      name: 'NewName'
    });
    expect(body.name).toEqual('NewName');
  });

  test("DELETE '/:id' -- should fail as user", async () => {
    let { status, body } = await user.delete(`${semesterApi}/${newSemesterId}`);
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("DELETE '/:id' -- should delete a semester as admin", async () => {
    let { body } = await admin.delete(`${semesterApi}/${newSemesterId}`);
    expect(body.type).toEqual('deleteSemester');
  });
});
