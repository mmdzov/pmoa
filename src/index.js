const api = require("./api");
const { parse } = require("node-html-parser");
const { Response, ResponseData } = require("./utils");
const { ProxyAdapter } = require("./proxy");
require("dotenv").config();

const ArgsSchema = { AccountID: "", PassPhrase: "" };
class Pmoa {
  args = ArgsSchema;

  constructor(
    args = ArgsSchema,
    options = {
      proxy: new ProxyAdapter(),
    },
  ) {
    this.args = args;

    if (options?.proxy) {
      const adapter = options.proxy.adapter;

      if (adapter.type === "SOCKS") {
        api.defaults.httpsAgent = adapter.agent;
      }
    }
  }

  async balance() {
    const { data } = await api.get(
      `/acct/balance.asp?AccountID=${this.args.AccountID}&PassPhrase=${this.args.PassPhrase}`,
    );

    const root = parse(data);

    const result = ResponseData({
      original: data,
      object: {},
    });

    root.querySelectorAll("input[type='hidden']").forEach((item) => {
      result.object[item.getAttribute("name")] = item.getAttribute("value");
    });

    return Response({
      data: result,
    });
  }
}

module.exports = Pmoa;
