const indexR = require("./index");
const usersR = require("./users");
const jewelryR = require("./jewelrys");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/jewelrys",jewelryR);
}