const userRouter = require("./user");
const authRouter = require("./auth");

const routes = (app) => {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
};

module.exports = routes;
