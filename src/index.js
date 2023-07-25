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
   * @param {string} ACCOUNT - Your Account ID, **Example: U41701332**
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
   * @param {string} PAYEE_ACCOUNT  - Perfect Money® account to activate e-Voucher to. **Example: U41701332**
   * @param {string} EV_NUMBER  - Your Perfect Money® e-Voucher unique number you want to activate. **Example: 01234567891**
   * @param {string} EV_CODE  - Activation code of e-Voucher. **Example: 0123456789123456**
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

  /**
   * @description e-Voucher creation
   * @param {string} PAYER_ACCOUNT  - Your Perfect Money® account to spend from. **Example: U41701332**
   * @param {string} AMOUNT  - Amount to be spent. Must be positive numerical amount.
As a result e-Voucher of this nominal will be created. **Example: 19.95**
   * @returns {object} 
   */
  async eVoucherCreate({ PAYER_ACCOUNT, AMOUNT }) {
    const { data } = await api.get(
      `/acct/ev_create.asp?AccountID=${this.args.AccountID}&PassPhrase=${this.args.PassPhrase}&Payer_Account=${PAYER_ACCOUNT}&Amount=${AMOUNT}`,
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
   * @description exchange rates
   * @param {string} CUR  - Optional input field indicating display of exchange rates in this currency. Default is US Dollars. **Example: EUR**
   * @returns {object}
   */
  async rates({ CUR }) {
    const { data } = await api.get(`/acct/rates.asp?CUR=${CUR}`);

    const result = ResponseData({
      original: data,
      object: {},
    });

    return Response({
      data: result,
    });
  }

  /**
   * @description e-Voucher return
   * @param {string} EV_NUMBER  - Your Perfect Money® e-Voucher unique number you want to return.
In case of success you will get e-Voucher nominal amount back to account you used to create this e-Voucher. **Example: 01234567891**
   * @returns {object} 
   */
  async eVoucherReturn({ EV_NUMBER }) {
    const { data } = await api.get(
      `/acct/ev_remove.asp?AccountID=${this.args.AccountID}&PassPhrase=${this.args.PassPhrase}&Payer_Account=${PAYER_ACCOUNT}&ev_number=${EV_NUMBER}`,
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
   * @description protection code confirmation
   * @param {string} BATCH   - Perfect Money® batch number of transaction you want to confirm with protection code.
Must  be numerical value. **Example: 758094**
   * @param {string} CODE   - Perfect Money® protection code entered by payer of this transaction.
Can  be alpha-numerical string of length from 1 to 20 chars. **Example: somecode321**
   * @returns {object} 
   */
  async protection({ BATCH, CODE }) {
    const { data } = await api.get(
      `/acct/protection.asp?AccountID=${this.args.AccountID}&PassPhrase=${this.args.PassPhrase}&batch=${BATCH}&code=${CODE}`,
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
