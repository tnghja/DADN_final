const express = require("express");
const logger = require("morgan");
const bodyPraser = require("body-parser");
const cors = require("cors");
const analysisRouter = require("../routes/analysis.route.js");
const roomRouter = require("../routes/room_route.js");
const logRouter = require("../routes/log_route.js");
const deviceRouter = require("../routes/device_route.js");
const eventRouter = require("../routes/event_route.js");
async function expressLoader({ app }) {
  app.use(logger("dev"));
  app.use(bodyPraser.json());
  app.use(cors());
  
  app.use("/api/device",deviceRouter);
  app.use("/api/log",logRouter);
  app.use("/api/room", roomRouter);
  app.use("/api/analysis",analysisRouter);
  //catch 404 error
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(() => {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;

    // response to client
    return res.status(status).json({
      error: {
        message: error.message,
      },
    });
  });

  return app;
}

module.exports = {
  expressLoader,
};
