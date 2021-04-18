import React from "react";
import styled, { css } from "styled-components";

import logo from "./logo.svg";

const Logo = styled.img`
  padding: 32px;
  width: 150px;
`;
const Container = styled.div`
  border-right: 1px solid white;
  height: 100vh;
  display: grid;
  grid-template-rows: 10% 1fr;
`;
const List = styled.ul`
  list-style-type: none;
  padding: 32px 0;
  margin: 0;
`;

const Item = styled.li`
  padding: 8px 16px;
  margin-bottom: 8px;
  ${(props) =>
    props.active &&
    css`
      background: #ff7661;
      font-weight: bold;
    `};
`;

const NavBar = (props) => {
  return (
    <Container>
      <Logo src={logo} alt='sm-logo' />
      <List>
        <Item>Dashboard</Item>
        <Item>Calendar</Item>
        <Item active>Transactions</Item>
        <Item>Settings</Item>
      </List>
    </Container>
  );
};

export { NavBar };
