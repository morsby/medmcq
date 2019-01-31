import React from 'react';
import PropTypes from 'prop-types';

import { List, Dropdown, Button } from 'semantic-ui-react';

import { specialer } from '../../../utils/common';
import { superUserRoles } from '../../../utils/auth';

/**
 * Viser metadata (speciale, sæt, mv.) for spørgsmålet
 * @param {object} question Spørgsmåls-objectet
 */
const QuestionMetadata = ({
    question,
    onToggleSpecialties,
    editingSpecialties,
    onEditSpecialty,
    onSaveSpecialties,
    selectedSpecialties,
    user,
}) => {
    // Grimt fix for at undgå "user is undefined"
    if (!user) user = {};

    let specialtiesSelect = specialer[question.semester];
    let specialtiesDisplay = question.specialty.map(e => (
        <List.Item key={e}>{e}</List.Item>
    ));

    if (superUserRoles.indexOf(user.role) > -1) {
        if (editingSpecialties) {
            specialtiesDisplay = (
                <>
                    <List.Item>
                        <Dropdown
                            placeholder="Specialer"
                            onChange={onEditSpecialty}
                            multiple
                            selection
                            options={specialtiesSelect}
                            value={selectedSpecialties}
                        />
                    </List.Item>
                    <List.Item>
                        <Button
                            onClick={onSaveSpecialties}
                            content="Opdater specialer"
                        />
                    </List.Item>
                </>
            );
        } else {
            specialtiesDisplay.push(
                <List.Item key="ret">
                    <Button
                        onClick={onToggleSpecialties}
                        content="Ret specialer"
                    />
                </List.Item>
            );
        }
    }

    return (
        <div>
            <List horizontal>
                <List.Item>
                    <List.Header>Sæt: </List.Header>
                </List.Item>
                <List.Item>
                    {question.examSeason}
                    {question.examYear}
                </List.Item>
            </List>
            <br />
            <List horizontal>
                <List.Item>
                    <List.Header>Speciale: </List.Header>
                </List.Item>
                {specialtiesDisplay}
            </List>
        </div>
    );
};

QuestionMetadata.propTypes = {
    question: PropTypes.object.isRequired,
};

export default QuestionMetadata;
