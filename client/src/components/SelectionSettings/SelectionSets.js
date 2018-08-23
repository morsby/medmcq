import React from "react";

import _ from "lodash";
import { Form, Radio, Divider, Header, Icon } from "semantic-ui-react";

const radioGenerator = (set, props, groupedQuestions) => {
  let missing = "";
  if (props.user) {
    let missingLength = _.difference(
      _.map(groupedQuestions[set.api], "_id"),
      Object.keys(props.user.answeredQuestions[props.settings.semester])
    ).length;
    if (missingLength === 0) missing = <Icon name="check" color="green" />;
  }

  return (
    <Form.Group key={set.api}>
      <Form.Field>
        <Radio
          label={set.text}
          value={set.api}
          checked={set.api === props.settings.set}
          name="set"
          onChange={props.onChange}
        />{" "}
        {missing}
        <Divider vertical hidden />
      </Form.Field>
    </Form.Group>
  );
};

const SelectionSets = props => {
  let groupedQuestions = _.groupBy(
    props.settings.questions,
    q => `${q.examYear}/${q.examSeason}`
  );

  if (!props.settings.semester)
    return (
      <Header as="h3">
        Vælg et semester for at se tilgængelige eksamenssæt
      </Header>
    );
  return (
    <Form>
      <Header as="h3">
        For {props.settings.semester}. semester er der følgende eksamenssæt at
        vælge mellem:
      </Header>

      {props.settings.sets.map(set => {
        return radioGenerator(set, props, groupedQuestions);
      })}
    </Form>
  );
};

export default SelectionSets;
