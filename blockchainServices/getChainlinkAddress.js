const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const {EXCHANGE_ADDRESSES} =  require("../src/config/configurations")
const ethers = require('ethers');


const chainlinkAddress = async () => {
    const contract = new ethers.Contract(EXCHANGE_ADDRESSES[0], abi, provider);
    const instances = await contract.instances()
    return instances.chainlinkAsset
}

module.exports = {
    chainlinkAddress
}