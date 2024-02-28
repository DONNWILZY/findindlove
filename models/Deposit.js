const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({

})


const Deposit = mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;