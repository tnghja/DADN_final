const express = require("express");
const { init: loaders } = require("./app/loaders/index.js");
const dotenv = require("dotenv");

dotenv.config();

class Server {
  constructor() {
    if (Server.instance) {
      return Server.instance;
    }
    this.app = express();
    Server.instance = this;
  }
  async startServer() {
    await loaders({ expressApp: this.app });
    const port = process.env.PORT || "3001";
    this.app.listen(port, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`App start to listen at http://localhost:${port}`);
    });
  }
}

const serverInstance = new Server();

serverInstance.startServer();

