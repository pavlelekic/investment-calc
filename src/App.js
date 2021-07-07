import 'semantic-ui-css/semantic.min.css';
import React, { useState } from 'react';
import { Container, Button, Form, Header, Divider, Icon, Popup, Input, Message } from 'semantic-ui-react';
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
  const [investmentPerMonth, setInvestmentPerMonth] = useState(undefined);
  const [growthRatePerYear, setGrowthRatePerYear] = useState(undefined);
  const [initialSum, setInitialSum] = useState(0);
  const growthRatePerMonth = Math.pow((growthRatePerYear / 100 + 1), 1 / 12);

  let calculatedInvestments = null;
  if (investmentPerMonth >= 0 && growthRatePerMonth >= 0 && initialSum >= 0) {
    calculatedInvestments = calculateInvestments({ initialSum, investmentPerMonth, growthRatePerMonth });
  }

  return (
    <Container style={{ padding: '10vh 0'}}>
      <Header floated="left" as='h1'>The Investment Calc</Header>
      <Button floated='right' icon circular>
        <Icon name='setting' />
      </Button>
      <ClearFix  style={{ marginBottom: SPACE.lg }}/>
      <Form style={{ marginBottom: SPACE.xl }}>
        <Form.Group widths='equal'>
          <Form.Field>
            <LabelWithTooltip
              label="Starting sum"
              tooltipText="Do you have some savings? Are you starting from 0?"
            />
            <Input
              placeholder='50,000'
              onChange={(e) => setInitialSum(parseFloat(e.target.value))}
              type="number"
              min="0"
              step="10"
              defaultValue={initialSum}
            />
          </Form.Field>
          <Form.Field>
            <LabelWithTooltip
              label="Monthly investments"
              tooltipText="How much money can you set aside each month for investing?"
            />
            <Input
              placeholder='1000'
              type="number"
              min="0"
              step="10"
              onChange={(e) => setInvestmentPerMonth(parseFloat(e.target.value))}
            />
          </Form.Field>
          <Form.Field>
            <LabelWithTooltip
              label="Growth rate per year"
              tooltipText="For example S&P 500 average return is of around 10% since its inception through 2019"
            />
            <Input
              placeholder='10'
              label={{ basic: true, content: '%' }}
              labelPosition='right'
              type="number" step="0.2" min="0" max="100"
              onChange={(e) => setGrowthRatePerYear(parseFloat(e.target.value))}
            />
          </Form.Field>
        </Form.Group>
      </Form>
      {calculatedInvestments ? (
        <>
          <AreaChart calculatedInvestments={calculatedInvestments} />
          <ResultsTable calculatedInvestments={calculatedInvestments} />
        </>
      ) : (
        <Message info>
          <Message.Header>How to use this?</Message.Header>
          <p>You just need to enter a value for starting sum, monthly investments and growth per year and the results will show up in chart and also in a table below it.</p>
        </Message>
      )}
    </Container>
  );
};

export default App;
