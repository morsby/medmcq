import request from 'supertest';
import ExamSet from '../../models/exam_set';
import Semester from '../../models/semester';
import User from '../../models/user';
import UserRole from './../../models/user_role';
import Question from '../../models/question';
import sampleQuestions from './data/20_sample_questions';
const examSetApi = '/api/exam_sets';
let server;
let agent;
let username = 'abc';
let password = '123abc';

describe('exam_sets route', () => {
  beforeEach(async () => {
    server = require('../../server');
    agent = request.agent(server);

    await UserRole.query().insert({
      id: 2,
      name: 'admin',
      level: 100
    });
    await User.query().insert({
      username,
      password,
      roleId: 2
    });
    await Semester.query().insert({
      id: 2,
      value: 8,
      name: 'Abdomen',
      shortName: 'Abd'
    });
    await ExamSet.query().insertGraph([
      { id: 1, year: 2018, season: 'E', semesterId: 2 },
      { id: 2, year: 2018, season: 'F', semesterId: 2 },
      { id: 3, year: 2018, season: 'F', semesterId: 2 }
    ]);
    await Question.query().insertGraph(sampleQuestions);

    const res = await agent.post('/api/auth').send({ username, password });
    const { type } = res.body;

    expect(type).toEqual('LoginSuccess');
  });

  afterEach(async () => {
    await UserRole.query().delete();
    await User.query().delete();
    await ExamSet.query().delete();
    await Semester.query().delete();
    await Question.query().delete();
    server.close();
  });

  // Settings vars so they can be reused across tests

  test("GET '/' -- should get all 3 exam sets", async () => {
    let response = await request(server).get(examSetApi);
    let examSets = response.body;

    expect(examSets.length).toEqual(3);
    expect(examSets[0]).toHaveProperty('semester');
  });

  test("POST '/' -- should fail because not authed", async () => {
    let { body, status } = await request(server)
      .post(examSetApi)
      .send({
        semesterId: 2,
        season: 'F',
        year: 2018
      });

    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("POST '/' -- should post a new exam set", async () => {
    await agent.post('/api/auth').send({ username, password });

    let { body } = await agent.post(examSetApi).send({
      semesterId: 2,
      season: 'F',
      year: 2018
    });

    expect(body.semesterId).toEqual(2);
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
    let { body } = await request(server).get(`${examSetApi}/1`);

    expect(body.semesterId).toEqual(2);
    expect(body).toHaveProperty('semester');
  });

  test("PATCH '/:id' -- should patch a examSet", async () => {
    let { body } = await agent.patch(`${examSetApi}/1`).send({
      season: 'E'
    });
    expect(body.season).toEqual('E');
  });

  test("PATCH '/:id' -- should fail because not authed", async () => {
    let { status, body } = await request(server)
      .patch(`${examSetApi}/1`)
      .send({
        season: 'E'
      });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("DELETE '/:id' -- should delete a examSet", async () => {
    let { body } = await agent.delete(`${examSetApi}/1`);
    expect(body.type).toEqual('deleteExamSet');
  });

  test("DELETE '/:id' -- should delete a examSet", async () => {
    let { status, body } = await request(server).delete(`${examSetApi}/1`);
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  test("GET '/:id/questions' -- should get questions for the exam set", async () => {
    let { body } = await request(server).get(`${examSetApi}/1/questions`);

    expect(body.length).toEqual(5);
    expect(body[0].examSetId).toEqual(1); // vi finder sæt m id = 1
    expect(body[0]).toHaveProperty('specialties');
    expect(body[0]).toHaveProperty('tags');
    expect(body[0]).toHaveProperty('publicComments');
  });
});
