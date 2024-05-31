const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const passwordHash = require("password-hash");
const ExpressError = require("../utils/ExpressError");
const Bank = require("../models/bank");
const wrapAsync = require("../utils/wrapAsync");
const { userValidation } = require("../utils/validation");

userRouter.use(express.json());

const validateUser = (req, res, next) => {
  let { error } = userValidation.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

const jwtAuth = (req, res, next) => {
  try {
    let { authorization } = req.headers;
    let result = jwt.verify(authorization, process.env.JWT_PASS);
    req.body.username = result.username;
    next();
  } catch (err) {
    throw new ExpressError(
      403,
      "Not authorised to access this route without correct auth token"
    );
  }
};

userRouter.post(
  "/signup",
  validateUser,
  wrapAsync(async (req, res) => {
    let { name, username, password } = req.body;
    let findUser = await User.findOne({ username: username });
    if (findUser == null) {
      let hashedPassword = passwordHash.generate(password);
      let newUser = new User({
        username: username,
        name: name,
        password: hashedPassword,
      });
      await newUser.save();
      let user = await User.findOne({ username: username });
      let userId = user._id;
      await Bank.create({
        user: userId,
        balance: 1000 + Math.random() * 10000,
      });
      let token = jwt.sign(
        { name: name, username: username },
        process.env.JWT_PASS
      );
      res.send(token);
    } else {
      throw new ExpressError(400, "Username already exists!");
    }
  })
);
userRouter.post(
  "/signin",
  wrapAsync(async (req, res) => {
    let { username, password } = req.body;
    let findUser = await User.findOne({ username: username });
    if (findUser != null) {
      let storedPassword = findUser.password;
      if (passwordHash.verify(password, storedPassword)) {
        let token = jwt.sign(
          {
            name: findUser.name,
            username: findUser.username,
          },
          process.env.JWT_PASS
        );
        res.send(token);
      } else {
        throw new ExpressError(401, "Wrong Password");
      }
    } else {
      throw new ExpressError(404, "Username not found!");
    }
  })
);

userRouter.get(
  "/search",
  jwtAuth,
  wrapAsync(async (req, res) => {
    const { username } = req.body;
    const filter = req.query.filter || "";
    const users = await User.find({
      name: { $regex: filter, $options: "i" },
      username: { $ne: username },
    });
    res.send(users);
  })
);

userRouter.use((err, req, res, next) => {
  let { status = 500, message = "Some error occured..!" } = err;
  res.status(status).send(message);
});

module.exports = userRouter;
