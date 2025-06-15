import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadExpenses, saveExpenses } from "../utils/storage";

const ExpenseContext = createContext();

const initialState = {
  expenses: loadExpenses(),
};

function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "EDIT_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    saveExpenses(state.expenses);
  }, [state.expenses]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}