const { parse } = require("node-html-parser");
const { default: axios } = require("axios");

const endpoint = "https://perfectmoney.com";

const api = axios.create({
  baseURL: endpoint,
});

api.interceptors.response.use((response) => {
  const { data } = response;

  const root = parse(data);

  let error = root.querySelector("input[name='ERROR']");

  if (error) {
    const errorText = error.getAttribute("value");

    throw new Error(errorText);
  }

  return response;
});

module.exports = api;
