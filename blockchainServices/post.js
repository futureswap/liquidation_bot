const axios = require('axios');
const {errorLogger} = require("./logging")
const {PRUNING} = require("../src/config/configurations")


const post = async (data, route) => {
    if (!PRUNING) {
        route = "add"
    }
    const url = `http://localhost:3001/trades/${route}`

try {
    const response = await axios({
        method: 'post',
        url,
        data

    });
} catch (e) {
    errorLogger.log('error', new Error(`${e.message}`));
}

}

module.exports = {
    post
}