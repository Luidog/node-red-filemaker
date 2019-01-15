/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const containerDataNode = require("../src/nodes/containerData.js");
const findNode = require("../src/nodes/find.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Container Data Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium(process.env, "./test/env.manifest");
    done();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    const testFlow = [{ id: "n1", type: "inject" }];
    helper.load(containerDataNode, testFlow, function() {
      done();
    });
  });
  it("should download an object of Container Data to a buffer", function(done) {
    var testFlows = [
      {
        id: "806b9389.cfa96",
        type: "tab",
        label: "Container Data Test",
        disabled: false,
        info: ""
      },
      {
        id: "3147b047.a56be8",
        type: "catch",
        z: "806b9389.cfa96",
        name: "",
        scope: null,
        x: 540,
        y: 120,
        wires: [["60c27877.21817"]]
      },
      {
        id: "60c27877.21817",
        type: "helper",
        z: "806b9389.cfa96",
        name: "",
        active: true,
        tosidebar: true,
        console: false,
        tostatus: false,
        complete: "true",
        x: 730,
        y: 60,
        wires: []
      },
      {
        id: "b7541101.d1efe8",
        type: "dapi-perform-find",
        z: "806b9389.cfa96",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "1",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        query: "payload.query",
        queryType: "msg",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 290,
        y: 60,
        wires: [["754745da.ce596c"]]
      },
      {
        id: "754745da.ce596c",
        type: "dapi-container-data",
        z: "806b9389.cfa96",
        parameters: null,
        parameterType: "none",
        data: "payload.data[0]",
        dataType: "msg",
        field: "fieldData.container",
        fieldType: "str",
        name: "fieldData.filename",
        nameType: "str",
        destination: "payload.destination",
        destinationType: "msg",
        output: "payload.data",
        x: 500,
        y: 60,
        wires: [["60c27877.21817"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node Red Test",
        usage: true
      }
    ];
    helper.load(
      [clientNode, findNode, containerDataNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("b7541101.d1efe8");
        const helperNode = helper.getNode("60c27877.21817");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.have.any.keys("data")
              .and.property("data")
              .to.be.an("object")
              .with.any.keys("name", "buffer");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: {
            query: { filename: "*" },
            layout: "Images",
            destination: "buffer"
          }
        });
      }
    );
  });
  it("should download an object Container Data to the filesystem", function(done) {
    var testFlows = [
      {
        id: "806b9389.cfa96",
        type: "tab",
        label: "Container Data Test",
        disabled: false,
        info: ""
      },
      {
        id: "3147b047.a56be8",
        type: "catch",
        z: "806b9389.cfa96",
        name: "",
        scope: null,
        x: 540,
        y: 120,
        wires: [["60c27877.21817"]]
      },
      {
        id: "60c27877.21817",
        type: "helper",
        z: "806b9389.cfa96",
        name: "",
        active: true,
        tosidebar: true,
        console: false,
        tostatus: false,
        complete: "true",
        x: 730,
        y: 60,
        wires: []
      },
      {
        id: "b7541101.d1efe8",
        type: "dapi-perform-find",
        z: "806b9389.cfa96",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "1",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        query: "payload.query",
        queryType: "msg",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 290,
        y: 60,
        wires: [["754745da.ce596c"]]
      },
      {
        id: "754745da.ce596c",
        type: "dapi-container-data",
        z: "806b9389.cfa96",
        parameters: null,
        parameterType: "none",
        data: "payload.data[0]",
        dataType: "msg",
        field: "fieldData.container",
        fieldType: "str",
        name: "fieldData.filename",
        nameType: "str",
        destination: "./assets",
        destinationType: "str",
        output: "payload.data",
        x: 500,
        y: 60,
        wires: [["60c27877.21817"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node Red Test",
        usage: true
      }
    ];
    helper.load(
      [clientNode, findNode, containerDataNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("b7541101.d1efe8");
        const helperNode = helper.getNode("60c27877.21817");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.have.any.keys("data")
              .and.property("data")
              .to.be.an("object")
              .with.any.keys("name", "path");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: {
            query: { filename: "*" },
            layout: "Images"
          }
        });
      }
    );
  });
  it("should download Container Data to the filesystem", function(done) {
    var testFlows = [
      {
        id: "806b9389.cfa96",
        type: "tab",
        label: "Container Data Test",
        disabled: false,
        info: ""
      },
      {
        id: "3147b047.a56be8",
        type: "catch",
        z: "806b9389.cfa96",
        name: "",
        scope: null,
        x: 540,
        y: 120,
        wires: [["60c27877.21817"]]
      },
      {
        id: "60c27877.21817",
        type: "helper",
        z: "806b9389.cfa96",
        name: "",
        active: true,
        tosidebar: true,
        console: false,
        tostatus: false,
        complete: "true",
        x: 730,
        y: 60,
        wires: []
      },
      {
        id: "b7541101.d1efe8",
        type: "dapi-perform-find",
        z: "806b9389.cfa96",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "1",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        query: "payload.query",
        queryType: "msg",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 290,
        y: 60,
        wires: [["754745da.ce596c"]]
      },
      {
        id: "754745da.ce596c",
        type: "dapi-container-data",
        z: "806b9389.cfa96",
        parameters: null,
        parameterType: "none",
        data: "payload.data",
        dataType: "msg",
        field: "fieldData.container",
        fieldType: "str",
        name: "fieldData.filename",
        nameType: "str",
        destination: "./assets",
        destinationType: "str",
        output: "payload.data",
        x: 500,
        y: 60,
        wires: [["60c27877.21817"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node Red Test",
        usage: true
      }
    ];
    helper.load(
      [clientNode, findNode, containerDataNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("b7541101.d1efe8");
        const helperNode = helper.getNode("60c27877.21817");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.have.any.keys("data")
              .and.property("data")
              .to.be.an("array")
              .and.property(0)
              .to.be.an("object")
              .with.any.keys("name", "path");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: {
            query: { filename: "*" },
            layout: "Images"
          }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlow = [
      {
        id: "806b9389.cfa96",
        type: "tab",
        label: "Container Data Test",
        disabled: false,
        info: ""
      },
      {
        id: "3147b047.a56be8",
        type: "catch",
        z: "806b9389.cfa96",
        name: "",
        scope: null,
        x: 540,
        y: 120,
        wires: [["60c27877.21817"]]
      },
      {
        id: "60c27877.21817",
        type: "helper",
        z: "806b9389.cfa96",
        name: "",
        active: true,
        tosidebar: true,
        console: false,
        tostatus: false,
        complete: "true",
        x: 730,
        y: 60,
        wires: []
      },
      {
        id: "b7541101.d1efe8",
        type: "dapi-perform-find",
        z: "806b9389.cfa96",
        client: "3783b2da.4346a6",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "1",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        query: "payload.query",
        queryType: "msg",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 290,
        y: 60,
        wires: [["754745da.ce596c"]]
      },
      {
        id: "754745da.ce596c",
        type: "dapi-container-data",
        z: "806b9389.cfa96",
        parameters: null,
        parameterType: "none",
        data: "payload.data",
        dataType: "msg",
        field: "fieldData.container",
        fieldType: "str",
        name: "fieldData.filename",
        nameType: "str",
        destination: "",
        destinationType: "str",
        output: "payload.data",
        x: 500,
        y: 60,
        wires: [["60c27877.21817"]]
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        z: "",
        name: "Node Red Test",
        usage: true
      }
    ];
    helper.load(
      [clientNode, findNode, containerDataNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("b7541101.d1efe8");
        const helperNode = helper.getNode("60c27877.21817");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("_msgid", "code", "error", "message");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: {
            query: { filename: "*" },
            layout: "Images"
          }
        });
      }
    );
  });
});
