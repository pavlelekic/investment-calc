import React from 'react';
import { Table, Icon } from 'semantic-ui-react';

const serbianLocale = new Intl.NumberFormat('RS');
const formatNumber = (number) => serbianLocale.format(Math.round(number));

const ResultsTable = React.memo(({ calculatedInvestments }) => {
  const currentYear = (new Date()).getFullYear();
  return (
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Initial sum<Icon disabled name='users' /></Table.HeaderCell>
          <Table.HeaderCell>Monthly investments sum</Table.HeaderCell>
          <Table.HeaderCell>Total</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
  
      <Table.Body>
        {calculatedInvestments.map(({ initialSum, monthlyInvestmentsSum }, index) => (
          <Table.Row>
            <Table.Cell>{`${index + 1} (${currentYear + index + 1})`}</Table.Cell>
            <Table.Cell>{formatNumber(initialSum)}</Table.Cell>
            <Table.Cell>{formatNumber(monthlyInvestmentsSum)}</Table.Cell>
            <Table.Cell>{formatNumber(initialSum + monthlyInvestmentsSum)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
});

export default ResultsTable;
