'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const WSClient = require('./ws-client');
const DataStore = require('./data-store');

const apiBase = '/api/v1';
const apiMetricsPath = 'metrics';
const apiPort = process.env.API_PORT || 10010;

//const wsServerUrl = 'ws://machinestream.herokuapp.com/ws';
const wsServerUrl = process.env.WS_URL || 'ws://localhost:10200/ws';

const dataStore = DataStore.getInstance();

function getMetric(req, res) {
  const method = 'listMerics';
  console.log(method, 'Access to GET', req.originalUrl);
  const metric = dataStore.get('metrics', req.params.metricId);
  if (!metric) {
    const error = {
      message: 'Not found'
    };
    res.status(404).json(error);
  } else {
    res.send(metric);
  }
}

function listMetrics(req, res) {
  const method = 'listMerics';
  console.log(method, 'Access to GET', req.originalUrl);
  const metrics = dataStore.list('metrics');
  res.send(metrics);
}

function addMetric(req, res) {
  const method = 'listMerics';
  console.log(method, 'Access to GET', req.originalUrl);

  dataStore.insert('metrics', req.body)
    .then(m => res.send(m));
}

// Express server for api
const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Get a metric
expressApp.get(`${apiBase}/${apiMetricsPath}/:metricId`, getMetric);
// Lists the metrics
expressApp.get(`${apiBase}/${apiMetricsPath}`, listMetrics);

expressApp.post(`${apiBase}/${apiMetricsPath}`, addMetric);

expressApp.use((err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  console.log('Uncaught error. Error: ', err);
  res.status(500).send('Internal server error');
});

const apiServer = expressApp.listen(apiPort, () => {
  const method = 'app.listen';
  const port = apiServer.address().port;
  const host = (`${apiServer.address().address === '::' ? 'localhost' : apiServer.address().address}`);
  console.log(method, 'API is starting at', `http://${host}:${port}`);

  const wsClient = WSClient.getInstance(wsServerUrl);
  wsClient.connect();
  console.log(method, `Subscribing to WebSocket${wsServerUrl}`);
  wsClient.subscribeToEvents((metric) => {
    dataStore.add('metrics', metric)
      .then((m) => {
        console.log('Metric is saved:', m.id, m.machine_id);
      });
  });

});
