import React, { useState, useEffect } from 'react';
import { Segment, Form, Dropdown, Container, Divider, Message } from 'semantic-ui-react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import TextArea from 'antd/lib/input/TextArea';
import Question from 'classes/Question';
import Semester from 'classes/Semester';
import axios from 'axios';
import { QuestionInput } from 'types/generated';

export interface CreateQuestionFormProps {}

const CreateQuestionForm: React.SFC<CreateQuestionFormProps> = () => {
  const [error, setError] = useState('');
  const [semesterId, setSemesterId] = useState(5);
  const [images, setImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const semesters = useSelector((state: ReduxState) =>
    state.metadata.semesters.filter((semester) => semester.id > 4)
  );
  const semester = semesters.find((semester) => semester.id === semesterId);
  const examSets = semester.examSets;
  const formik = useFormik({
    initialValues: {
      text: '',
      answer1: '',
      answer2: '',
      answer3: '',
      examSetId: examSets[0]?.id,
      correctAnswers: [] as number[]
    },
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true
  });

  useEffect(() => {
    Semester.fetchAll();
  }, []);

  useEffect(() => {
    formik.resetForm();
  }, [semesterId]);

  const handleSubmit = async (values: QuestionInput) => {
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
        await Question.create({ ...values, images: res.data });
      } else {
        await Question.create(values);
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
                { text: 3, value: 3, key: 3 }
              ]}
              onChange={(e, { value }) => formik.setFieldValue('correctAnswers', value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Sæt</label>
            <Dropdown
              placeholder="Sæt"
              selection
              value={formik.values.examSetId}
              onChange={(e, { value }) => formik.setFieldValue('examSetId', value)}
              options={examSets.map((examSet) => ({
                value: examSet.id,
                text: `${examSet.season}${examSet.year}`,
                key: examSet.id
              }))}
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
            color="green"
          >
            Tilføj
          </Form.Button>
        </Form>
        {error && <Message color="red">{error}</Message>}
      </Segment>
    </Container>
  );
};

export default CreateQuestionForm;
