import React, { useState } from 'react';
import { ReduxState } from 'redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Form, Divider, Dropdown, Button } from 'semantic-ui-react';
import TextArea from 'antd/lib/input/TextArea';
import { useFormik } from 'formik';
import { QuestionInput } from 'types/generated';
import QuestionImage from './QuestionImage';
import { imageURL } from 'utils/common';
import Semester from 'classes/Semester';
import Question from 'classes/Question';
import Axios from 'axios';
import questionsReducer from 'redux/reducers/question';

export interface QuestionEditorProps {}

const QuestionEditor: React.SFC<QuestionEditorProps> = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentQuestionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const question = useSelector(
    (state: ReduxState) => state.questions.questions[currentQuestionIndex]
  );
  const [images, setImages] = useState(null);
  const formik = useFormik({
    initialValues: {
      id: question.id,
      text: question.text,
      answer1: question.answer1.answer,
      answer2: question.answer2.answer,
      answer3: question.answer3.answer,
      correctAnswers: question.correctAnswers,
      examSetId: question.examSet.id,
    },
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  });

  const handleSubmit = async (values: Partial<QuestionInput>) => {
    setIsSubmitting(true);
    try {
      if (!!images) {
        const formData = new FormData();
        for (let image of images) {
          formData.append('images', image);
        }
        const res = await Axios.post('/images/upload', formData, {
          headers: { 'content-type': 'multipart/form-data' },
        });
        await Question.update({ ...values, images: res.data });
      } else {
        await Question.update(values);
      }
      await Semester.fetchAll();
      formik.resetForm();
      setImages(null);
      setIsSubmitting(false);
      setError('');
      dispatch(questionsReducer.actions.toggleEditing());
    } catch (error) {
      console.log('error: ', error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Field>
          <label>Tekst</label>
          <TextArea
            autoSize={{ minRows: 4 }}
            name="text"
            onChange={formik.handleChange}
            value={formik.values.text}
          />
        </Form.Field>
        <Form.Input
          label="Svar 1"
          name="answer1"
          onChange={formik.handleChange}
          value={formik.values.answer1}
        />
        <Form.Input
          label="Svar 2"
          name="answer2"
          onChange={formik.handleChange}
          value={formik.values.answer2}
        />
        <Form.Input
          label="Svar 3"
          name="answer3"
          onChange={formik.handleChange}
          value={formik.values.answer3}
        />
        <Form.Input
          type="file"
          multiple
          name="images"
          onChange={(e) => setImages(e.target.files)}
        />
        {question.images.map((image) => (
          <Grid columns="equal" celled>
            <Grid.Row>
              <Grid.Column>
                <QuestionImage key={image} img={imageURL(image)} />
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Button basic color="red">
                  Slet billede (ikke implementeret)
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ))}
        <Form.Field>
          <label>Korrekte svar</label>
          <Dropdown
            placeholder="Korrekte svar"
            name="correctAnswers"
            selection
            multiple
            value={formik.values.correctAnswers}
            options={[
              { text: 1, value: 1, key: 1 },
              { text: 2, value: 2, key: 2 },
              { text: 3, value: 3, key: 3 },
            ]}
            onChange={(e, { value }) => formik.setFieldValue('correctAnswers', value)}
          />
        </Form.Field>
        <Divider />
        <Form.Button
          loading={isSubmitting}
          type="submit"
          fluid
          disabled={isSubmitting}
          basic
          style={{ cursor: 'pointer' }}
          color="orange"
        >
          Rediger
        </Form.Button>
      </Form>
      <Divider />
      <Button basic color="red" fluid>
        Slet spørgsmål (ikke implementeret)
      </Button>
    </div>
  );
};

export default QuestionEditor;
