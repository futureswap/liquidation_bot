# Tyrannosaurus Rekt
* This is a bot that will scan our system for trades that are ready to be liquidated, then liquidate them
* It will store all trades and check either every X min or every time the oracle price changes

## Requirements 
* Docker-compose version 1.24.1 or later

## Run instructions
* Add .env with proper configurations (see below)
* `docker-compose up`
* For more detailed instructions for how to set up an AWS EC2 instance, see below

## Private Key 
* Your private key is stored in a .env file 
* You must create this file and add your private key
* The bot will not start without it
```
PRIVATE_KEY=<your private key>
```
* Make sure account has ether to cover gas
* Do not use this account elsewhere!
* Best practice -> This key is not needed after the bot is running so after you run docker-compose up and the bot is working, remove the private key from the .env file
* To change your PRIVATE_KEY, change the .env file, then run
```
$ docker-compose build --no-cache
```

## Configurations
* All configuration is done in /src/config/configurations.js file
* These are the defaults
## 
```
NETWORK=homestead
URL=null
BLOCKSTART=0 
RERUNTIME=180000
GASPRICE=20000000000
ERASE_DATABASE_ON_SYNC=false
TIMEZONE="America/Toronto"
PRUNING=true
EXCHANGE_ADDRESSES =  ["0x4B757b12659c5f364C2d05c08165D2EB45F4Cf5C"]
```

Network
* the current network the bot should run on 
* rinkeby or homestead

URL
* If you would like to connect to your own http endpoint, default is null (which is Infura)

Blockstart
* Which Block should the bot start recording trades from 

Re-Run Time
* The time in MS you want to rescan the trades for liquidation
* null would be no re runs 
* This will not affect scanning after Chainlink update

Gas Price 
* The gas price you send your tx through with (in wei)
* Higher price: higher transaction cost, but faster it will go through

Erase Databse on Sync
* If true will erase database everytime you update your code or restart server 

Timezone 
* desired timezone for logging
* see /src/timezones/timezones for available timezones

Pruning
* If the database removes the closed trades

Exchange Addresses 
* addresses of the exchanges to target (currently only works on one exchange) 

## EC2 setup
* Spin up EC2 instance
* SSH into EC2 instance 
* to get docker compose follow this 
https://gist.github.com/npearce/6f3c7826c7499587f00957fee62f8ee9

* Clone this repo and add your private key to .env
```
git clone https://github.com/futureswap/liquidation_bot.git
cd liquidation_bot
```
follow the steps above to add your private key

```
docker-compose build

docker-compose up 
```

If you exit out of your instance, the Docker container will still be running. To see the logs, cd into liquidation_bot and run 
```
docker-compose logs --follow --tail 20 api
```
* to View your database, exec into your docker instances
```
docker-compose exec postgres psql -U postgres postgres
```
```
 SELECT * FROM trades;
 ```

## Terraform setup

To deploy this bot and the other Futureswap bots using Terraform on DigitalOcean, see [this repo](https://github.com/jonpurdy/fsbot_terraform). AWS support coming in the future.
