const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const bankRouter = require("./routes/bankRoutes");
require("dotenv").config();

app.use(express.json());
app.use(cors());

async function main() {
  mongoose.connect(process.env.MONGO_URI);
}
main()
  .then((res) => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Server home page!");
});
app.use("/users", userRouter);
app.use("/bank", bankRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port: ${process.env.PORT || 8080}`);
});
