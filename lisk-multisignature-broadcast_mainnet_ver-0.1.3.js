/*
setup:
wget https://raw.githubusercontent.com/corsaro1/lisk_broadcast/master/lisk-multisignature-broadcast_mainnet_ver-0.1.3.js
sudo apt-get update
sudo apt-get install nodejs
npm i readline-sync
npm i sync-request
npm i lisk-js

edit inside this file:
pubkey, nethash and url.

usage:
node lisk-multisignature-broadcast_mainnet_ver-0.1.3.js

*/


var readlineSync = require('readline-sync');
var request = require("sync-request")
var lisk = require ('lisk-js');


var url = "https://node01.lisk.io" // do not put "/" at the end"    ***  default node

var url1 = "https://node01.lisk.io" // do not put "/" at the end
var url2 = "https://node02.lisk.io" // do not put "/" at the end
var url3 = "https://node03.lisk.io" // do not put "/" at the end
var url4 = "https://node04.lisk.io" // do not put "/" at the end
var url5 = "https://node05.lisk.io" // do not put "/" at the end
var url6 = "https://node06.lisk.io" // do not put "/" at the end
var url7 = "https://node07.lisk.io" // do not put "/" at the end
var url8 = "https://node08.lisk.io" // do not put "/" at the end
var url9 = "https://wallet.lisknode.io" // do not put "/" at the end
var url10 = "https://liskworld.info" // do not put "/" at the end


var node = readlineSync.question('Type a number from 1 to 16 to choose a node and press enter (default 1) : ', {
  hideEchoBack: false // The typed text on screen is hidden by `*` (default).
});

if (node == 1) {
url = url1
}

if (node == 2) {
url = url2
}

if (node == 3) {
url = url3
}

if (node == 4) {
url = url4
}

if (node == 5) {
url = url5
}

if (node == 6) {
url = url6
}

if (node == 7) {
url = url7
}

if (node == 8) {
url = url8
}

if (node == 9) {
url = url9
}

if (node == 10) {
url = url10
}



process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var pubkey = "380b952cd92f11257b71cce73f51df5e0a258e54f60bb82bccd2ba8b4dff2ec9" // gdtpool

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}



res = request('GET', url+"/api/multisignatures/pending?publicKey="+pubkey);


var myObj, i, x = "";
myObj = JSON.parse(res.getBody('utf8'));


console.log("tx to be signed: "+(myObj.transactions).length);

if ((myObj.transactions).length == "0")  {
       console.log("no tx to sign - exiting")
process.exit(0);
    }


sleep(1000);


var seed = readlineSync.question('What is your seed? ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});



for (i = 0; i < (myObj.transactions).length; i++) {
  
console.log(myObj.transactions[i].transaction.id);

var data = lisk.multisignature.signTransaction((myObj.transactions[i].transaction),
seed);



var headers = {'Content-type': 'application/json', 'version': '0.9.15','port': '1','nethash': 'ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511'};
var data = JSON.stringify({
signature: {
  signature: data,
  transaction: myObj.transactions[i].transaction.id
}})
//console.log(data);


var json_obj = JSON.parse(data);

var res = request('POST', url+"/peer/signatures/", {
  json: json_obj, headers: headers
});



if (res.statusCode == 200)
{
console.log(res.getBody('utf8'));
}

if (res.statusCode == 500)
{
console.log("error");
}


};


 

