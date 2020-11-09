import express from 'express';
import _ from 'lodash';
import ExamSet from 'models/exam_set';
import Question from 'models/question';
import QuestionAnswer from 'models/questionAnswer.model';
import QuestionImage from 'models/question_image';
import User from 'models/user';
const router = express.Router();

router.post('/create', async (req: any, res) => {
    let user = req.user as User;
    if (!user) return res.send('Not permitted');
    user = await User.query().findById(user.id);
    if (user.roleId > 2) return res.send('Not permitted');
    
    const data = req.body
    const { year, season, semesterId, questions } = data;
    const examSet = await ExamSet.query().insertAndFetch({
      year,
      season,
      semesterId
    });

    for (let question of questions) {
      const { text, images, answer1, answer2, answer3, correctAnswers, examSetQno } = question;
      const checkCorrect = (index: number) => {
        if (correctAnswers.some(item => item.answer == index)) return 1;
        return 0;
      }

      const newQuestion = await Question.query().insertAndFetch({
        text,
        examSetQno,
        examSetId: examSet.id
      });

      for (let image of images) {
        await QuestionImage.query().insert({
          link: image,
          questionId: newQuestion.id
        });
      }

      await QuestionAnswer.query().insert({ text: answer1, index: 1, questionId: newQuestion.id, isCorrect: checkCorrect(1) })
      await QuestionAnswer.query().insert({ text: answer2, index: 2, questionId: newQuestion.id, isCorrect: checkCorrect(2) })
      await QuestionAnswer.query().insert({ text: answer3, index: 3, questionId: newQuestion.id, isCorrect: checkCorrect(3) })
    }

    res.send('Successfully created examSet with ID ' + examSet.id)
});

export default router;
