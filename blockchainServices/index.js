const {getTradesFromEvents} = require("./getTrades")
const {listenForChainlinkUpdate} = require("./getOracleUpdates")
const {liquidationCheck} = require("./liqudate")
const {RERUNTIME} = require("../src/config/configurations")
const {timezones} = require("../src/timezones/timezones")
const moment = require('moment-timezone');


const main = async () => {
     moment.tz.add(timezones.zones);
     getTradesFromEvents()
     listenForChainlinkUpdate()
     if (RERUNTIME) {
        setInterval(liquidationCheck, RERUNTIME)
     }
}

module.exports = {
   main
}