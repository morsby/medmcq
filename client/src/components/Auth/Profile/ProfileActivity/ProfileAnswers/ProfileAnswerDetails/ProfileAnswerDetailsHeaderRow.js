import React from 'react';

import { Translate } from 'react-localize-redux';
import { Table } from 'semantic-ui-react';

/**
 * The header row for the ProfileAnswerDetails table
 */
const ProfileAnswerDetailsHeaderRow = () => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell />
      <Table.HeaderCell>
        <Translate id="profileAnswerDetails.table_headers.question" />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <Translate id="profileAnswerDetails.table_headers.specialty" />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <Translate id="profileAnswerDetails.table_headers.set" />
      </Table.HeaderCell>
      <Table.HeaderCell textAlign="right">
        <Translate id="profileAnswerDetails.table_headers.performance" />
      </Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

export default ProfileAnswerDetailsHeaderRow;
