module.exports = function(RED) {
  function upload(config) {
    const { send, handleError, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    this.status({ fill: "green", shape: "dot", text: "Ready" });
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const {
        layout,
        field,
        file,
        recordId,
        ...parameters
      } = constructParameters(message, configuration, node.context(), [
        "file",
        "layout",
        "field",
        "recordId",
        "parameters"
      ]);
      const connection = await this.connection.client;
      connection
        .upload(file, layout, field, recordId, parameters)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-upload-file", upload);
};
