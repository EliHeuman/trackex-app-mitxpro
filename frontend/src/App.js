import React, { useState } from "react";

import "./App.css";

import { NavBar } from "./components/NavBar";
import { TransactionsList } from "./components/Transactions/List";
import { Login } from "./components/Auth/Login";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { TrackexProvider } from "./trackexContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7661",
      contrastText: "#fff",
    },
    text: {
      primary: "#fff",
    },
  },
  overrides: {
    MuiInputLabel: {
      root: { color: "#fff", fontWeight: "normal" },
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #FF7661",
        },
        "&:hover": {
          borderBottom: "1px solid #FF7661",
        },
      },
    },
    MuiFormLabel: {
      root: {
        color: "#fff",
        fontWeight: 600,
        paddingBottom: "16px",
      },
    },
    MuiRadio: {
      root: {
        color: "#fff",
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: "#1C2633",
        color: "white",
      },
    },
    MuiDialogContent: {
      root: {
        color: "white",
      },
    },
    MuiDialogContentText: {
      root: {
        color: "white",
      },
    },
  },
});

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  return (
    <TrackexProvider>
      <MuiThemeProvider theme={theme}>
        {currentUser ? (
          <div className='layout'>
            <NavBar />
            <TransactionsList />
          </div>
        ) : (
          <Login setCurrentUser={setCurrentUser} />
        )}
      </MuiThemeProvider>
    </TrackexProvider>
  );
}

export default App;
