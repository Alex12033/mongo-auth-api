require("dotenv").config();

const bodyParser = require("body-parser");

const cors = require("cors");

const express = require("express");

const app = express();

const mongoose = require("mongoose");

const Register = require("./models/register.js");

//db connect
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("mongoose connect error", err);
  });

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

//test route
app.get("/", (req, res) => {
  res.send("BBBB BBBBB BBBBB BBBBB");
});

// check user
app.post("/isLogin", async (req, res) => {
  //we search user in db
  const fromRegistr = await Register.findOne({
    username: req.body.username,
    password: req.body.password,
  }).then(function (user) {
    console.log(user, "user from DB");
    if (user !== null) {
      //user exists and send user on client
      res.json({ user: user, registered: true });

      return;
    }

    //user not found and send this info on client
    res.json({ user: false, registered: false });
  });
  //check was user created
  console.log(fromRegistr, "user from DB");
  console.log(req.body.username);
  console.log(req.body.password);
});

app.post("/register", async (req, res) => {
  //create and save user in mongo
  const registr = await Register.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  console.log(registr);

  await registr
    .save()
    .then((item) => {
      res.sendStatus(200);

      console.log(item, "item saved to database");
    })
    .catch((err) => {
      res.sendStatus(400);

      console.log(err, "unable to save to database");
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runing on port ${process.env.PORT}`);
});
