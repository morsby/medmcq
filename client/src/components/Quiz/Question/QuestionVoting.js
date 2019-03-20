import React from 'react';
import { specialer } from '../../../utils/common';
import { Button } from 'semantic-ui-react';

const QuestionVoting = ({
  question,
  onToggleSpecialties,
  editingSpecialties,
  onEditSpecialty,
  onSaveSpecialties,
  selectedSpecialties,
  user = {}
}) => {
  const specialties = () => {
    let specialties = [];

    console.log(question.semester);

    specialer[question.semester].forEach((speciale) => {
      specialties.push(
        <Button basic onClick={() => vote(speciale.value)}>
          {speciale.text}
        </Button>
      );
    });

    return specialties;
  };

  const vote = (value) => {
    console.log(value, user);
  };

  return (
    <div>
      <h5 style={{ color: 'grey', marginLeft: '3px' }}>Stem på speciale</h5>
      {specialties()}
    </div>
  );
};

export default QuestionVoting;
