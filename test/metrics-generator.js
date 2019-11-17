'use strict';

const WebSocket = require('ws');
const moment = require('moment');
const uuidV5 = require('uuid/v5');

const wss = new WebSocket.Server({ port: 10200 });


const testPayload = {
  payload: {
    id: '41bb0908-15ba-4039-8c4f-8b7b99260eb2',
    machine_id: '59d9f4b4-018f-43d8-92d0-c51de7d987e5',
    timestamp: '2017-04-16T19:42:26.542614Z',
    status: 'running'
  }
};

function generateId(name) {
  const namespace = '00000000-0000-0000-0000-000000000000';
  return uuidV5(name, namespace);
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  setInterval(function timeout() {
    testPayload.id = generateId(Date.now().toString());
    testPayload.timestamp = moment().format();
    console.log('Sending: ', testPayload);
    ws.send(JSON.stringify(testPayload));
  }, 10000);
});
