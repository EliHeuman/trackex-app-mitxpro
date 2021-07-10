const express = require("express");
const app = express();
const low = require("lowdb");
const lodashId = require("lodash-id");

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db._.mixin(lodashId);
// Set some defaults
db.defaults({ transactions: [] }).write();

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

  db.get("transactions").insert(newTransaction).write();

  res.status(201).json(db.get("transactions").value());
});

app.put("/transactions/:id", (req, res) => {
  // console.log("req.body", req.body);
  const { name, date, amount, category, type } = req.body;
  const { id } = req.params;
  const updatedTransaction = db
    .get("transactions")
    .updateById(id, {
      ...req.body,
      updated_at: new Date(),
    })
    .value();
  if (updatedTransaction) {
    res.status(200).json(db.get("transactions").value());
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
app.listen(3001, () => console.log("Server listening on port 3001! "));
