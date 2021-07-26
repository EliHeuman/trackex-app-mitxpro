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
import { transactionsAPI } from "../../../services/transactions";

import { TrackexContext } from "../../../trackexContext";

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
  { value: "eating_out", label: "Eating out", id: 1 },
  { value: "clothes", label: "Clothes", id: 2 },
  { value: "electronics", label: "Electronics", id: 3 },
  { value: "groceries", label: "Groceries", id: 4 },
  { value: "salary", label: "Salary", id: 5 },
];

const availableTypes = [
  { value: "expense", label: "Expense", id: 1 },
  { value: "income", label: "Income", id: 2 },
];

const AVAILABLE_MODES = {
  add: "add",
  edit: "edit",
};
const emptyFormInitialValues = {
  name: "t-shirt",
  amount: 33,
  date: "2021-06-08",
  category: "clothes",
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

  const ctx = React.useContext(TrackexContext);

  const [categories, setCategories] = useState({});
  const [types, setTypes] = useState({});

  // console.log("types LIST", types);
  // console.log("categories LIST", categories);

  useEffect(() => {
    setCategories(
      ctx.categories.reduce((acc, category) => {
        acc[category.value] = {
          label: category.label,
          checked: false,
        };
        return acc;
      }, {})
    );
    setTypes(
      ctx.types.reduce((acc, type) => {
        acc[type.value] = {
          label: type.label,
          checked: false,
        };
        return acc;
      }, {})
    );
  }, [ctx]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const { data, status } = await transactionsAPI.all();
        if (status === 200) {
          setTransactions(data);
        }
      } catch (e) {
        console.log("error", e);
      }
    };
    getTransactions();
  }, [ctx]);

  useEffect(() => {
    transactions && setFilteredTransactions(transactions);
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
    setTransaction({
      ...transaction,
      category: transaction.category.value,
      type: transaction.type.value,
    });
    setOpenDrawer(true);
  };
  const handleSubmit = (values) => {
    console.log("values", values);
    mode === AVAILABLE_MODES.add
      ? addTransaction(values)
      : editTransaction(values);

    setOpenDrawer(!openDrawer);
  };

  const addTransaction = async (transaction) => {
    try {
      const { data, status } = await transactionsAPI.create(transaction);

      if (status === 201) {
        setTransactions([...transactions, { ...data }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editTransaction = async (transaction) => {
    try {
      const { data, status } = await transactionsAPI.update(transaction);
      if (status === 200) {
        const _transactionIndex = transactions.findIndex(
          (transaction) => transaction.id === data.id
        );
        const _transactions = [...transactions];
        _transactions[_transactionIndex] = data;

        setTransactions(_transactions);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTransaction = async () => {
    console.log("delete", transaction);
    try {
      const { status } = await transactionsAPI.delete(transaction.id);

      if (status === 200) {
        const _transactions = [...transactions].filter(
          ({ id }) => id !== transaction.id
        );
        console.log(_transactions);
        setTransactions(_transactions);
        setOpenDeleteDialog(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filterByName = (query) => {
    // console.log("filteredTransactions", filteredTransactions);
    const _filteredTransactions = transactions.filter((transaction) => {
      return transaction.name.toLowerCase().includes(query.toLowerCase());
    });
    // console.log("_filteredTransactions", _filteredTransactions);
    setFilteredTransactions(_filteredTransactions);
  };

  const filterByCategory = () => {
    // if no checkbox is selected --> original array
    // if some checkbox is checked --> filter

    /*First we filter in our categories state object to get the properties that we want to filter by.
    Remember that our object looks this way:
    { 
      eating_out: {label: "Eating out", checked: true},
      clothes: {label: "Eating out", checked: false},
    }
    By filtering only those where checked: true, we can know if the user selected any checkbox and react to that
    */
    const checked = Object.keys(categories).filter(
      (cat) => categories[cat].checked
    );

    // We distinguish two cases:

    if (!checked.length) {
      // - If we don't have any checkboxes selected, we set our transactions state object to its original value
      // This is important because we need a way to go back to the initial state after the user has been filtering
      //restore original transactions
      setFilteredTransactions(transactions);
    } else {
      // - If we have some checkboxes selected, we filter by that category
      const _filteredTransactions = transactions.filter((transaction) => {
        return categories[transaction.category.value].checked;
      });
      // and update our filteredTransactions state object
      setFilteredTransactions(_filteredTransactions);
    }
  };

  const filterByType = () => {
    const checked = Object.keys(types).filter((type) => types[type].checked);

    if (!checked.length) {
      //restore original transactions
      setFilteredTransactions(transactions);
    } else {
      const _filteredTransactions = transactions.filter((transaction) => {
        return types[transaction.type.value].checked;
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
            // check Input docs for more options about how to include adornments
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
            fullWidth
            onInput={(event) => {
              console.log("search", event.target.value);
              // Since setSearch is async, we are not sure how long it will take
              // therefore we can't be sure about
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
              // since categories is an object, we want to iterate through its keys
              Object.keys(categories).map((category) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={categories[category].checked}
                        onChange={(event) => {
                          // We need to keep track of the new state every time a checkbox changes

                          const newCategoriesState = {
                            ...categories, // make a copy of all the categories atm
                            [category]: {
                              // we want to replace the checked category
                              ...categories[category], // we keep every property
                              checked: event.target.checked, // we overwrite checked
                            },
                          };
                          // we update the categories state object
                          setCategories(newCategoriesState);
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
                      <TableCell>{transaction.category?.label}</TableCell>
                      <TableCell>
                        <Amount type={transaction.type?.value}>
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
                    {Array.from(new Array(4)).map(() => (
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
