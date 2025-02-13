const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const expenseRoute = require("./routes/expense");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/expenses", expenseRoute);

// DB Connection
mongoose.connect(process.env.DB_CONNECTION).then(() => {
  console.log("DB Connected Successfully");
}).catch((err) => {
  console.log(err);
});

app.listen(process.env.PORT, () => {    
  console.log(`Server is runnig on port ${process.env.PORT}`);
});