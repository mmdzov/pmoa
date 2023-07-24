const { SocksProxyAgent } = require("socks-proxy-agent");

class AdapterSchema {
  type = "";
  agent = null;

  constructor() {}
}

class SocksAdapter {
  type = "SOCKS";

  constructor(url = "", options) {

    this.agent = new SocksProxyAgent(url, options);
  }
}

class ProxyAdapter {
  constructor(adapter = new AdapterSchema()) {
    this.adapter = adapter;
  }
}

module.exports = { ProxyAdapter, SocksAdapter };
