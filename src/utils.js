const Response = (args = { data: {}, error: null }) => ({
  ...args,
});

const ResponseData = (args = { original, object: {} }) => ({
  ...args,
});

module.exports = { Response, ResponseData };
