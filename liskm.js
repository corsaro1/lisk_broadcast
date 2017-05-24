var lisk = require ('lisk-js');

var LSK = lisk.api({testnet: false});

var address = process.argv[2]
var amountx = process.argv[3]
var secret = process.argv[4]
    var amount      = amountx * Math.pow(10, 8);
    var transaction = lisk.transaction.createTransaction(address, amount, secret);
    console.log("%j", transaction);
    
