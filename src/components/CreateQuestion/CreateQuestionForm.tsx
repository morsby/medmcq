import React, { useState, useEffect } from 'react';
import { Segment, Form, Dropdown, Container, Divider, Message } from 'semantic-ui-react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import TextArea from 'antd/lib/input/TextArea';
import Question from 'classes/Question';
import Semester from 'classes/Semester';
import axios from 'axios';
import { QuestionInput } from 'types/generated';
import questionsReducer from 'redux/reducers/question';

export interface CreateQuestionFormProps {
  question?: Question;
}

const CreateQuestionForm: React.SFC<CreateQuestionFormProps> = ({ question }) => {
  const [error, setError] = useState('');
  const [semesterId, setSemesterId] = useState(5);
  const [images, setImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const semesters = useSelector((state: ReduxState) =>
    state.metadata.semesters.filter((semester) => semester.id > 4)
  );
  const semester = semesters.find((semester) => semester.id === semesterId);
  const examSets = semester.examSets;
  const formik = useFormik({
    initialValues: {
      id: question?.id || null,
      text: question?.text || '',
      answers: [
        {
          index: 1,
          isCorrect: question?.answers.find((a) => a.index === 1).isCorrect || false,
          text: question?.answers.find((a) => a.index === 1).text || ''
        },
        {
          index: 2,
          isCorrect: question?.answers.find((a) => a.index === 2).isCorrect || false,
          text: question?.answers.find((a) => a.index === 2).text || ''
        },
        {
          index: 3,
          isCorrect: question?.answers.find((a) => a.index === 3).isCorrect || false,
          text: question?.answers.find((a) => a.index === 3).text || ''
        }
      ],
      examSetId: examSets[0]?.id
    } as QuestionInput,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true
  });

  useEffect(() => {
    Semester.fetchAll();
  }, []);

  useEffect(() => {
    formik.resetForm();
  }, [semesterId]);

  const updateQuestion = async (values: Partial<QuestionInput>) => {
    setIsSubmitting(true);
    try {
      if (!!images) {
        const formData = new FormData();
        for (let image of images) {
          formData.append('images', image);
        }
        const res = await axios.post('/images/upload', formData, {
          headers: { 'content-type': 'multipart/form-data' }
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

  const createQuestion = async (values: QuestionInput) => {
    try {
      delete values.id;
      if (!!images) {
        const formData = new FormData();
        for (let image of images) {
          formData.append('images', image);
        }
        const res = await axios.post('/images/upload', formData, {
          headers: { 'content-type': 'multipart/form-data' }
        });
        await Question.create({ ...values, images: res.data });
      } else {
        await Question.create({ ...values });
      }
      await Semester.fetchAll();
      formik.resetForm();
      setImages(null);
      setIsSubmitting(false);
      setError('');
    } catch (error) {
      console.log('error: ', error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: QuestionInput) => {
    setIsSubmitting(true);

    if (!!question) {
      return updateQuestion(values);
    }

    createQuestion(values);
  };

  const semesterOptions = semesters.map((semester) => ({
    text: `${semester.value}. semester: ${semester.name}`,
    value: semester.id,
    key: semester.id
  }));

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Segment>
        <h2 style={{ textAlign: 'center' }}>Tilføj spørgsmål</h2>
        <label>Semester</label>
        <Dropdown
          fluid
          selection
          options={semesterOptions}
          value={semesterId}
          onChange={(e, { value }) => setSemesterId(value as number)}
        />
        <Divider />
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
          <Form.TextArea
            label="Svar 1"
            name="answers[0].text"
            onChange={formik.handleChange}
            value={formik.values.answers[0].text}
          />
          <Form.Checkbox
            label="Korrekte svar"
            name="answers[0].isCorrect"
            checked={formik.values.answers[0].isCorrect}
            onChange={(e, { checked }) => formik.setFieldValue('answers[0].isCorrect', checked)}
          />
          <Form.TextArea
            label="Svar 2"
            name="answers[1].text"
            onChange={formik.handleChange}
            value={formik.values.answers[1].text}
          />
          <Form.Checkbox
            label="Korrekte svar"
            name="answers[1].isCorrect"
            checked={formik.values.answers[1].isCorrect}
            onChange={(e, { checked }) => formik.setFieldValue('answers[1].isCorrect', checked)}
          />
          <Form.TextArea
            label="Svar 3"
            name="answers[2].text"
            onChange={formik.handleChange}
            value={formik.values.answers[2].text}
          />
          <Form.Checkbox
            label="Korrekte svar"
            name="answers[2].isCorrect"
            checked={formik.values.answers[2].isCorrect}
            onChange={(e, { checked }) => formik.setFieldValue('answers[2].isCorrect', checked)}
          />
          <Form.Input
            type="file"
            multiple
            name="images"
            onChange={(e) => setImages(e.target.files)}
          />
          <Form.Field>
            <label>Sæt</label>
            <p>
              {examSets.find((s) => s.id === formik.values.examSetId).season +
                examSets.find((s) => s.id === formik.values.examSetId).year}
            </p>
          </Form.Field>
          <Divider />
          <Form.Button
            loading={isSubmitting}
            type="submit"
            fluid
            disabled={isSubmitting}
            basic
            style={{ cursor: 'pointer' }}
            color="green"
          >
            {!!question ? 'Rediger' : 'Tilføj'}
          </Form.Button>
        </Form>
        {error && <Message color="red">{error}</Message>}
      </Segment>
    </Container>
  );
};

export default CreateQuestionForm;
