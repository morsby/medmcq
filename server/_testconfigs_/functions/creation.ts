import UserRole from '../../models/user_role';
import User from '../../models/user';
import Semester from '../../models/semester';
import ExamSet from '../../models/exam_set';
import Question from '../../models/question';
import QuestionComment from '../../models/question_comment';
import Tag from '../../models/tag';
import QuestionTagVote from '../../models/question_tag_vote';
import Specialty from '../../models/specialty';
import QuestionSpecialtyVote from '../../models/question_specialty_vote';
import QuestionCorrectAnswer from '../../models/question_correct_answer';
import QuestionBookmark from '../../models/question_bookmark';
import sampleQuestions from '../data/sample_questions';
import sampleExamSets from '../data/sample_exam_sets';
import sample_tags from '../data/sample_tags';
import sample_tag_votes from '../data/sample_tag_votes';
import sample_specialties from '../data/sample_specialties';
import sample_specialty_votes from '../data/sample_specialty_votes';

export const createUsers = async () => {
  // Create users
  await UserRole.query().insertGraph([
    {
      id: 2,
      name: 'admin',
      level: 100
    },
    {
      id: 4,
      name: 'user',
      level: 1
    }
  ]);
  await User.query().insertGraph([
    {
      id: 1,
      username: 'admin',
      password: '123abc',
      roleId: 2
    },
    {
      id: 2,
      username: 'user',
      password: '123abc',
      roleId: 4
    }
  ]);
};

export const createSemesters = async () => {
  await Semester.query().insertGraph([
    { id: 1, value: 7, name: 'Inflammation', shortName: 'Inf' },
    { id: 2, value: 8, name: 'Abdomen', shortName: 'Abd' },
    { id: 3, value: 9, name: 'Hjerte-lunge-kar', shortName: 'HLK' },
    { id: 4, value: 11, name: 'Familie-samfund / GOP', shortName: 'GOP' }
  ]);
};

export const createQuestions = async () => {
  await createSemesters();
  await ExamSet.query().insertGraph(sampleExamSets);
  await Question.query().insertGraph(sampleQuestions);
  await QuestionComment.query().insert({
    id: 1,
    userId: 1,
    questionId: 1,
    text: 'comment text',
    private: false
  });
  await QuestionCorrectAnswer.query().insert({
    id: 1,
    answer: 1,
    questionId: 1
  });
  await QuestionBookmark.query().insert({
    id: 1,
    userId: 1,
    questionId: 1
  });

  await createTags();
  await createSpecialties();
};

export const createTags = async () => {
  await Tag.query().insertGraph(sample_tags);
  await QuestionTagVote.query().insertGraph(sample_tag_votes);
};

export const createSpecialties = async () => {
  await Specialty.query().insertGraph(sample_specialties);
  await QuestionSpecialtyVote.query().insertGraph(sample_specialty_votes);
};

export const cleanUp = async () => {
  await ExamSet.query().delete();
  await Question.query().delete();
  await QuestionComment.query().delete();
  await User.query().delete();
  await UserRole.query().delete();
  await Tag.query().delete();
  await QuestionTagVote.query().delete();
  await Specialty.query().delete();
  await QuestionCorrectAnswer.query().delete();
  await QuestionBookmark.query().delete();
  await Semester.query().delete();
};
