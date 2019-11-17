# Smart Maintenance

The Smart-Maintenance app listens the given websocket and stores the metrics in the [lowdb](https://github.com/typicode/lowdb) local JSON database. Lowdb persists the metrics into a file. Whenever you start the docker container, it starts with empty database. The Smart-Maintenance has an API to serves the metrics.

# How to build

`docker build -t smart-maintanence .`

# How to run

in interactive mode

```
docker run -it --rm -p 8090:10010 -e "WS_URL=ws://<MY_WS_SERVER>.herokuapp.com/ws" --name sm smart-maintanence:latest
```

in detach mode

```
docker run -d --rm -p 8090:10010 -e "WS_URL=ws://<MY_WS_SERVER>.herokuapp.com/ws" --name sm smart-maintanence:latest
```

# API

`GET http://localhost:8090/api/v1/metrics`

`GET http://localhost:8090/api/v1/metrics/:id`
