import React, { useMemo } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import styled from "styled-components";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c"];

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

export default function Statistics() {
  const { state } = useExpenses();

  // Group by month/year for bar chart
  const barData = useMemo(() => {
    const grouped = {};
    state.expenses.forEach(({ amount, date }) => {
      const key = getMonthYear(date);
      grouped[key] = (grouped[key] || 0) + amount;
    });
    return Object.entries(grouped).map(([key, total]) => ({ month: key, total }));
  }, [state.expenses]);

  // Group by category for pie chart
  const pieData = useMemo(() => {
    const grouped = {};
    state.expenses.forEach(({ amount, category }) => {
      grouped[category] = (grouped[category] || 0) + amount;
    });
    return Object.entries(grouped).map(([category, value]) => ({ name: category, value }));
  }, [state.expenses]);

  return (
    <ChartsWrapper>
      <div>
        <h3>Expenses by Month</h3>
        <BarChart width={400} height={250} data={barData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </div>
      <div>
        <h3>Expenses by Category</h3>
        <PieChart width={400} height={250}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </ChartsWrapper>
  );
}

const ChartsWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;