import React, { useEffect, useState } from "react";
import { app } from "./firebaseConfig";

import CircularProgress from "@material-ui/core/CircularProgress";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem("token", token);
        });
      }
      setUser(user);
      setIsLoading(false);
    });
  }, [user]);

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
