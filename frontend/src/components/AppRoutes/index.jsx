import React, { useContext } from "react";

import { Router, Switch, Route } from "react-router-dom";
import { NavBar } from "../NavBar";
import { TransactionsList } from "../Transactions/List";
import { Login } from "../Auth/Login";
import { Signup } from "../Auth/Signup";
import { AuthContext } from "../../contexts/AuthContext";
import { createBrowserHistory } from "history";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const history = createBrowserHistory();
  if (user) {
    console.log("vAppRoutes auth");
    return (
      <div className='layout'>
        <Router history={history}>
          <NavBar />
          <Switch>
            <Route path='/transactions' component={TransactionsList} />
          </Switch>
        </Router>
      </div>
    );
  }
  return (
    <Router history={history}>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
      </Switch>
    </Router>
  );
};

export { AppRoutes };
