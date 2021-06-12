import React from "react";
import styled from "styled-components";

import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Debug } from "../../aux/Debug";

const categories = [
  { value: "eating_out", label: "Eating out", id: 1 },
  { value: "clothes", label: "Clothes", id: 2 },
  { value: "electronics", label: "Electronics", id: 3 },
  { value: "groceries", label: "Groceries", id: 4 },
  { value: "salary", label: "Salary", id: 5 },
];

const types = [
  { value: "expense", label: "Expense", id: 1 },
  { value: "income", label: "Income", id: 2 },
];

const Container = styled.div`
  padding: 16px;
  width: 380px;
  height: 100vh;
  overflow: scroll;
  background-color: #252f3d;
  color: white;
`;
const RadioOptionsWrapper = styled.div`
  display: flex;
  padding-top: 24px;
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const TransactionDrawer = ({
  onClose,
  open,
  mode,
  handleSubmit,
  availbleModes,
  data,
}) => {
  const transactionSchema = Yup.object().shape({
    name: Yup.string().required("Required field"),
    date: Yup.string().required("Required field"),
    amount: Yup.number().required("Required field"),
    category: Yup.string().required("Required field"),
    type: Yup.string().required("Required field"),
  });

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Container>
        <h2>{mode === availbleModes.add ? "New" : "Edit"} transaction</h2>
        <Formik
          initialValues={data}
          validationSchema={transactionSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit({
              ...values,
              category: categories.find((cat) => cat.value === values.category)
                ?.id,
              type: types.find((cat) => cat.value === values.type)?.id,
            });
            setSubmitting(false);
          }}
        >
          {({
            isSubmitting,
            isValid,
            values,
            handleChange,
            touched,
            errors,
          }) => (
            <>
              <Form>
                <FieldsWrapper>
                  <TextField
                    fullWidth
                    id='name'
                    name='name'
                    label='Name'
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    id='date'
                    name='date'
                    label='Date'
                    value={values.date}
                    onChange={handleChange}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                    // component={DatePicker}
                  />
                  <TextField
                    id='amount'
                    type='number'
                    name='amount'
                    label='Amount'
                    value={values.amount}
                    onChange={handleChange}
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                  />
                  <RadioOptionsWrapper>
                    <FormControl component='fieldset'>
                      <FormLabel component='legend'>Category</FormLabel>
                      <RadioGroup
                        aria-label='category'
                        name='category'
                        value={values.category}
                        onChange={handleChange}
                      >
                        {categories.map((category) => (
                          <FormControlLabel
                            value={category.value}
                            control={<Radio color='primary' />}
                            label={category.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormControl component='fieldset'>
                      <FormLabel component='legend'>Type</FormLabel>
                      <RadioGroup
                        aria-label='type'
                        name='type'
                        value={values.type}
                        onChange={handleChange}
                      >
                        {types.map((type) => (
                          <FormControlLabel
                            value={type.value}
                            control={<Radio color='primary' />}
                            label={type.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </RadioOptionsWrapper>
                  <ActionsWrapper>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={!isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </ActionsWrapper>
                </FieldsWrapper>
              </Form>
              <Debug />
            </>
          )}
        </Formik>
      </Container>
    </Drawer>
  );
};

export { TransactionDrawer };
