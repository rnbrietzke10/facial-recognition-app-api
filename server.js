const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: process.env.DATABASE_USER_NAME,
    password: process.env.DATABASE_PASSWORD,
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then(data => {
    data;
  });

const app = express();

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB
  bcrypt.compare(
    "1234abc",
    "$2a$10$ncW3ozdZcZ1nIiy4VgAkreUR5JnpPyi/IOVzwNeW.tS93wzLpCwhi",
    (err, res) => {
      // console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$ncW3ozdZcZ1nIiy4VgAkreUR5JnpPyi/IOVzwNeW.tS93wzLpCwhi",
    (err, res) => {
      // console.log("second guess", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.status(200).json(database.users[0]);
  } else {
    res.status(400).json("error loggin in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then(user => res.status(201).json(user[0]))
    .catch(err => res.status(400).json("Unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("Not found");
      }
    })
    .catch(err => res.status(404).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.status(200).json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("No user found with that id");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`);
});
``;
