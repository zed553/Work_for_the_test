import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { categories } from "../../utils/categories";
import { useExpenses } from "../../context/ExpenseContext";
import styled from "styled-components";

const ReceiptSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  amount: Yup.number().moreThan(0, "Must be greater than zero").required("Required"),
  currency: Yup.string().required("Required"),
  date: Yup.date().required("Required"),
  category: Yup.string().required("Required"),
});

const currencies = ["USD", "EUR", "GBP", "UAH"];

export default function ReceiptForm({ initialValues, onClose }) {
  const { dispatch } = useExpenses();
  const isEdit = !!initialValues?.id;

  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          amount: "",
          currency: "USD",
          date: new Date(),
          category: categories[0],
        }
      }
      validationSchema={ReceiptSchema}
      onSubmit={(values, { resetForm }) => {
        const receipt = {
          ...values,
          amount: Number(values.amount),
          id: initialValues?.id || Date.now(),
        };
        dispatch({
          type: isEdit ? "EDIT_EXPENSE" : "ADD_EXPENSE",
          payload: receipt,
        });
        resetForm();
        if (onClose) onClose();
      }}
    >
      {({ setFieldValue, values }) => (
        <StyledForm as={Form}>
          <label>Name</label>
          <Field name="name" />
          <ErrorMessage name="name" component="div" className="error" />

          <label>Amount</label>
          <Field name="amount" type="number" min="0.01" step="0.01" />
          <ErrorMessage name="amount" component="div" className="error" />

          <label>Currency</label>
          <Field as="select" name="currency">
            {currencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Field>
          <ErrorMessage name="currency" component="div" className="error" />

          <label>Date</label>
          <DatePicker
            selected={values.date ? new Date(values.date) : null}
            onChange={val => setFieldValue("date", val)}
            dateFormat="yyyy-MM-dd"
          />
          <ErrorMessage name="date" component="div" className="error" />

          <label>Category</label>
          <Field as="select" name="category">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Field>
          <ErrorMessage name="category" component="div" className="error" />

          <button type="submit">{isEdit ? "Update" : "Add"} Receipt</button>
        </StyledForm>
      )}
    </Formik>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  .error { color: red; font-size: 0.8em; }
`;