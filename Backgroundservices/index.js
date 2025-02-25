const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { expenseEmail } = require("./EmailService/Expense");

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log("Database is connected successfully.");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Schedule the expense email check to run daily at midnight
const schedule = () => {
    cron.schedule('0 * * * * *', () => { // Runs every day at midnight (00:00)
        console.log('Running expense check task...');
        expenseEmail();
    });
};

schedule();

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Background services are running on port ${PORT}`);
});