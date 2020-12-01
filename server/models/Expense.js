const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSChema = new Schema({
    name: String,
    amount: Number,
    date: Date,
    group: String
})

const Expense = mongoose.model("Expense", expenseSChema);
module.exports = Expense;