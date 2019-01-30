import React from 'react';
import PropTypes from 'prop-types';

import { List } from 'semantic-ui-react';

/**
 * Viser metadata (speciale, sæt, mv.) for spørgsmålet
 * @param {object} question Spørgsmåls-objectet
 */
const QuestionMetadata = ({ question }) => {
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

                {question.specialty.map(e => (
                    <List.Item key={e}>{e}</List.Item>
                ))}
            </List>
        </div>
    );
};

QuestionMetadata.propTypes = {
    question: PropTypes.object.isRequired,
};

export default QuestionMetadata;
