'use strict';

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

class DataStore {

  constructor() {
    low(new FileAsync('db.json'))
      .then((db) => {
        this.db = db;
        // Set db default values
        return db.defaults({ metrics: [] }).write();
      });
  }

  get(entityType, id) {
    const method = 'DataStore.get';
    console.log(method, 'Getting a data from database');
    return this.db.get(entityType)
      .find({ id: id })
      .value();
  }

  list(entityType, key, value) {
    const method = 'DataStore.list';
    console.log(method, 'Listing data from database');
    const query = {};
    if (key) {
      query[key] = value;
    }
    return this.db.get(entityType)
      .filter(query)
      .value();
  }

  add(entityType, data) {
    const method = 'DataStore.add';
    console.log(method, 'Adding a data to database');
    return this.db.get(entityType)
      .push(data)
      .last()
      .assign({ uid: Date.now().toString() })
      .write();
  }

  insert(entityType, data) {
    const method = 'DataStore.insert';
    console.log(method, 'Insert a data to database');
    const metric = this.db.get(entityType)
      .find({ id: data.id, machine_id: data.machine_id })
      .value();

    if (metric) {
      return this.db.get(entityType)
        .find({ id: data.id, machine_id: data.machine_id })
        .assign(data)
        .write();
    } else {
      return this.db.get(entityType)
        .push(data)
        .last()
        .write();
    }
  }

}


DataStore.getInstance = function() {
  return new DataStore();
};

module.exports = DataStore;
