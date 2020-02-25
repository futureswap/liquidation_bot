const axios = require("axios");
const {errorLogger} = require("./logging")


const fetch = async data => {
  const url = "http://localhost:3001/trades";

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    errorLogger.log('error', new Error(`${e.message}`));

  }
};

module.exports = {
  fetch
};
