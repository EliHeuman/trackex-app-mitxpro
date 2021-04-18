import React from "react";
import styled from "styled-components";

import { TransactionsList } from "../Transactions/List";
const Container = styled.div`
  padding: 64px;
`;

const Content = (props) => {
  return (
    <Container>
      <TransactionsList />
    </Container>
  );
};

export { Content };
