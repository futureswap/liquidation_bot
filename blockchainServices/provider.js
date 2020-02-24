const ethers = require('ethers');
require('dotenv').config()

const url = process.env.URL
const provider = url ? new ethers.providers.JsonRpcProvider(url) : new ethers.getDefaultProvider(process.env.NETWORK)

module.exports = {
    provider
}