const {getTradesFromEvents} = require("./getTrades")
const {listenForChainlinkUpdate} = require("./getOracleUpdates")
const {liquidationCheck} = require("./liqudate")
const main = async () => {
     getTradesFromEvents()
     listenForChainlinkUpdate()
     setInterval(liquidationCheck, process.env.RERUNTIME)
}
main()