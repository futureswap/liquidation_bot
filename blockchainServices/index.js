const {getTradesFromEvents} = require("./getTrades")
const {listenForChainlinkUpdate} = require("./getOracleUpdates")
const main = async () => {
     getTradesFromEvents()
     listenForChainlinkUpdate()
}
main()