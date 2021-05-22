import React, { useState, useEffect } from "react";
import styled from "styled-components";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Input } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

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

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    setTransactions(data);
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    console.log("serch---");
    console.log(search);
    filterByName(search);
  }, [search]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const handleCloseDialog = () => setOpenDeleteDialog(false);

  const handleDelete = (id) => {
    setTransaction({ id });
    setOpenDeleteDialog(true);
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

  const deleteTransaction = () => {
    console.log("delete", transaction);
    const _transactions = [...transactions].filter(
      ({ id }) => id !== transaction.id
    );
    console.log(_transactions);
    setTransactions(_transactions);
    setOpenDeleteDialog(false);
  };

  const filterByName = (query) => {
    console.log("filterByName", query);
    // console.log("filteredTransactions", filteredTransactions);
    const _filteredTransactions = transactions.filter((transaction) => {
      return transaction.name.toLowerCase().includes(query.toLowerCase());
    });
    // console.log("_filteredTransactions", _filteredTransactions);
    setFilteredTransactions(_filteredTransactions);
  };

  return (
    <Grid>
      <ActionsWrapper>
        <FormControl style={{ width: "80%" }}>
          <Input
            name='search'
            value={search}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
            fullWidth
            onInput={(event) => {
              console.log("search", event.target.value);
              setSearch(event.target.value);
            }}
          />
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpenDrawer(true)}
        >
          + Add transaction
        </Button>
      </ActionsWrapper>
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
            ? filteredTransactions.map((transaction) => {
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
          handleSubmit={handleSubmit}
        />
      )}
      {openDeleteDialog && (
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDialog}
          aria-labelledby='delete-transaction'
        >
          <DialogTitle>Delete transaction</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this transaction? You won't be
              able to recover it.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color='primary'
              variant='outlined'
            >
              Cancel
            </Button>
            <Button
              onClick={deleteTransaction}
              color='primary'
              variant='contained'
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );
};

export { TransactionsList };
