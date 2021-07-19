import React, { useEffect, useState } from "react";

const TrackexContext = React.createContext();

const TrackexProvider = ({ children }) => {
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
  return (
    <TrackexContext.Provider
      value={{
        categories,
        types,
      }}
    >
      {children}
    </TrackexContext.Provider>
  );
};

export { TrackexProvider, TrackexContext };
