const express = require('express');
const router = express.Router();
const moment = require('moment');
const Expense = require('../models/Expense');

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

// const expense = require('./expenses.json');
//     expense.forEach(e => {
//         let exp = new Expense ({
//             name: e.item,
//             amount: e.amount,
//             date: e.date,
//             group: e.group
//         });

//         exp.save();
//     })


router.get('/expenses', function (req, res) {
    let d1;
    req.query.d1 ? d1 = moment(req.query.d1).format('LLLL') : d1 = 0;
    const d2 = moment(req.query.d2).format('LLLL'); //if d2 is not declared, it will automaticly become moment().
    Expense.find({date: {"$lt": d2, "$gt": d1}}).sort({date: -1}).exec(function(err, exp) {
        res.send(exp);
    })
})

router.post('/expense', function(req, res) {
    console.log('updating data');
    const newExp = req.body;
    const exp = new Expense({
        name: newExp.name,
        amount: newExp.amount,
        group: newExp.group,
    })
    newExp.date ? exp.date = moment(newExp.date).format('LLLL') : exp.date = moment().format('LLLL');
    exp.save().then(function(data) {
        console.log(`A new expence with the amount of ${data.amount} was paid for ${data.group}.`);
    });
    res.end();
})

router.put('/update/:group1/:group2', function(req, res) {
    Expense.findOneAndUpdate({group: req.params.group1}, {$set: {group: req.params.group2}}, function(err, exp) {
        res.send(`The group of ${exp.name} was changed to ${req.params.group2}`);
    });
})

router.get('/expenses/:group/:total', function (req, res) {
    if (req.params.total === 'true') {
        Expense.aggregate([
            {$match: {group: req.params.group}}, 
            {$group: {_id: null, amount: {$sum: "$amount"}}}], function(err, result) {
            res.send({"total-expenses": result[0].amount});
        })
    }
    else {
        Expense.find({group: req.params.group}).sort({date: -1}).exec(function(err, exp) {
            res.send(exp);
        })
    }
})

module.exports = router;