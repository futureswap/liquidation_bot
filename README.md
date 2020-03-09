# Tyrannosaurus Rekt
* This is a bot that will scan our system for trades that are ready to be liquidated, then liquidate them
* It will store all trades and check either every X min or every time the oracle price changes

## Requierments 
* Docker-compose version 1.24.1 or later

## Run instructions
* add .env with proper configurations (see below)
* docker-compose up
* for more detailed instructions for how to set up an aws ec2 instance see below

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
NETWORK=rinkeby
URL=null
BLOCKSTART=0 
RERUNTIME=180000
GASPRICE=2000000000
ERASE_DATABASE_ON_SYNC=false
TIMEZONE="America/Toronto"
PRUNING=true
```

Network
* the current network the bot should run on 
* rinkeby or homestead

URL
* If you would like to connect to your own http endpoint, default is null (which is Infura)

Blockstart
* Which Block should the bot start recording trades from 

Re Run Time
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

## EC2 setup
* Spin up EC2 instance
* SSH into EC2 instance 
* Run
```
sudo yum update -y
sudo yum install -y docker git
sudo usermod -a -G docker ec2-user
sudo curl -L https://github.com/docker/compose/releases/download/1.26.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
* Clone this repo and add your private key to .env
```
git clone https://github.com/futureswap/liquidation_bot.git
cd liquidation_bot
echo "YOUR_PRIVATE_KEY" > .env
```
* In another terminal start up docker with 
```
sudo dockerd
```

* Go back to original terminal and run 
```
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