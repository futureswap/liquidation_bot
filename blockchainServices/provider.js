const ethers = require('ethers');
const {NETWORK, URL} = require('../src/config/configurations')

const provider = URL ? new ethers.providers.JsonRpcProvider(URL) : new ethers.getDefaultProvider(NETWORK)

module.exports = {
    provider
}