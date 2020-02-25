const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const ethers = require('ethers');
const {fetch} = require('./fetch');
const {chainlinkAbi} =  require("./chainlinkInstance")
const {chainlinkAddress} =  require("./Addresses")
const {logger} = require('./logging')



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
    for (i= 0; i < dataBaseData.length; i++) { 
        if (!dataBaseData[i].isClosed) {
            const contract = new ethers.Contract(dataBaseData[i].exchangeAddress, abi, provider);
            const liquidationPrice = await contract.getLiquidationPrice(dataBaseData[i].tradeId)
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
    const gasPrice = process.env.GASPRICE
    const liquidateTrade = await method.liquidateTrade(tradeId, {
        nonce,
        gasPrice: ethers.utils.bigNumberify(gasPrice)
    })
    logger.log('info',  liquidateTrade)
}

module.exports = {
    liquidationCheck
}