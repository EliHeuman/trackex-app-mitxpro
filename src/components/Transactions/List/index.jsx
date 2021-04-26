import React from "react";
import styled, { css } from "styled-components";

const Table = styled.table`
  width: 80%;
  text-align: left;
  padding: 8px;
`;

const TransactionsList = ({ transactions }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Category</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => {
          return (
            <tr data-id={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.name}</td>
              <td>{transaction.category}</td>
              <td>{transaction.amount}</td>
              <td>...</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export { TransactionsList };
