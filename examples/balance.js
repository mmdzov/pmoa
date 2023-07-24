const Pmoa = require("pmoa");
const { ProxyAdapter, SocksAdapter } = require("pmoa/src/proxy");
const dotenv = require("dotenv");

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

(async () => {
  const result = await pmoa.balance();

  console.log(result);
})();
