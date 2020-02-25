const axios = require('axios');
const {errorLogger} = require("./logging")


const post = async (data) => {
    const url = 'http://localhost:3001/trades'

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