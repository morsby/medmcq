const graphQlBuilder = require("objection-graphql").builder;

// Objection.js models.
const ExamSet = require("./models/exam_set");
const QuestionComment = require("./models/question_comment");
const QuestionBookmark = require("./models/question_bookmark");
const QuestionUserAnswer = require("./models/question_user_answer");
const QuestionCorrectAnswer = require("./models/question_correct_answer");
const QuestionSpecialtyVoteSQL = require("./models/question_specialty_vote");
const QuestionTagVoteSQL = require("./models/question_tag_vote");
const Question = require("./models/question");
const Semester = require("./models/semester");
const Specialty = require("./models/specialty");
const Tag = require("./models/tag");
const User = require("./models/user");
const UserRole = require("./models/user_role");

// This is all you need to do to generate the schema.
const graphQlSchema = graphQlBuilder()
  .model(ExamSet)
  .model(QuestionComment)
  .model(QuestionBookmark)
  .model(QuestionUserAnswer)
  .model(QuestionCorrectAnswer)
  .model(QuestionSpecialtyVoteSQL)
  .model(QuestionTagVoteSQL)
  .model(Question)
  .model(Semester)
  .model(Specialty)
  .model(Tag)
  .model(User)
  .model(UserRole)
  .build();

module.exports = graphQlSchema;
