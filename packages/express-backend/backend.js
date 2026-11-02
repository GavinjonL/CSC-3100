import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userService
    .getUsers(name, job)
    .then((users) => res.send({ users_list: users }))
    .catch((error) => {
      console.log(error);
    });
});

app.get("/users/search", (req, res) => {
  const { name, job } = req.query;
  userService
    .getUsers(name, job)
    .then((users) => res.send(users))
    .catch((error) => {
      console.error(error);
    });
});

app.get("/users/:id", (req, res) => {
  userService.findUserById(req.params.id).then((user) => {
    if (!user) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(user);
    }
  });
});

app.post("/users", (req, res) => {
  userService.addUser(req.body).then((user) => {
    res.status(201).send(user);
  });
});

app.delete("/users/:id", (req, res) => {
  userService
    .removeUser(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
