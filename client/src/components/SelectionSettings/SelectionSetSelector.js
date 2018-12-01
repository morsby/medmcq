import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { groupQuestions, getIds } from "../../utils/questions";

import { Form, Radio, Divider, Header, Icon } from "semantic-ui-react";

const radioGenerator = (
    set,
    answeredQuestions,
    groupedQuestions,
    activeSet,
    onChange
) => {
    let missing = "";

    if (answeredQuestions) {
        let missingQuestions = _.difference(
            getIds(groupedQuestions[set.api]),
            getIds(answeredQuestions)
        );

        if (missingQuestions.length === 0)
            missing = <Icon name="check" color="green" />;
    }

    return (
        <Form.Group key={set.api}>
            <Form.Field>
                <Radio
                    label={set.text}
                    value={set.api}
                    checked={set.api === activeSet}
                    name="set"
                    onChange={onChange}
                />{" "}
                {missing}
                <Divider vertical hidden />
            </Form.Field>
        </Form.Group>
    );
};

const SelectionSetSelector = ({
    semester,
    activeSet,
    sets,
    questions,
    answeredQuestions,
    onChange
}) => {
    if (!semester)
        return (
            <Header as="h3">
                Vælg et semester for at se tilgængelige eksamenssæt
            </Header>
        );
    return (
        <Form>
            <Header as="h3">
                For {semester}. semester er der følgende eksamenssæt at vælge
                mellem:
            </Header>

            {sets.map(set => {
                return radioGenerator(
                    set,
                    answeredQuestions,
                    groupQuestions(questions),
                    activeSet,
                    onChange
                );
            })}
        </Form>
    );
};

SelectionSetSelector.propTypes = {
    semester: PropTypes.number,
    activeSet: PropTypes.string,
    sets: PropTypes.array,
    questions: PropTypes.array,
    answeredQuestions: PropTypes.object,
    onChange: PropTypes.func
};

export default SelectionSetSelector;
