const {provider} =  require("./provider");
const {abi} =  require("./chainlinkInstance")
const {chainlinkAddress} =  require("./Addresses")
const ethers = require('ethers');
const {post} = require('./post');


const listenForChainlinkUpdate = async () => {
    const contract = new ethers.Contract(chainlinkAddress, abi, provider);
    provider.resetEventsBlock(process.env.BLOCKSTART)
    contract.on("AnswerUpdated", (current) => {
        console.log(current.toString())
    })
}
module.exports = {
    listenForChainlinkUpdate
}


// event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp);
