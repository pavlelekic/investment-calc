import 'semantic-ui-css/semantic.min.css';
import React, { useRef, useState } from 'react';
import { Container, Button, Form, Header, Divider, Icon, Popup } from 'semantic-ui-react';
import ResultsTable from './ResultsTable';
import AreaChart from './AreaChart';
import { SPACE } from './constants';

const calculateInvestments = ({initialSum, investmentPerMonth, growthRatePerMonth}) => {
  const resultArr = [];
  const growthFactorPerMonth = growthRatePerMonth;

  for (let year = 1; year <= 10; year++) {
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

const LabelWithTooltip = ({ label, tooltipText }) => (
  <label>
    {label}
    <Popup
      content={tooltipText}
      trigger={<Icon disabled name='info circle' style={{ marginLeft: SPACE.xs }} />}
    />
  </label>
);

const ClearFix = ({ style }) => (
  <div style={{ clear: 'both', display: 'table', ...style }} />
);

const App = () => {
  const [calculatedInvestments, setCalculatedInvestments] = useState(null);
  const initialSumInput = useRef();
  const investmentPerMonthInput = useRef();
  const growthRatePerYearInput = useRef();

  return (
    <Container style={{ padding: '10vh 0'}}>
      <Header floated="left" as='h1'>The Investment Calc</Header>
      <Button floated='right' icon circular>
        <Icon name='setting' />
      </Button>
      <ClearFix  style={{ marginBottom: SPACE.lg }}/>
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
            <LabelWithTooltip
              label="Starting sum"
              tooltipText="Do you have some savings? Are you starting from 0?"
            />
            <input placeholder='50,000' ref={initialSumInput} type="number" min="0" defaultValue={120000}/>
          </Form.Field>
          <Form.Field>
            <LabelWithTooltip
              label="Monthly investments"
              tooltipText="How much money can you set aside each month for investing?"
            />
            <input placeholder='1000' ref={investmentPerMonthInput} type="number" min="0" defaultValue={1500}/>
          </Form.Field>
          <Form.Field>
            <LabelWithTooltip
              label="Growth rate per year"
              tooltipText="For example S&P 500 grows at an average of 12% per year"
            />
            <label></label>
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
          <AreaChart
            calculatedInvestments={calculatedInvestments}
          />
          <ResultsTable
            calculatedInvestments={calculatedInvestments}
          />
        </>
      )}
    </Container>
  );
};

export default App;
