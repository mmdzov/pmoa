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

  /**
   * @returns {object}
   */
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

  /**
   * @description Account name fetching
   * @param {string} ACCOUNT - Your Account ID, like U41701332
   * @returns {object}
   */
  async accountName(ACCOUNT) {
    const { data } = await api.get(
      `/acct/acc_name.asp?AccountID=${this.args.AccountID}&PassPhrase=${this.args.PassPhrase}&Account=${ACCOUNT}`,
    );

    const result = ResponseData({
      original: data,
      object: {},
    });

    return Response({
      data: result,
    });
  }

  /**
   * @description e-Voucher activation
   * @param {string} PAYEE_ACCOUNT  - Perfect Money® account to activate e-Voucher to. Example: U41701332
   * @param {string} EV_NUMBER  - Your Perfect Money® e-Voucher unique number you want to activate. Example: 01234567891
   * @param {string} EV_CODE  - Activation code of e-Voucher. Example: 0123456789123456
   * @returns {object}
   */
  async eVoucherActive({ PAYEE_ACCOUNT, EV_NUMBER, EV_CODE }) {
    const { data } = await api.get(
      `/acct/ev_activate.asp?AccountID=${this.args.AccountID}&PassPhrase=${this.args.PassPhrase}&Payee_Account=${PAYEE_ACCOUNT}&ev_number=${EV_NUMBER}&ev_code=${EV_CODE}`,
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
