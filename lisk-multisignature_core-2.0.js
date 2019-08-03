/*
setup:
sudo apt-get update
curl -sL  https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
npm i readline-sync
npm i sync-request
npm i lisk-elements
edit inside this file:
nethash (for testnet or mainnet), url (for testnet or mainnet) and pubkey
optional:
nano ~/node_modules/http-response-object/lib/index.js  ## comment at line 51 throw.error wit "//" like follows.
//  throw.error
usage:
node lisk-multisignature_core-2.0.js
*/
var readlineSync = require('readline-sync');
var request = require("sync-request");
var lisk = require('lisk-elements');

// **** TESTNET OR MAINNET ****
var network = 'mainnet';

var nethash = "ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511"; // mainnet

if (network == 'testnet')
    var nethash = "da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba"; // testnet


// **** PUT HERE THE PUBKEY OF THE MULTISIGNATURE ADDRESS ****
//var pubkey = "15b50402822a1ecc3d8f17ccae407858078a21ca940cfa919ec42ed50c4e612f"; // my own 1
//var pubkey = "c56ff6d8c3a4e826c2136e50a4ff1c0f51cc85ec7b05b8c1810c4070cce17a47"; // my own 2
var pubkey = "380b952cd92f11257b71cce73f51df5e0a258e54f60bb82bccd2ba8b4dff2ec9" // gdtpool


// **** URL FOR TESTNET OR MAINNET ****
var url = null;

var urls = [
    "https://wallet.mylisk.com",
    "https://www.hmachadowallet.com",
    "https://lisk-api.punkrock.me",
    "https://lisk-login.vipertkd.com",
    "https://wallet.lisknode.io",
    "https://lisknode.grumlin.com",
    "https://liskworld.info"
];

var node = readlineSync.question('Type a number from 1 to 7 to choose a node and press enter (default 1) : ', {
    hideEchoBack: false // The typed text on screen is hidden by `*` (default).
});

if (node > 0 && node < 8)
    url = urls[node-1];
else
    url = urls[0];


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


res = request('GET', url + "/api/node/transactions/pending?offset=0&limit=100");


var myObj2, m, x = 0;
myObj2 = JSON.parse(res.getBody('utf8'));


//console.log("total of unsigned tx on node "+myObj2.meta.count);

if (myObj2.meta.count == "0") {
    console.log("no tx to sign - exiting")
    process.exit(0);
}


for (m = 0; m < (myObj2.meta.count); m += 100) {
    var myObj, i;
    
    res = request('GET', url + "/api/node/transactions/pending?offset=" + (m) + "&limit=100");
    myObj = JSON.parse(res.getBody('utf8'));

    for (i = 0; i < (myObj.data).length; i++) {
        const userStr = JSON.stringify(myObj.data[i]);
        if ((userStr).includes(pubkey)) {
            x += 1;
        }
    }
}

if (x == "0") {
    console.log("no tx to sign, belonging to the given pubkey - exiting")
    process.exit(0);
}

console.log(x + " tx to be signed, belonging to the given pubkey ");
var seed = readlineSync.question('What is your seed? ', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
});


for (m = 0; m < (myObj2.meta.count); m += 100) {
    var myObj, i, x = "";
    
    res2 = request('GET', url + "/api/node/transactions/pending?offset=" + (m) + "&limit=100");
    myObj = JSON.parse(res2.getBody('utf8'));
    
    for (i = 0; i < (myObj.data).length; i++) {
        const userStr = JSON.stringify(myObj.data[i]);
        
        if ((userStr).includes(pubkey)) {
            var transaction = lisk.transaction.createSignatureObject((myObj.data[i]),
                seed);

            var headers = {
                'Content-type': 'application/json',
                'version': '0.9.15',
                'port': '1',
                'nethash': nethash
            };
            var data = JSON.stringify(transaction);
            var json_obj = JSON.parse(data);

            id = ((myObj.data[i].id));

            //sleep(200);   // to not flood too much the node

            var res = request('POST', url + "/api/signatures/", {
                json: json_obj,
                headers: headers
            });


            try {
                var reply = JSON.stringify(res.getBody('utf8'));

                if (reply.includes("true")) {
                    console.log(id + " Signed");
                }

                if (reply.includes("Transaction not found")) {
                    console.log(id + " Transaction not found");
                }

                if (reply.includes("already present in transaction")) {
                    console.log(id + " Signature already exists");
                }

                if (reply.includes("is not a member for account")) {
                    console.log(id + " Failed to verify signature");
                }

            } catch (err) {
                //Block of code to handle errors
                if (res.statusCode == 200) {
                    console.log(id + " Signed");
                }

                if (res.statusCode == 409) {
                    console.log(id + " Failed");
                }
            }
        };
    };
};
