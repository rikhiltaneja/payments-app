const express = require("express");
const bankRouter = express.Router();
require("dotenv").config();
const ExpressError = require("../utils/ExpressError");
const Bank = require("../models/bank");
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

bankRouter.use(express.json());

const jwtAuth = (req, res, next) => {
  try {
    let { authorization } = req.headers;
    let result = jwt.verify(authorization, process.env.JWT_PASS);
    req.body.from = result.username;
    next();
  } catch (err) {
    throw new ExpressError(
      403,
      "Not authorised to access this route without correct auth token"
    );
  }
};

bankRouter.get(
  "/balance",
  jwtAuth,
  wrapAsync(async (req, res) => {
    const user = await User.findOne({ username: req.body.from });
    if (user != null) {
      const balance = await Bank.findOne({ user: user._id });
      res.json({ balance: balance.balance });
    } else {
      throw new ExpressError(404, "User not found!");
    }
  })
);

bankRouter.post(
  "/transfer",
  jwtAuth,
  wrapAsync(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { from, amount, to } = req.body;
    const fromPerson = await User.findOne({ username: from });
    const fromAccount = await Bank.findOne({ user: fromPerson._id }).session(
      session
    );
    if (!fromAccount || fromAccount.balance < amount) {
      await session.abortTransaction();
      throw new ExpressError(400, "Insufficent balance");
    }
    const toAccount = await Bank.findOne({ user: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      throw new ExpressError(404, "To Account not found or server error!");
    }
    await Bank.findOneAndUpdate(
      { user: fromPerson._id },
      { $inc: { balance: -amount } }
    ).session(session);
    await Bank.updateOne({ user: to }, { $inc: { balance: amount } }).session(
      session
    );
    await session.commitTransaction();
    res.send("Transaction Successful!");
  })
);

bankRouter.use((err, req, res, next) => {
  let { status = 500, message = "Some error occured..!" } = err;
  res.status(status).send(message);
});

module.exports = bankRouter;
