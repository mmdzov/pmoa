const Pmoa = require("pmoa");
const { ProxyAdapter, SocksAdapter } = require("pmoa/src/proxy");
const dotenv = require("dotenv");

dotenv.config();

const pmoa = new Pmoa({
  proxy: new ProxyAdapter(new SocksAdapter(process.env.SOCKS)),
});

(async () => {
  const result = await pmoa.rates("EUR");

  console.log(result);
})();
