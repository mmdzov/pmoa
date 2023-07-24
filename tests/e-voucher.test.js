const Pmoa = require("../src/index");
const dotenv = require("dotenv");
const { expect, test } = require("@jest/globals");
const { ProxyAdapter, SocksAdapter } = require("../src/proxy");

dotenv.config();

const pmoa = new Pmoa(
  {
    AccountID: process.env.AccountID,
    PassPhrase: process.env.PASSPHRASE,
  },
  {
    proxy: new ProxyAdapter(new SocksAdapter(process.env.SOCKS)),
  },
);

test("e-voucher activate", async () => {
  const asyncMock = jest.fn().mockImplementationOnce(async () => {
    const result = await pmoa.eVoucherActive({
      PAYEE_ACCOUNT: "U41708332",
      EV_NUMBER: "0302162725",
      EV_CODE: "6502824637305897",
    });

    Promise.resolve(result);
  });

  await asyncMock();
});
