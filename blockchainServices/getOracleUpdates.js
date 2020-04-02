const {chainlinkAbi} =  require("./chainlinkInstance")
const {chainlinkAddress} =  require("./getChainlinkAddress")
const ethers = require('ethers');
const {liquidationCheck} = require('./liqudate')
const {URL, NETWORK} = require("../src/config/configurations")


const provider = URL ? new ethers.providers.JsonRpcProvider(URL) : new ethers.getDefaultProvider(NETWORK)

const listenForChainlinkUpdate = async () => {
    const address = await chainlinkAddress()
    const contract = new ethers.Contract(address, chainlinkAbi, provider);
    contract.on("AnswerUpdated", async (current) => {
        liquidationCheck((Number(current) * 10000000000))
    })
}
module.exports = {
    listenForChainlinkUpdate
}


