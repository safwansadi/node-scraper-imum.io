const axios = require("axios");
const https = require("https");

let baseURL;
const timeout = 300000;

const validateStatus = (status) => status === 200;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const instance = axios.create({
  baseURL,
  timeout,
  validateStatus,
  httpsAgent,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

module.exports = {
  GET: async (uri) => {
    return axios.get(uri);
  },
};
