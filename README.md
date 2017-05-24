# lisk_broadcast
broadcast a tx on lisk network


sudo apt-get update

sudo apt-get install nodejs

sudo apt-get install npm

npm install liskjs


testnet:

var=$(node lskt.js 15395643725490872504L 10 "passphrase")

curl -k -H "Content-Type: applicversion: 0.8.0" -H "port: 1" -H 'nethash: da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba' -X POST -d '{"transaction":'$var'}' https://testnet.lisk.io/peer/transactions/



mainnet:

var=$(node lskm.js 15395643725490872504L 10 "passphrase")

curl -k -H "Content-Type: application/json" -H "version: 0.8.0" -H "port: 1" -H 'nethash: ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511' -X POST -d '{"transaction":'$var'}' https://liskworld.info/peer/transactions/



