const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const {exchangeAddresses} =  require("./Addresses")
const ethers = require('ethers');
const {post} = require('./post');
const {logger} = require('./logging')
const {BLOCKSTART, PRUNING} = require("../src/config/configurations")




const getTradesFromEvents = async () => {
    const contract = new ethers.Contract(exchangeAddresses[0], abi, provider);
    provider.resetEventsBlock(BLOCKSTART)
    contract.on("TradeOpen", (one, two, three, four, five, six, seven, eight, nine, ten, eleven, block) => {
        const openTrade = async () => {
            const tradeId =  block.args.tradeId.toString()
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
                isLong: block.args.isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: block.blockNumber,
                exchangeAddress: block.address
            }
            logger.log('info',  obj)
            if (isClosed && PRUNING) {
            } else {
                post(obj, "add")
            }
        }
        openTrade()
    })
    contract.on("TradeClose", (one, two, three, four, five, six, seven, eight, nine, ten, eleven, block) => {
        const closeTrade = async () => {
            const tradeId =  block.args.tradeId.toString()
            const liquidationPrice = 0
            const obj =   {
                tradeId: tradeId.toString(),
                isClosed: true,
                isLong: block.args.isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: block.blockNumber,
                exchangeAddress: block.address
            }
            logger.log('info', obj)
            post(obj, "remove")
        }
        closeTrade()
    })
}

module.exports = {
    getTradesFromEvents
}
