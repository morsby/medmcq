import request from 'supertest';
import ExamSet from '../../models/exam_set';
import Question from '../../models/question';
import sampleQuestions from '../../_testconfigs_/data/sample_questions';
import sampleExamSets from '../../_testconfigs_/data/sample_exam_sets';
import { createSemesters, createUsers, cleanUp } from '../../_testconfigs_/functions/creation';
const examSetApi = '/api/exam_sets';
let server;
let admin;
let username = 'admin';
let password = '123abc';

describe('exam_sets route', () => {
  beforeEach(async () => {
    server = require('../../server');
    admin = request.agent(server);

    await createUsers();
    await createSemesters();
    await ExamSet.query().insertGraph(sampleExamSets);
    await Question.query().insertGraph(sampleQuestions);

    // Login admin
    const res = await admin.post('/api/auth').send({ username, password });
    const { type } = res.body;

    expect(type).toEqual('LoginSuccess');
  });

  afterEach(async () => {
    await cleanUp();
    server.close();
  });

  it("should get all 3 exam sets from GET '/'", async () => {
    let response = await request(server).get(examSetApi);
    let examSets = response.body;

    expect(examSets.length).toEqual(3);
    expect(examSets[0]).toHaveProperty('semester');
  });

  it("should fail because not authed at POST '/'", async () => {
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

  it("should post a new exam set to POST '/'", async () => {
    let { body } = await admin.post(examSetApi).send({
      semesterId: 2,
      season: 'F',
      year: 2018
    });

    expect(body.semesterId).toEqual(2);
    expect(body.year).toEqual(2018);
  });

  it("should fail with missing props at POST '/'", async () => {
    let { status, body } = await admin.post(examSetApi).send({
      season: 'F',
      year: 2099
    });

    expect(status).toEqual(400);
    expect(body.type).toEqual('ModelValidation');
  });

  it("should get one exam set from GET '/:id'", async () => {
    let { body } = await request(server).get(`${examSetApi}/1`);

    expect(body.semesterId).toEqual(1);
    expect(body).toHaveProperty('semester');
  });

  it("should patch a examSet at PATCH '/:id'", async () => {
    let { body } = await admin.patch(`${examSetApi}/1`).send({
      season: 'E'
    });
    expect(body.season).toEqual('E');
  });

  it("should fail because not authed at PATCH '/:id'", async () => {
    let { status, body } = await request(server)
      .patch(`${examSetApi}/1`)
      .send({
        season: 'E'
      });
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("should delete a examSet at DELETE '/:id'", async () => {
    let { body } = await admin.delete(`${examSetApi}/1`);
    expect(body.type).toEqual('deleteExamSet');
  });

  it("should delete a examSet at DELETE '/:id'", async () => {
    let { status, body } = await request(server).delete(`${examSetApi}/1`);
    expect(status).toEqual(403);
    expect(body.type).toEqual('NotAuthorized');
  });

  it("should get questions for the exam set at GET '/:id/questions'", async () => {
    let { body } = await request(server).get(`${examSetApi}/1/questions`);

    expect(body.length).toEqual(5);
    expect(body[0].examSetId).toEqual(1); // vi finder sæt m id = 1
    expect(body[0]).toHaveProperty('specialties');
    expect(body[0]).toHaveProperty('tags');
    expect(body[0]).toHaveProperty('publicComments');
  });
});
