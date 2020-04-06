const {provider} =  require("./provider");
const {abi} =  require("./exchangeInstance")
const {exchangeAddresses} =  require("./Addresses")
const ethers = require('ethers');


const chainlinkAddress = async () => {
    const contract = new ethers.Contract(exchangeAddresses[0], abi, provider);
    const instances = await contract.instances()
    return instances.chainlinkAsset
}

module.exports = {
    chainlinkAddress
}