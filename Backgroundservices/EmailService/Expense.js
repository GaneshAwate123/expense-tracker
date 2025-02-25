const dotenv = require("dotenv");
const sendMail = require("../helpers/sendMail");
const Expense = require("../model/Expense");

dotenv.config();

const expenseEmail = async () => {
    try {
        // Fetch all expenses from the database
        const expenses = await Expense.find();
        const totalExpense = expenses.reduce((acc, expense) => acc + expense.value, 0);

        if (totalExpense > 10000) {
            let messageOption = {
                to: process.env.ADMIN_EMAIL,
                subject: "Warning: High Expenses Alert",
                text: `Your total expense is $${totalExpense}. Please review your expenses immediately.`
            };

            await sendMail(messageOption);
            console.log("Email sent for high expenses.");
        } else {
            console.log("Total expenses are within limit:", totalExpense);
        }
    } catch (error) {
        console.error("Error in expenseEmail:", error);
    }
};

module.exports = {
    expenseEmail,
};