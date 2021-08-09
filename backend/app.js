require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const firebase = require("./config/firebase");

const User = require("./models/User");
const Transaction = require("./models/Transaction");

const decodeToken = require("./middlewares/auth");

const corsOptions = {
  origin: "http://localhost:5001",
};

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => console.log(err));
const app = express();
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const firebaseUser = await firebase.app
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const dbUser = await User.create({
      email,
      firebaseId: firebaseUser.user.uid,
    });
    if (dbUser) {
      res.status(200).json(firebaseUser);
    } else {
      res.status(404).json(dbUser);
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json(err);
  }
});

app.use(decodeToken);
app.get("/transactions", async (req, res) => {
  try {
    const { _id } = await User.findOne({ firebaseId: req.user.uid });
    const transactions = await Transaction.find({ userId: _id });
    res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/transactions", async (req, res) => {
  // console.log("req.body", req.user);
  try {
    const user = await User.findOne({ firebaseId: req.user.uid });
    // console.log("user", user);
    if (user) {
      const { name, date, amount, category, type } = req.body;

      const newTransaction = {
        name,
        date,
        amount,
        category,
        type,
        userId: user._id,
      };
      const createdTransaction = await Transaction.create(newTransaction);
      console.log("create", createdTransaction);
      res.status(201).json(createdTransaction);
    } else {
      res.status(401).json({ message: "Wrong user" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.put("/transactions/:id", async (req, res) => {
  // console.log("req.body", req.body);
  const { id } = req.params;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (updatedTransaction) {
      res.status(200).json(updatedTransaction);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.delete("/transactions/:id", (req, res) => {
  // console.log("req.params", req.params);
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (deletedTransaction) {
      res.status(200).json(deletedTransaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.listen(process.env.PORT || 3001, () =>
  console.log(`Server listening on port ${process.env.PORT}!`)
);
