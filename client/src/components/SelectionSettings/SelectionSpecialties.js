import React from "react";
import { Form, Checkbox, Divider, Header } from "semantic-ui-react";

import { specialer } from "../../common";

const checkboxGenerator = (speciale, props) => {
  return (
    <Form.Group key={speciale.value}>
      <Form.Field>
        <Checkbox
          label={speciale.text}
          value={speciale.value}
          checked={props.settings.specialer.includes(speciale.value)}
          name="specialer"
          onChange={props.onChange}
        />
        <Divider vertical hidden />
      </Form.Field>
    </Form.Group>
  );
};

const SelectionSpecialties = props => {
  if (!props.settings.semester)
    return (
      <Header as="h3">Vælg et semester for at se tilgængelige specialer</Header>
    );
  return (
    <Form>
      <Header as="h3">
        For {props.settings.semester}. semester er der følgende specialer at
        vælge mellem:
      </Header>

      {specialer[props.settings.semester].map(speciale => {
        return checkboxGenerator(speciale, props);
      })}
    </Form>
  );
};

export default SelectionSpecialties;
