const Response = (args = { data: {}, error: null }) => ({
  ...args,
});

const ResponseData = (args = { original, object: {} }) => ({
  ...args,
});

const htmlToData = (html) => {
  const root = parse(html);

  const data = {};

  root.querySelectorAll("input[type='hidden']").forEach((item) => {
    data[item.getAttribute("name")] = item.getAttribute("value");
  });

  return data;
};

module.exports = { Response, ResponseData, htmlToData };
