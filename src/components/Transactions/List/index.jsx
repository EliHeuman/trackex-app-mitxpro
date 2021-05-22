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

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

import Skeleton from "@material-ui/lab/Skeleton";

import { TransactionDrawer } from "../../Drawer";
import data from "./data";
import { getByLabelText } from "@testing-library/dom";

const Table = styled.table`
  width: 80%;
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

const FiltersContainer = styled.div`
  width: 20%;
`;
const FilterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Main = styled.div`
  width: 100%;
  display: flex;
  padding-top: 32px;
`;
const availableCategories = [
  { value: "eating_out", label: "Eating out" },
  { value: "clothes", label: "Clothes" },
  { value: "electronics", label: "Electronics" },
  { value: "groceries", label: "Groceries" },
  { value: "other", label: "Other" },
  { value: "salary", label: "Salary" },
];

const availableTypes = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

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

  const [categories, setCategories] = useState(
    availableCategories.reduce((acc, category) => {
      acc[category.value] = { label: category.label, checked: false };
      return acc;
    }, {})
  );
  const [types, setTypes] = useState(
    availableTypes.reduce((acc, type) => {
      acc[type.value] = { label: type.label, checked: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    setTransactions(data);
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    filterByName(search);
  }, [search]);

  useEffect(() => {
    filterByCategory(categories);
  }, [categories]);

  useEffect(() => {
    filterByType(types);
  }, [types]);

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

  const filterByCategory = () => {
    console.log("filterByCategory");

    // if no checkbox is selected --> original array
    // if some checkbox is checked --> filter

    const checked = Object.keys(categories).filter(
      (cat) => categories[cat].checked
    );

    if (!checked.length) {
      //restore original transactions
      setFilteredTransactions(transactions);
    } else {
      const _filteredTransactions = transactions.filter((transaction) => {
        // console.log("transaction.category", transaction.category);
        // console.log(
        //   " transaction.category === categories[transaction.category]",
        //   transaction.category === categories[transaction.category]
        // );
        // console.log(
        //   "categories[transaction.category]",
        //   categories[transaction.category]
        // );
        return categories[transaction.category].checked;
      });

      setFilteredTransactions(_filteredTransactions);
    }
  };

  const filterByType = () => {
    console.log("filterByType");

    // if no checkbox is selected --> original array
    // if some checkbox is checked --> filter

    const checked = Object.keys(types).filter((type) => types[type].checked);

    if (!checked.length) {
      //restore original transactions
      setFilteredTransactions(transactions);
    } else {
      const _filteredTransactions = transactions.filter((transaction) => {
        return types[transaction.type].checked;
      });
      setFilteredTransactions(_filteredTransactions);
    }
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
      <Main>
        <FiltersContainer>
          <h2>Filters</h2>
          <FilterWrapper>
            <h3>Filter by category</h3>
            {categories &&
              Object.keys(categories).map((category) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={categories[category].checked}
                        onChange={(event) => {
                          // I have to update my state for that category.
                          // should be true if checked
                          console.log("category", category);
                          setCategories({
                            ...categories,
                            [category]: {
                              ...categories[category],
                              checked: event.target.checked,
                            },
                          });
                        }}
                        value={category}
                        color='primary'
                      />
                    }
                    label={categories[category].label}
                  />
                );
              })}
          </FilterWrapper>

          <Divider
            style={{
              margin: "16px 0",
            }}
          />

          <FilterWrapper>
            <h3>Filter by type</h3>
            {categories &&
              Object.keys(types).map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={types[type].checked}
                        onChange={(event) => {
                          // I have to update my state for that type.
                          // should be true if checked
                          console.log("type", type);
                          setTypes({
                            ...types,
                            [type]: {
                              ...types[type],
                              checked: event.target.checked,
                            },
                          });
                        }}
                        value={type}
                        color='primary'
                      />
                    }
                    label={types[type].label}
                  />
                );
              })}
          </FilterWrapper>
        </FiltersContainer>
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
      </Main>
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
