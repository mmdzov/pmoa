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

test("e-voucher creation", async () => {
  const asyncMock = jest.fn().mockImplementationOnce(async () => {
    const result = await pmoa.eVoucherCreate({
      PAYER_ACCOUNT: "U41708332",
      AMOUNT: "1.00",
    });

    Promise.resolve(result);
  });

  await asyncMock();
});
