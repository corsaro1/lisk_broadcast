var readlineSync = require('readline-sync');
var request = require("request")
var lisk = require ('lisk-js');
var XMLHttpRequest = require('xhr2');
var url = "https://node01.lisk.io" // do not put "/" at the end
var pubkey = "c31e2ed75471c87617f5ca3264976045b802bd016ac5008cfd2d40b1a1375b19"

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

request({
    url: url+"/api/multisignatures/pending?publicKey="+pubkey,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
       //console.log(body) // Print the json response
    }


var myObj, i, x = "";
myObj = (body);


console.log("tx to be signed: "+(myObj.transactions).length);

if ((myObj.transactions).length == "0")  {
       console.log("no tx to sign - exiting")
process.exit(-1);
    }


sleep(2000);


var seed = readlineSync.question('What is your seed? ', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});



for (i = 0; i < (myObj.transactions).length; i++) {
  
console.log(myObj.transactions[i].transaction.id);

var data = lisk.multisignature.signTransaction((myObj.transactions[i].transaction),
seed);
var xhr = new XMLHttpRequest();
var urlx = url+"/peer/signatures/";
xhr.open("POST", urlx, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("version", "0.9.15");
xhr.setRequestHeader("port", "1");
xhr.setRequestHeader('nethash', 'ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511');
xhr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
   var response = JSON.stringify(this.responseText);
   console.log(response);
}

};




xhr.send(JSON.stringify({
signature: {
  signature: data,
  transaction: myObj.transactions[i].transaction.id
}}));


};


}); 

