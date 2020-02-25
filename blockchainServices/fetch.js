const axios = require("axios");

const fetch = async data => {
  const url = "http://localhost:3001/trades";

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.log({ url });
    console.log({ message: e });
  }
};

module.exports = {
  fetch
};
