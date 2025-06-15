import React from "react";
import { ExpenseProvider } from "./context/ExpenseContext";
import ReceiptForm from "./components/ReceiptForm/ReceiptForm";
import ReceiptList from "./components/ReceiptList/ReceiptList";
import Statistics from "./components/Statistics/Statistics";
import styled from "styled-components";

function App() {
  return (
    <ExpenseProvider>
      <AppWrapper>
        <h1>Personal/Family Expense Tracker</h1>
        <Section>
          <h2>Add Receipt</h2>
          <ReceiptForm />
        </Section>
        <Section>
          <h2>Receipts</h2>
          <ReceiptList />
        </Section>
        <Section>
          <h2>Statistics</h2>
          <Statistics />
        </Section>
      </AppWrapper>
    </ExpenseProvider>
  );
}

const AppWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

export default App;