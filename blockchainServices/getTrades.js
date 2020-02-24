const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const {exchangeAddresses} =  require("./Addresses")
const ethers = require('ethers');
const {post} = require('./post');



const getTradesFromEvents = async () => {
    const contract = new ethers.Contract(exchangeAddresses[0], abi, provider);
    provider.resetEventsBlock(process.env.BLOCKSTART)
    contract.on("TradeOpen", (one, two, three, four, five, six, seven, eight, nine) => {
        const test = async () => {
            const tradeId =  nine.args._tradeId.toString()
            const liquidationPrice = await contract.getLiquidationPrice(tradeId)
            const isClosed = liquidationPrice.toString() === "0" ? true : false
            const obj =   {
                tradeId: tradeId.toString(),
                isClosed,
                isLong: nine.args._isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: nine.blockNumber,
                exchangeAddress: nine.address
            }
            post(obj)
        }
        test()
    })
    contract.on("TradeClose", (one, two, three, four, five, six, seven, eight, nine) => {
        const test = async () => {
            const tradeId =  nine.args._tradeId.toString()
            const liquidationPrice = await contract.getLiquidationPrice(tradeId)
            const obj =   {
                tradeId: tradeId.toString(),
                isClosed: true,
                isLong: nine.args._isLong, 
                liquidationPrice: liquidationPrice.toString(),
                block: nine.blockNumber,
                exchangeAddress: nine.address
            }
            console.log(obj)
            post(obj)
        }
        test()
    })
    
}

module.exports = {
    getTradesFromEvents
}
