const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const {exchangeAddresses} =  require("./Addresses")
const ethers = require('ethers');
const {post} = require('./post');
const {logger} = require('./logging')



const getTradesFromEvents = async () => {
    const contract = new ethers.Contract(exchangeAddresses[0], abi, provider);
    provider.resetEventsBlock(process.env.BLOCKSTART)
    contract.on("TradeOpen", (one, two, three, four, five, six, seven, eight, nine, ten, eleven) => {
        const openTrade = async () => {
            const tradeId =  eleven.args._tradeId.toString()
            let liquidationPrice
            try {
                liquidationPrice = await contract.getLiquidationPrice(tradeId)
            } catch (e) {
                liquidationPrice = 0

            }
            const isClosed = liquidationPrice.toString() === "0" ? true : false
            const obj =   {
                tradeId: tradeId.toString(),
                isClosed,
                isLong: eleven.args._isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: eleven.blockNumber,
                exchangeAddress: eleven.address
            }
            logger.log('info',  obj)
            post(obj)
        }
        openTrade()
    })
    contract.on("TradeClose", (one, two, three, four, five, six, seven, eight, nine, ten) => {
        const closeTrade = async () => {
            const tradeId =  ten.args._tradeId.toString()
            const liquidationPrice = 0
            const obj =   {
                tradeId: tradeId.toString(),
                isClosed: true,
                isLong: ten.args._isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: ten.blockNumber,
                exchangeAddress: ten.address
            }
            logger.log('info', obj)
            post(obj)
        }
        closeTrade()
    })
    contract.on("TradeLiquidate", (one, two, three, four, five, six, seven, eight, nine) => {
        const liqudateTrade = async () => {
            const tradeId =  nine.args._tradeId.toString()
            const liquidationPrice = 0
            const obj =   {
                tradeId: tradeId.toString(),
                isClosed: true,
                isLong: nine.args._isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: nine.blockNumber,
                exchangeAddress: nine.address
            }
            logger.log('info', obj)
            post(obj)
        }
        liqudateTrade()
    })
    
}

module.exports = {
    getTradesFromEvents
}
