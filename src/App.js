import React, { useRef, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Button, Form, Header, Table, Divider } from 'semantic-ui-react';

const ResultsTable = ({ calculatedInvestments }) => {
  const currentYear = (new Date()).getFullYear();
  return (
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Initial sum</Table.HeaderCell>
          <Table.HeaderCell>Monthly investments sum</Table.HeaderCell>
          <Table.HeaderCell>Total amount</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
  
      <Table.Body>
        {calculatedInvestments.map(({ initialSum, monthlyInvestmentsSum }, index) => (
          <Table.Row>
            <Table.Cell>{`${index + 1} (${currentYear + index + 1})`}</Table.Cell>
            <Table.Cell>{(initialSum).toFixed(1)}</Table.Cell>
            <Table.Cell>{(monthlyInvestmentsSum).toFixed(1)}</Table.Cell>
            <Table.Cell>{(initialSum + monthlyInvestmentsSum).toFixed(1)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

const calculateInvestments = ({initialSum, investmentPerMonth, growthRatePerMonth}) => {
  const resultArr = [];
  const growthFactorPerMonth = growthRatePerMonth / 100 + 1;

  for (let year = 1; year <= 40; year++) {
    const previousInitialSum = year > 1 ? resultArr[year - 2].initialSum : initialSum;
    const previousMonthlyInvestmentsSum = year > 1 ? resultArr[year - 2].monthlyInvestmentsSum : 0;
    const currentYearResults = resultArr[year - 1] = {
      initialSum: previousInitialSum,
      monthlyInvestmentsSum: previousMonthlyInvestmentsSum,
    };
    for (let month = 1; month <= 12; month++) {
      currentYearResults.initialSum *= growthFactorPerMonth;
      currentYearResults.monthlyInvestmentsSum *= growthFactorPerMonth;
      currentYearResults.monthlyInvestmentsSum += investmentPerMonth;
    }
  }

  return resultArr;
}

function App() {
  const [calculatedInvestments, setCalculatedInvestments] = useState(null);
  const initialSumInput = useRef();
  const investmentPerMonthInput = useRef();
  const growthRatePerMonthInput = useRef();

  return (
    <Container>
      <Header as='h1'>The Investment Calc</Header>
      <Form onSubmit={() => {
        const investmentPerMonth = parseFloat(investmentPerMonthInput.current.value);
        const growthRatePerMonth = parseFloat(growthRatePerMonthInput.current.value);
        const initialSum = parseFloat(initialSumInput.current.value);

        if (investmentPerMonth >= 0 && growthRatePerMonth > 0) {
          const result = calculateInvestments({initialSum, investmentPerMonth, growthRatePerMonth});
          setCalculatedInvestments(result);
        }
        else {
          alert('Interest per year and investment per month need to be > 0');
        }
      }}>
        <Form.Field>
          <label>Initial (starting) sum</label>
          <input placeholder='50,000' ref={initialSumInput} type="number" min="0" />
        </Form.Field>
        <Form.Field>
          <label>Amount of investment per month</label>
          <input placeholder='1000' ref={investmentPerMonthInput} type="number" min="0" />
        </Form.Field>
        <Form.Field>
          <label>Growth rate in % per month</label>
          <input
            placeholder='1'
            ref={growthRatePerMonthInput}
            label={{ basic: true, content: '%' }}
            labelPosition='right'
            type="number" step="0.01" min="0" max="100"
          />
        </Form.Field>
        <Button type='submit'>Calculate</Button>
      </Form>
      {calculatedInvestments && (
        <>
          <Divider />
          <ResultsTable calculatedInvestments={calculatedInvestments} />
        </>
      )}
    </Container>
  );
}

export default App;
