import React, { useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import ReceiptForm from "../ReceiptForm/ReceiptForm";
import styled from "styled-components";

function GlobalFilter({ filter, setFilter }) {
  return (
    <input
      value={filter || ""}
      onChange={e => setFilter(e.target.value)}
      placeholder="Search by name or date"
      style={{ marginBottom: 10 }}
    />
  );
}

export default function ReceiptList() {
  const { state, dispatch } = useExpenses();
  const [editing, setEditing] = useState(null);

  const data = useMemo(() =>
    state.expenses.map(r => ({
      ...r,
      date: new Date(r.date).toLocaleDateString(),
    })), [state.expenses]);

  const columns = useMemo(() => [
    { Header: "Name", accessor: "name" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Currency", accessor: "currency" },
    { Header: "Date", accessor: "date" },
    { Header: "Category", accessor: "category" },
    {
      Header: "Actions", accessor: "id", Cell: ({ row }) => (
        <>
          <button onClick={() => setEditing(row.original)}>Edit</button>
          <button onClick={() => dispatch({type:"DELETE_EXPENSE", payload: row.original.id})}>Delete</button>
        </>
      )
    }
  ], [dispatch]);

  const {
    getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state:tableState, setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <div>
      <GlobalFilter filter={tableState.globalFilter} setFilter={setGlobalFilter} />
      {editing && (
        <ReceiptForm initialValues={editing} onClose={() => setEditing(null)} />
      )}
      <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map(col => (
                <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                  {col.render("Header")}
                  <span>
                    {col.isSorted ? (col.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render("Cell")}</td>)}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </div>
  );
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { border: 1px solid #ddd; padding: 8px; }
  th { background-color: #f5f5f5; cursor: pointer; }
`;