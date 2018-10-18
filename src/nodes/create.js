module.exports = function(RED) {
  function create(config) {
    const {
      compact,
      merge,
      parse,
      sanitizeParameters
    } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);

    node.on("input", async msg => {
      const { layout, data, ...parameters } = compact([
        sanitizeParameters(configuration, ["layout", "scripts", "merge"]),
        msg.parameters,
        msg.payload
      ]);
      let connection = await this.connection.client;

      connection
        .create(layout, data, parse(parameters))
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("create-record", create);
};