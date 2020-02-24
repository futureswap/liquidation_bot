const axios = require('axios');


const post = async (data) => {
    const url = 'http://localhost:3001/trades'

try {
    const response = await axios({
        method: 'post',
        url,
        data

    });
} catch (e) {
    console.log({url})
    console.log({message: e})
}

}

module.exports = {
    post
}