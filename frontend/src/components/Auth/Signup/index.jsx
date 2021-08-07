import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Debug } from "../../../aux/Debug";
import { AuthContext } from "../../../contexts/AuthContext";

import { app } from "../../../contexts/AuthContext/firebaseConfig";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Container = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: center;
  padding: 64px;
  background-color: #252f3d;
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Signup = () => {
  const { user, setUser } = useContext(AuthContext);
  console.log("Signup");
  const history = useHistory();

  const handleSubmit = async (values) => {
    console.log("values", values);
    try {
      const newUser = await app
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);
      if (newUser) {
        setUser(newUser);
        history.push("/transactions");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const userSchema = Yup.object().shape({
    email: Yup.string().required("Required field"),
    password: Yup.string().required("Required field"),
  });

  return (
    <Container>
      <h1>Signup</h1>
      <Formik
        initialValues={{}}
        validationSchema={userSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, values, handleChange, touched, errors }) => (
          <>
            <Form style={{ width: "100%" }}>
              <FieldsWrapper>
                <TextField
                  fullWidth
                  id='email'
                  name='email'
                  label='Email'
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  id='password'
                  name='password'
                  type='password'
                  label='Password'
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </FieldsWrapper>

              <Button
                fullWidth
                variant='contained'
                color='primary'
                type='submit'
                disabled={!isValid || isSubmitting}
              >
                Create Account
              </Button>
            </Form>
            <Debug />
          </>
        )}
      </Formik>
    </Container>
  );
};

export { Signup };
