const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const ethers = require('ethers');


const liquidationCheck = async (dataBaseData, currentPrice) => {
    console.log("liquidation check 1 ============", currentPrice)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    let nonce = await wallet.getTransactionCount("pending")
    let i = 0 
    dataBaseData.map(async trade => {
        console.log("mapping", trade.liquidationPrice, trade.tradeId)
        if (!trade.isClosed) {
            if (trade.isLong) {
                if (Number(trade.liquidationPrice) > currentPrice) {
                    nonce = nonce + i
                    i++
                    await liquidateTransaction(trade.tradeId, trade.exchangeAddress, wallet, nonce)
                    } 
               } else {
                   console.log("trade is short", Number(trade.liquidationPrice), currentPrice)
                    if (Number(trade.liquidationPrice) < currentPrice ) {
                        console.log("trade.isShort", Number(trade.liquidationPrice), currentPrice)
                        nonce = nonce + i
                        i++
                        await liquidateTransaction(trade.tradeId, trade.exchangeAddress, wallet, nonce)
                    }
                }
            } else {
                console.log("trade is closed")
            }
    })
}

const liquidateTransaction = async (tradeId, exchangeAddress, wallet, nonce) => {
    console.log("liquidate transaction!",{tradeId, exchangeAddress})
    const contract = new ethers.Contract(exchangeAddress, abi, provider);
    const method = contract.connect(wallet);
    console.log({nonce})
    const liquidateTrade = await method.liquidateTrade(tradeId, {
        nonce
    })
    console.log(liquidateTrade)
}

module.exports = {
    liquidationCheck
}