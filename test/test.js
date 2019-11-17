'use strict';

require('chai').should();
const nock = require('nock');
const WebSocket = require('ws');
const Promise = require('bluebird');
const expect = require('chai').expect;
const should = require('chai').should();
const mockServer = require('mock-socket').Server;
const mockWebSocket = require('mock-socket').WebSocket;

const env = process.env.APP_ENV || 'unittest';
const testWsEndpoint = 'ws://localhost:1234';

const testPayload = {
  payload: {
    id: '41bb0908-15ba-4039-8c4f-8b7b99260eb2',
    machine_ids: '59d9f4b4-018f-43d8-92d0-c51de7d987e5',
    timestamp: '2017-04-16T19:42:26.542614Z',
    status: 'running'
  }
};

let wsServer;

describe('AppTest', () => {

  before(() => {
    /**
     * Mock a WebSocket Server
     */
    const mockServer = new Server(testWsEndpoint);

    return Promise.resolve()
      .catch((err) => {
        console.log(err.details);
        throw err;
      });
  });

  after(() => {
    nock.cleanAll();

  });

  describe('API', () => {
    it('should receive message from WebSocket', () => {


    });
  });

});
