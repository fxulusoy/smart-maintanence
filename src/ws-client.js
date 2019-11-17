'use strict';

const WebSocket = require('ws');

class WSClient {

  constructor(wsServerUrl) {
    this.subscribers = [];
    this.wsServerUrl = wsServerUrl;
  }

  connect() {
    const method = 'WSClient.connect';
    this.wsClient = new WebSocket(this.wsServerUrl);
    this.wsClient.on('open', () => {
      console.log(method, 'WebSocket connection is open.');
    });
    this.wsClient.on('close', () => {
      console.log('WebSocket connection is closed');
      this.wsClient.terminate();
      this.connect();
    });
    this.wsClient.on('message', (data) => {
      const event = JSON.parse(data);
      if (event && event.payload) {
        this.subscribers.forEach((subscriber) => {
          console.log(method, 'Metric is received', event.payload.id, event.payload.machine_id);
          subscriber(event.payload);
        });
      }
    });
  }

  subscribeToEvents(eventHandler) {
    const method = 'WSClient.subscribeToEvents';
    console.log(method, 'Subscribing to events.');
    this.subscribers.push(eventHandler);
  }

}


WSClient.getInstance = function(wsServerUrl) {
  return new WSClient(wsServerUrl);
};

module.exports = WSClient;
