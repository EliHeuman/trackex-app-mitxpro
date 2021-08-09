const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const firebaseApp = require("./config/firebase");
const User = require("./models/User");

const corsOptions = {
  origin: "http://localhost:5001",
};

mongoose
  .connect("mongodb://localhost:27018/trackex-app", {
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

app.get("/transactions", (req, res) => {
  // make sure our server is answering
  // res.send("<h1>Hello from the Server</h1>");
  const transactions = db.get("transactions").value();
  res.status(200).json(transactions);
});

app.post("/transactions", (req, res) => {
  // console.log("req.body", req.body);
  const { name, date, amount, category, type } = req.body;
  const newTransaction = {
    name,
    date,
    amount,
    category,
    type,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const created = db.get("transactions").insert(newTransaction).write();
  // console.log("create", created);
  res.status(201).json(created);
});

app.put("/transactions/:id", (req, res) => {
  // console.log("req.body", req.body);
  const { id } = req.params;
  const updatedTransaction = db
    .get("transactions")
    .updateById(id, {
      ...req.body,
      updated_at: new Date(),
    })
    .value();
  if (updatedTransaction) {
    res.status(200).json(updatedTransaction);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
});

app.delete("/transactions/:id", (req, res) => {
  // console.log("req.params", req.params);
  const { id } = req.params;
  const deletedTransaction = db.get("transactions").removeById(id).write();
  if (deletedTransaction) {
    res.status(200).json(deletedTransaction);
  } else {
    console.log("deletedTransaction", deletedTransaction);
    res.status(404).json({ message: "Resource not found" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const firebaseUser = await firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const dbUser = await User.create({ email, firebaseId: firebaseUser.uid });
    if (dbUser) {
      res.status(200).json(firebaseUser);
    } else {
      res.status(404).json(dbUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
app.listen(3001, () => console.log("Server listening on port 3001! "));
