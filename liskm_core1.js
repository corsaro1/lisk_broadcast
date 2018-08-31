var lisk = require ('lisk-elements');
var readlineSync = require('readline-sync');


var address = process.argv[3]
var amountx = process.argv[2]
var secret = readlineSync.question('Type your secret : ', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});

var secondsecret = readlineSync.question('Type your second secret (if any); default null : ', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});
if (secondsecret == "") {secondsecret = null};
    var amount      = amountx * Math.pow(10, 8);
    var transaction = lisk.transaction.transfer({
    amount: amount,
    recipientId: address,
    data: null,
    passphrase: secret,
    secondPassphrase: secondsecret,
});
    console.log("%j", transaction);
	console.log("\n");	
    const client = lisk.APIClient.createMainnetAPIClient();


client.transactions.broadcast(transaction)
        .then(console.info)
        .catch(console.error);
        
  
     
