const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { expenseEmail } = require("./EmailService/Expense");

const app = express();
dotenv.config();

mongoose.connect(process.env.DB_CONNECTION).then(()=>{
    console.log("Database is connected successfully.");
}).catch((err)=>{
    console.log(err);
});

const schedule = ()=>{
    cron.schedule('* * * * * *', ()=> {
        expenseEmail();
        console.log('running a task every minute');
    });
};

schedule();

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});