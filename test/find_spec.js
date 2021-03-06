/* global describe before beforeEach afterEach it */

const path = require("path");
const { expect } = require("chai");
const sinon = require("sinon");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");

const clientNode = require("../src/client/client.js");
const findNode = require("../src/nodes/find.js");
const catchNode = require("./core/25-catch.js");

const sandbox = sinon.createSandbox();

helper.init(require.resolve("node-red"));

const manifestPath = path.join(__dirname, "./env.manifest");

describe("Find Records Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium({ manifestPath });
    done();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    sandbox.restore();
    helper.stopServer(() =>
      setTimeout(() => {
        delete global.MARPAT;
        done();
      }, "500")
    );
  });

  it("should be loaded", function(done) {
    const testFlow = [{ id: "n1", type: "inject" }];
    helper.load(findNode, testFlow, function() {
      done();
    });
  });

  it("should perform a find", function(done) {
    const testFlow = [
      {
        id: "37b558cf.8553c",
        type: "tab",
        label: "Perform Find",
        disabled: false,
        info: ""
      },
      {
        id: "641ec5c9.c3f73c",
        type: "catch",
        z: "37b558cf.8553c",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "cfc785d0.b2ba",
        type: "helper"
      },
      {
        id: "f15d2a17.bbc65",
        type: "dapi-perform-find",
        z: "37b558cf.8553c",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
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
        x: 250,
        y: 40,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, findNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("f15d2a17.bbc65");
        const helperNode = helper.getNode("cfc785d0.b2ba");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("data")
              .and.property("data")
              .to.be.a("array")
              .and.property(0)
              .to.be.a("object")
              .with.any.keys("recordId", "modId");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: { layout: "people", query: { name: "*" } }
        });
      }
    );
  });

  it("should handle client connection errors", function(done) {
    const testFlow = [
      {
        id: "37b558cf.8553c",
        type: "tab",
        label: "Perform Find",
        disabled: false,
        info: ""
      },
      {
        id: "641ec5c9.c3f73c",
        type: "catch",
        z: "37b558cf.8553c",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "cfc785d0.b2ba",
        type: "helper"
      },
      {
        id: "f15d2a17.bbc65",
        type: "dapi-perform-find",
        z: "37b558cf.8553c",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
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
        x: 250,
        y: 40,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];

    helper.load(
      [clientNode, findNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("f15d2a17.bbc65");
        const helperNode = helper.getNode("cfc785d0.b2ba");
        const clientNode = helper.getNode("e5173483.adc92");
        clientNode.connection = Promise.reject(new Error("Mock Error"));
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload", "error", "_msgid")
              .and.property("error")
              .to.be.a("object")
              .with.any.keys("message", "source")
              .and.property("message")
              .to.be.a("string");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: { layout: "people", query: { name: "*" } }
        });
      }
    );
  });

  it("should handle client initialization errors", function(done) {
    const testFlow = [
      {
        id: "37b558cf.8553c",
        type: "tab",
        label: "Perform Find",
        disabled: false,
        info: ""
      },
      {
        id: "641ec5c9.c3f73c",
        type: "catch",
        z: "37b558cf.8553c",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "cfc785d0.b2ba",
        type: "helper"
      },
      {
        id: "f15d2a17.bbc65",
        type: "dapi-perform-find",
        z: "37b558cf.8553c",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
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
        x: 250,
        y: 40,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, findNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("f15d2a17.bbc65");
        const helperNode = helper.getNode("cfc785d0.b2ba");

        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload", "error", "_msgid")
              .and.property("error")
              .to.be.a("object")
              .with.any.keys("message", "source")
              .and.property("message")
              .to.be.a("string");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: { layout: "people", query: { name: "*" } }
        });
      }
    );
  });

  it("allows multiple clients", function(done) {
    const testFlow = [
      {
        id: "37b558cf.8553c",
        type: "tab",
        label: "Perform Find",
        disabled: false,
        info: ""
      },
      {
        id: "641ec5c9.c3f73c",
        type: "catch",
        z: "37b558cf.8553c",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "cfc785d0.b2ba",
        type: "helper"
      },
      {
        id: "f15d2a17.bbc65",
        type: "dapi-perform-find",
        z: "37b558cf.8553c",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
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
        x: 250,
        y: 40,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      },
      {
        id: "e5173483.adc91",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.settings({ marpat: { url: "nedb://dapi" } });
    helper.load(
      [clientNode, findNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        },
        "e5173483.adc91": {
          server: process.env.FILEMAKER_SERVER,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("f15d2a17.bbc65");
        const helperNode = helper.getNode("cfc785d0.b2ba");

        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload", "error", "_msgid")
              .and.property("error")
              .to.be.a("object")
              .with.any.keys("message", "source")
              .and.property("message")
              .to.be.a("string");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: { layout: "people", query: { name: "*" } }
        });
      }
    );
  });

  it("will reuse previous clients", function(done) {
    const testFlow = [
      {
        id: "37b558cf.8553c",
        type: "tab",
        label: "Perform Find",
        disabled: false,
        info: ""
      },
      {
        id: "641ec5c9.c3f73c",
        type: "catch",
        z: "37b558cf.8553c",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "cfc785d0.b2ba",
        type: "helper"
      },
      {
        id: "f15d2a17.bbc65",
        type: "dapi-perform-find",
        z: "37b558cf.8553c",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
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
        x: 250,
        y: 40,
        wires: [["cfc785d0.b2ba"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      },
      {
        id: "e5173483.adc91",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.settings({ marpat: { url: "nedb://dapi" } });
    helper.load(
      [clientNode, findNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        },
        "e5173483.adc91": {
          server: process.env.FILEMAKER_SERVER,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const findNode = helper.getNode("f15d2a17.bbc65");
        const helperNode = helper.getNode("cfc785d0.b2ba");

        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload", "error", "_msgid")
              .and.property("error")
              .to.be.a("object")
              .with.any.keys("message", "source")
              .and.property("message")
              .to.be.a("string");
            done();
          } catch (err) {
            done(err);
          }
        });
        findNode.receive({
          payload: { layout: "people", query: { name: "*" } }
        });
      }
    );
  });

  it("should throw an error with a message and a code", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Find Error"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        z: "f1",
        database: process.env.FILEMAKER_DATABASE,
        user: process.env.FILEMAKER_USERNAME,
        password: process.env.FILEMAKER_PASSWORD,
        usage: true
      },
      {
        id: "n2",
        type: "dapi-perform-find",
        client: "3783b2da.4346a6",
        layout: "People",
        z: "f1",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      },
      { id: "n3", type: "helper" }
    ];
    helper.load(
      [clientNode, findNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const testNode = helper.getNode("n2");
        const helperNode = helper.getNode("n3");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("_msgid", "code", "error", "code", "message");
            done();
          } catch (err) {
            done(err);
          }
        });
        testNode.receive({ payload: {} });
      }
    );
  });
});
