const {getTradesFromEvents} = require("./getTrades")
const {listenForChainlinkUpdate} = require("./getOracleUpdates")
const {liquidationCheck} = require("./liqudate")
const {RERUNTIME} = require("../src/config/configurations")

const main = async () => {
     getTradesFromEvents()
     listenForChainlinkUpdate()
     if (RERUNTIME) {
        setInterval(liquidationCheck, RERUNTIME)
     }
}

module.exports = {
   main
}