import React, { useState, useEffect } from "react";
import styled from "styled-components";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Debug } from "../../../aux/Debug";
import { authAPI } from "../../../services/auth";

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
const Login = ({ setCurrentUser }) => {
  const handleSubmit = async (values) => {
    console.log("values", values);
    try {
      const { status, data } = await authAPI.login(values);
      if (status === 200) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      setCurrentUser({ ...values, ...data });
    } catch (e) {
      console.log(e);
    }
  };

  const userSchema = Yup.object().shape({
    username: Yup.string().required("Required field"),
    password: Yup.string().required("Required field"),
  });

  return (
    <Container>
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
                  id='username'
                  name='username'
                  label='Username'
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
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
                Log in
              </Button>
            </Form>
            <Debug />
          </>
        )}
      </Formik>
    </Container>
  );
};

export { Login };
