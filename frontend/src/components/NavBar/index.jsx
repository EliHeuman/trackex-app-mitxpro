import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { app } from "../../contexts/AuthContext/firebaseConfig";

import logo from "./logo.svg";
import { AuthContext } from "../../contexts/AuthContext";

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

  a {
    display: block;
    text-decoration: none;
    color: white;
    padding: 8px 16px;
    margin-bottom: 8px;
    ${(props) =>
      props.active &&
      css`
        background: #ff7661;
        font-weight: bold;
      `};
  }
`;

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const history = useHistory();

  const handleLogOut = () => {
    console.log("logout");
    app
      .auth()
      .signOut()
      .then((res) => {
        setUser(null);
        localStorage.removeItem("token");
        history.push("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container>
      <Logo src={logo} alt='sm-logo' />
      <List>
        <Item>
          <NavLink to='/dashboard'>Dashboard </NavLink>
        </Item>
        <Item>
          <NavLink to='/calendar'>Calendar </NavLink>
        </Item>
        <Item active>
          <NavLink to='/transactions'>Transactions </NavLink>
        </Item>
        <Item>
          <NavLink to='/settings'>Settings </NavLink>
        </Item>
        <Item onClick={handleLogOut}>Log out</Item>
      </List>
    </Container>
  );
};

export { NavBar };
