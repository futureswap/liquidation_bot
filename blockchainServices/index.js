const {getTradesFromEvents} = require("./getTrades")
const {listenForChainlinkUpdate} = require("./getOracleUpdates")
const {liquidationCheck} = require("./liqudate")
const main = async () => {
     getTradesFromEvents()
     listenForChainlinkUpdate()
     if (process.env.RERUNTIME) {
        setInterval(liquidationCheck, process.env.RERUNTIME)
     }
}
main()