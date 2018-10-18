module.exports = function(RED) {
  function transform(config) {
    const { transform } = require("fms-api-client");
    const { merge, parse, compact } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", msg => {
      const parameters = compact([
        config.parameters,
        msg.parameters,
        msg.payload.parameters,
        {}
      ]);
      node.send(
        merge(
          msg,
          Object.assign(
            msg.payload,
            { data: transform(msg.payload.data, parse(parameters)) },
          )
        )
      );
    });
  }
  RED.nodes.registerType("transform", transform);
};