const {chainlinkAbi} =  require("./chainlinkInstance")
const {chainlinkAddress} =  require("./Addresses")
const ethers = require('ethers');
const {liquidationCheck} = require('./liqudate')


const url = process.env.URL
const provider = url ? new ethers.providers.JsonRpcProvider(url) : new ethers.getDefaultProvider(process.env.NETWORK)

const listenForChainlinkUpdate = async () => {
    const contract = new ethers.Contract(chainlinkAddress, chainlinkAbi, provider);
    contract.on("AnswerUpdated", async (current) => {
        liquidationCheck((Number(current) * 10000000000))
    })
}
module.exports = {
    listenForChainlinkUpdate
}


