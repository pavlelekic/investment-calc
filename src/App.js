import React, { useRef, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Button, Form, Header, Table, Divider } from 'semantic-ui-react';

const serbianLocale = new Intl.NumberFormat('RS');
const formatNumber = (number) => serbianLocale.format(Math.round(number));

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
            <Table.Cell>{formatNumber(initialSum)}</Table.Cell>
            <Table.Cell>{formatNumber(monthlyInvestmentsSum)}</Table.Cell>
            <Table.Cell>{formatNumber(initialSum + monthlyInvestmentsSum)}</Table.Cell>
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

const App = () => {
  const [calculatedInvestments, setCalculatedInvestments] = useState(null);
  const initialSumInput = useRef();
  const investmentPerMonthInput = useRef();
  const growthRatePerYearInput = useRef();

  return (
    <Container style={{ padding: '10vh 0'}}>
      <Header as='h1'>The Investment Calc</Header>
      <Form onSubmit={() => {
        const investmentPerMonth = parseFloat(investmentPerMonthInput.current.value);
        const growthRatePerYear = parseFloat(growthRatePerYearInput.current.value);
        const growthRatePerMonth = Math.pow((growthRatePerYear / 100 + 1), 1 / 12);
        const initialSum = parseFloat(initialSumInput.current.value);

        if (investmentPerMonth >= 0 && growthRatePerMonth > 0) {
          const result = calculateInvestments({initialSum, investmentPerMonth, growthRatePerMonth});
          setCalculatedInvestments(result);
        }
        else {
          alert('Interest per year and investment per month need to be > 0');
        }
      }}>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Starting sum</label>
            <input placeholder='50,000' ref={initialSumInput} type="number" min="0" defaultValue={120000}/>
          </Form.Field>
          <Form.Field>
            <label>Monthly investments</label>
            <input placeholder='1000' ref={investmentPerMonthInput} type="number" min="0" defaultValue={1500}/>
          </Form.Field>
          <Form.Field>
            <label>Growth rate per year</label>
            <input
              placeholder='10'
              ref={growthRatePerYearInput}
              label={{ basic: true, content: '%' }}
              labelPosition='right'
              type="number" step="0.01" min="0" max="100"
              defaultValue={10}
            />
          </Form.Field>
          <Form.Field style={{
            flex: 0,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <Button type="submit">Calculate</Button>
          </Form.Field>
        </Form.Group>
      </Form>
      {calculatedInvestments && (
        <>
          <Divider />
          <ResultsTable calculatedInvestments={calculatedInvestments} />
        </>
      )}
    </Container>
  );
};

export default App;
