import React from 'react';
import PropTypes from 'prop-types';

import { List, Dropdown, Button } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import { specialer } from '../../../utils/common';
import { getSpecialtyName } from '../../../utils/quiz';
import { superUserRoles } from '../../../utils/auth';

/**
 * Viser metadata (speciale, sæt, mv.) for spørgsmålet
 * Alle props er fra Question.js, beskrivelse findes i bunden.
 */
const QuestionMetadata = ({
    question,
    onToggleSpecialties,
    editingSpecialties,
    onEditSpecialty,
    onSaveSpecialties,
    selectedSpecialties,
    user = {}
}) => {
    // Grimt fix for at undgå "user is undefined"
    if (!user) user = {};

    let specialtiesSelect = specialer[question.semester];
    let specialtiesDisplay = question.specialty.map(e => (
        <List.Item key={e}>
            {getSpecialtyName({ semester: question.semester, specialtyApiKey: e })}
        </List.Item>
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
                        <Button onClick={onSaveSpecialties} content="Opdater specialer" />
                    </List.Item>
                </>
            );
        } else {
            specialtiesDisplay.push(
                <List.Item key="ret">
                    <Button onClick={onToggleSpecialties} content="Ret specialer" />
                </List.Item>
            );
        }
    }

    return (
        <div>
            <List horizontal>
                <List.Item>
                    <List.Header>
                        <Translate id="questionMetadata.set" />
                    </List.Header>
                </List.Item>
                <List.Item>
                    <Translate id={`questionMetadata.set_season.${question.examSeason}`} />
                    {question.examYear}
                </List.Item>
            </List>
            <br />
            <List horizontal>
                <List.Item>
                    <List.Header>
                        <Translate id="questionMetadata.specialty" />
                    </List.Header>
                </List.Item>
                {specialtiesDisplay}
            </List>
        </div>
    );
};

QuestionMetadata.propTypes = {
    /**
     * Spørgsmålsobjektet
     */
    question: PropTypes.object.isRequired,

    /**
     * Func der kaldes og fremkalder dropdown-menu til ændring
     * af specialer (via prop editingSpecialties)
     */
    onToggleSpecialties: PropTypes.func,

    /**
     * Boolean om hvorvidt der skal vises speciale-dropdown. Ændres af
     * onToggleSpecialties
     */
    editingSpecialties: PropTypes.bool,

    /**
     * Func der kaldes, når valgte specialer ændres (ændrer selectedSpecialties)
     */
    onEditSpecialty: PropTypes.func,

    /**
     * Array af valgte specialer. Er state i Question.js, ændres via onEditSpecialty
     */
    selectedSpecialties: PropTypes.array,

    /**
     * Func der kaldes, når specialevalgene for spørgsmålet skal gemmes
     */
    onSaveSpecialties: PropTypes.func,

    /**
     * Brugerobjektet.
     */
    user: PropTypes.object
};

export default QuestionMetadata;
