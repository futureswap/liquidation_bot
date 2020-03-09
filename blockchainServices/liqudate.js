const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const ethers = require('ethers');
const {fetch} = require('./fetch');
const {chainlinkAbi} =  require("./chainlinkInstance")
const {chainlinkAddress} =  require("./Addresses")
const {logger} = require('./logging')
const {GASPRICE} = require("../src/config/configurations")
const {post} = require('./post');



const liquidationCheck = async (currentPrice) => {
    logger.log('info',  `Liquidation check at ${Date.now()}`)
    const dataBaseData = await fetch()
    if (!currentPrice) {
        const chainlink = new ethers.Contract(chainlinkAddress, chainlinkAbi, provider);
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
            post(obj)
            logger.log('info',  {message: `tradeId: ${tradeId} closed`,})
    }
}

module.exports = {
    liquidationCheck
}