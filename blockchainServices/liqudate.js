const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const ethers = require('ethers');
const {fetch} = require('./fetch');
const {chainlinkAbi} =  require("./chainlinkInstance")
const {chainlinkAddress} =  require("./getChainlinkAddress")
const {logger} = require('./logging')
const {GASPRICE, TIMEZONE} = require("../src/config/configurations")
const {post} = require('./post');
const moment = require('moment-timezone');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const bot_room_IDs = [];


const liquidationCheck = async (currentPrice) => {
    logger.log('info',  `Liquidation check at ${moment().tz(TIMEZONE).format()}`)
    const dataBaseData = await fetch()
    if (!currentPrice) {
        const address = await chainlinkAddress()
        const chainlink = new ethers.Contract(address, chainlinkAbi, provider);
        currentPrice = await chainlink.latestAnswer()
        currentPrice = Number(currentPrice) * 10000000000
    }
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    let nonce = await wallet.getTransactionCount("pending")
    let n = 0
    let i = 0
    for (i; i < dataBaseData.length; i++) { 
        if (!dataBaseData[i].isClosed) {
            const contract = new ethers.Contract(dataBaseData[i].exchangeAddress, abi, provider);
            let liquidationPrice
            try {
             liquidationPrice = await contract.getLiquidationPrice(dataBaseData[i].tradeId)
            } catch (e) {
                checkTradeIsClose(dataBaseData[i].tradeId, contract)
            }
            if (dataBaseData[i].isLong) {
                if (Number(liquidationPrice) > currentPrice) {
                    nonce = nonce + n
                    n++
                    await liquidateTransaction(dataBaseData[i].tradeId, dataBaseData[i].exchangeAddress, wallet, nonce)
                    } 
               } else {
                    if (Number(liquidationPrice) < currentPrice ) {
                        nonce = nonce + n
                        n++
                        await liquidateTransaction(dataBaseData[i].tradeId, dataBaseData[i].exchangeAddress, wallet, nonce)
                    }
                }
            } else {
            }
        }
}

const liquidateTransaction = async (tradeId, exchangeAddress, wallet, nonce) => {
    const contract = new ethers.Contract(exchangeAddress, abi, provider);
    const method = contract.connect(wallet);
    let liquidateTrade
    try {
        liquidateTrade = await method.liquidateTrade(tradeId, {
        nonce,
        gasPrice: ethers.utils.bigNumberify(GASPRICE)
    })
    } catch (e) {
        checkTradeIsClose(tradeId, contract)
    }
    logger.log('info',  {tradeId, liquidateTrade})
}

const checkTradeIsClose = async (tradeId, contract) => {
    const tradeInfo = await contract.tradeIdToTrade(tradeId)
    if (!tradeId.isClosed && tradeInfo[6].toString() === "0") {
        const obj =   {
                tradeId: tradeId.toString(),
                isClosed: true,
                isLong: true, 
                liquidationPrice: "0",
                block: "0",
                exchangeAddress: contract.address
            }
        post(obj, "remove")
        logger.log('info',  {message: `tradeId: ${tradeId} closed`,})
        
        sendMessage(tradeId.toString());
    }
}

const sendMessage = async (tradeId) => {
    if (tradeId !== undefined) {
        bot_room_IDs.forEach((ID) => {
            bot.sendMessage(ID, 'BOOOM You just rekd someone! Trade ID: ' + tradeId);
        })
    }
}

bot.on('message', (msg) => {
    if (!bot_room_IDs.includes(msg.chat.id)) {
        bot_room_IDs.push(msg.chat.id);
        bot.sendMessage(msg.chat.id, 'subscribed');
    } else {
        bot.sendMessage(msg.chat.id, 'already subscribed');
    }
});

module.exports = {
    liquidationCheck
}