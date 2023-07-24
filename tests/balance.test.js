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

test("Balance", async () => {
  const asyncMock = jest.fn().mockImplementationOnce(async () => {
    const result = await pmoa.balance();

    // console.log(result);

    Promise.resolve(result);
  });

  const res = await asyncMock();
});
