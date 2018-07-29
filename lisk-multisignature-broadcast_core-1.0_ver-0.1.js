var readlineSync = require('readline-sync');
var request = require("request");
var lisk = require ('lisk-elements');
var XMLHttpRequest = require('xhr2');
var ulry = "https://testnet.lisk.io:7000";    // do not put "/" at the end
var pubkey = "15b50402822a1ecc3d8f17ccae407858078a21ca940cfa919ec42ed50c4e612f";
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}



var url = ulry+"/api/node/transactions/unsigned?offset=0&limit=100"
request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {

    }



var myObj2, m, y = "";
myObj2 = (body);

console.log("tx to be signed: "+myObj2.meta.count); 

if (myObj2.meta.count == "0") {
       console.log("no tx to sign - exiting") 
process.exit(-1); 
 }

var seed = readlineSync.question('What is your seed? ', {
     hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});




for (m = 0; m < (myObj2.meta.count); m+=100) {

var url2 = ulry+"/api/node/transactions/unsigned?offset="+(m)+"&limit=100";


request({
    url: url2,
    json: true
}, function (error2, response2, body2) {

    if (!error2 && response2.statusCode === 200) {

    }







var myObj, i, x = "";
myObj = (body2);


for (i = 0; i < (myObj.data).length; i++) {


const userStr = JSON.stringify(myObj.data[i]);

if ((userStr).includes(pubkey)) {

console.log((myObj.data[i].id));

var transaction = lisk.transaction.createSignatureObject((myObj.data[i]),
    seed);

var xhr = new XMLHttpRequest();
var url = ulry+"/api/signatures/";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("version", "0.9.15");
xhr.setRequestHeader("port", "1");
xhr.setRequestHeader('nethash', 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba');
xhr.onreadystatechange = function () {

  if (this.readyState == 4 && this.status == 409) {
   var response = JSON.stringify(this.responseText);



if ((this.responseText).includes("Transaction not found"))
{
console.log("Transaction not found");
}

if ((this.responseText).includes("Signature already exists"))
{
console.log("Signature already exists");
}


   if ((this.responseText).includes("Failed to verify signature"))
{
console.log("Failed to verify signature");
}



}

  if (this.readyState == 4 && this.status == 200) {
   var response = JSON.stringify(this.responseText);

   console.log("Signed");
}


}; 

var data = JSON.stringify(transaction);
xhr.send(data);

} 




}; 



}); 

}; 




}); 

