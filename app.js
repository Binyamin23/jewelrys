const express = require("express");
const path = require("path");
const http = require("http");

const {routesInit} = require("./routes/configRoutes");

require("./db/mongoConnect"); //conectt to mongo

const app = express();

app.use(express.json()); // middleware

app.use(express.static(path.join(__dirname,"public"))); // middleware to public

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3002;

server.listen(port);
