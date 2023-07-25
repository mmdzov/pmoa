const api = require("./api");
const { parse } = require("node-html-parser");
const { Response, ResponseData, htmlToData } = require("./utils");
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

    const result = ResponseData({
      original: data,
      object: htmlToData(data),
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

    const result = ResponseData({
      original: data,
      object: htmlToData(data),
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

    const result = ResponseData({
      original: data,
      object: htmlToData(data),
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
    const result = ResponseData({
      original: data,
      object: htmlToData(data),
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
    const result = ResponseData({
      original: data,
      object: htmlToData(data),
    });

    return Response({
      data: result,
    });
  }

  /**
   * @description spend
   * @param {string} PAYER_ACCOUNT   - Your Perfect Money® account to spend from. **Example: U1234567**
   * @param {string} PAYEE_ACCOUNT   - Perfect Money® account to spend to. **Example: U7654321**
   * @param {string} AMOUNT   - Amount to be spent. Must be positive numerical amount. **Example: 19.95**
   * @param {string} MEMO   - Up to 100 characters to be placed in memo section of transaction. The memo is visible to both payer and payee. **Example: Thanks for dinner.**
   * @param {string} PAYMENT_ID   - Optional merchant reference number. If present, this string of up to 50 characters is placed in the transaction. Payer and/or payee may search/query account history for this value. **Example: ID-322223**
   * @param {string} CODE   - (Optional) Pass this value if only you want to use transfer protection code. If protection code is present, payee must enter this code to get money to his/her account.
Must  be alpha-numerical string of length from 1 to 20 chars. **Example: mycode123**
   * @param {string} PRIOD   - (Optional) You need to pass this value if only you want to use transfer protection code.
Number of days you want your transfer with protection code to be valid. If payee does not enter protection code during this period, money will be transferred back to your account.
Must be integer value from 1 to 365 days. **Example: 3**

   * @returns {object} 
   */
  async spend({
    PAYER_ACCOUNT,
    PAYEE_ACCOUNT,
    AMOUNT,
    MEMO,
    PAYMENT_ID,
    CODE,
    PRIOD,
  }) {
    const { data } = await api.get(
      `/acct/confirm.asp?AccountID=${this.args.AccountID}&PassPhrase=${
        this.args.PassPhrase
      }&Payer_Account=${PAYER_ACCOUNT}&Payee_Account=${PAYEE_ACCOUNT}&Amount=${AMOUNT}&Memo=${
        MEMO ?? ""
      }&PAYMENT_ID=${PAYMENT_ID ?? ""}&code=${CODE ?? ""}&Priod=${PRIOD ?? ""}`,
    );
    const result = ResponseData({
      original: data,
      object: htmlToData(data),
    });

    return Response({
      data: result,
    });
  }

  /**
   * @description spend preview/verification. This preview / verification function might be used to check the validity of a potential spend prior to executing it. Note that posting to this location does not actually perform any transfer of Perfect Money®.
   * @param {string} PAYER_ACCOUNT   - Your Perfect Money® account to spend from. **Example: U1234567**
   * @param {string} PAYEE_ACCOUNT   - Perfect Money® account to spend to. **Example: U7654321**
   * @param {string} AMOUNT   - Amount to be spent. Must be positive numerical amount. **Example: 19.95**
   * @param {string} MEMO   - Up to 100 characters to be placed in memo section of transaction. The memo is visible to both payer and payee. **Example: Thanks for dinner.**
   * @param {string} PAYMENT_ID   - Optional merchant reference number. If present, this string of up to 50 characters is placed in the transaction. Payer and/or payee may search/query account history for this value. **Example: ID-322223**
   * @param {string} CODE   - (Optional) Pass this value if only you want to use transfer protection code. If protection code is present, payee must enter this code to get money to his/her account.
Must  be alpha-numerical string of length from 1 to 20 chars. **Example: mycode123**
   * @param {string} PRIOD   - (Optional) You need to pass this value if only you want to use transfer protection code.
Number of days you want your transfer with protection code to be valid. If payee does not enter protection code during this period, money will be transferred back to your account.
Must be integer value from 1 to 365 days. **Example: 3**

   * @returns {object} 
   */
  async verify({
    PAYER_ACCOUNT,
    PAYEE_ACCOUNT,
    AMOUNT,
    MEMO,
    PAYMENT_ID,
    CODE,
    PRIOD,
  }) {
    const { data } = await api.get(
      `/acct/confirm.asp?AccountID=${this.args.AccountID}&PassPhrase=${
        this.args.PassPhrase
      }&Payer_Account=${PAYER_ACCOUNT}&Payee_Account=${PAYEE_ACCOUNT}&Amount=${AMOUNT}&Memo=${
        MEMO ?? ""
      }&PAYMENT_ID=${PAYMENT_ID ?? ""}&code=${CODE ?? ""}&Priod=${PRIOD ?? ""}`,
    );
    const result = ResponseData({
      original: data,
      object: htmlToData(data),
    });

    return Response({
      data: result,
    });
  }
}

module.exports = Pmoa;
