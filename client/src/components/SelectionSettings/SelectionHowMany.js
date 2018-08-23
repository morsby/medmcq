import React from "react";
import { connect } from "react-redux";
import { Form, Radio, Checkbox, Divider, Header } from "semantic-ui-react";

const SelectionHowMany = props => {
  return (
    <Form>
      <Header as="h3">Hvor mange spørgsmål vil du have?</Header>
      <Form.Group>
        <Form.Field>
          <Radio
            label="5"
            value={5}
            name="n"
            checked={props.n === 5}
            onChange={props.onChange}
          />
          <Divider vertical hidden />
        </Form.Field>

        <Form.Field>
          <Radio
            label="10"
            value={10}
            name="n"
            checked={props.n === 10}
            onChange={props.onChange}
            width={2}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="20"
            value={20}
            name="n"
            checked={props.n === 20}
            onChange={props.onChange}
            width={3}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="40"
            value={40}
            name="n"
            checked={props.n === 40}
            onChange={props.onChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="80"
            value={80}
            name="n"
            checked={props.n === 80}
            onChange={props.onChange}
          />
        </Form.Field>
      </Form.Group>

      <div>Der er {props.total} spørgsmål for det valgte semester.</div>
      <Divider hidden />

      {props.user && (
        <div>
          <Checkbox
            name="onlyNew"
            checked={props.onlyNew}
            onClick={props.onChange}
            label="Giv mig kun spørgsmål, jeg ikke har svaret på tidligere"
          />
          <Divider hidden />
        </div>
      )}
    </Form>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(
  mapStateToProps,
  null
)(SelectionHowMany);
