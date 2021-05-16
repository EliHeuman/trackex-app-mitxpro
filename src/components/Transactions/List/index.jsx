import React, { useState, useEffect } from "react";
import styled from "styled-components";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

import Skeleton from "@material-ui/lab/Skeleton";

import { TransactionDrawer } from "../../Drawer";
import data from "./data";

const Table = styled.table`
  width: 100%;
  text-align: left;
  padding: 16px 0;
`;

const HeadCell = styled.th`
  padding: 16px 0;
  width: 20%;
`;
const TableCell = styled.td`
  padding: 8px 0;
  width: 23%;
  &(:last-of-type) {
    display: flex;
    justify-content: flex-end;
    width: 8%;
  }
`;
const Amount = styled.p`
  color: ${({ type }) => (type === "expense" ? "#FF7661" : "#00E4C6")};
`;

const Grid = styled.div`
  width: 100%;
  padding: 64px;
`;

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AVAILABLE_MODES = {
  add: "add",
  edit: "edit",
};
const emptyFormInitialValues = {
  name: "",
  amount: "",
  date: "",
  category: "eating_out",
  type: "expense",
};
const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState(AVAILABLE_MODES.add);
  const [transaction, setTransaction] = useState(emptyFormInitialValues);

  useEffect(() => {
    setTransactions(data);
  }, []);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const handleDelete = (id) => {
    const _transactions = [...transactions].filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(_transactions);
  };

  const handleEdit = (id) => {
    setMode(AVAILABLE_MODES.edit);
    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );
    setTransaction(transaction);
    setOpenDrawer(true);
  };
  const handleSubmit = (values) => {
    console.log(JSON.stringify(values));
    mode === AVAILABLE_MODES.add
      ? addTransaction(values)
      : editTransaction(values);

    setOpenDrawer(!openDrawer);
  };

  const addTransaction = (data) => {
    setTransactions([...transactions, { ...data }]);
  };

  const editTransaction = (data) => {
    console.log("Data", data);
    const _transactionIndex = transactions.findIndex(
      (transaction) => transaction.id === data.id
    );
    const _transactions = [...transactions];
    _transactions[_transactionIndex] = data;

    setTransactions(_transactions);
  };

  return (
    <Grid>
      <AddButtonWrapper>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpenDrawer(true)}
        >
          + Add transaction
        </Button>
      </AddButtonWrapper>
      <Table>
        <thead>
          <tr>
            <HeadCell>Date</HeadCell>
            <HeadCell>Name</HeadCell>
            <HeadCell>Category</HeadCell>
            <HeadCell>Amount</HeadCell>
            <HeadCell></HeadCell>
          </tr>
        </thead>
        <tbody>
          {transactions.length
            ? transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <Amount type={transaction.type}>
                        {formatter.format(transaction.amount)}
                      </Amount>
                    </TableCell>
                    <TableCell>
                      <EditIcon
                        style={{ marginRight: "16px" }}
                        onClick={() => handleEdit(transaction.id)}
                      />
                      <DeleteForeverIcon
                        style={{ color: "#FF7661" }}
                        onClick={() => handleDelete(transaction.id)}
                      />
                    </TableCell>
                  </tr>
                );
              })
            : Array.from(new Array(6)).map(() => (
                <tr>
                  {Array.from(new Array(4)).map((el) => (
                    <TableCell>
                      <Skeleton
                        component='td'
                        variant='rect'
                        width='100%'
                        height={32}
                      />
                    </TableCell>
                  ))}
                </tr>
              ))}
        </tbody>
      </Table>

      {openDrawer && (
        <TransactionDrawer
          onClose={() => setOpenDrawer(!openDrawer)}
          open={openDrawer}
          mode={mode}
          availbleModes={AVAILABLE_MODES}
          data={transaction}
        />
      )}
    </Grid>
  );
};

export { TransactionsList };
