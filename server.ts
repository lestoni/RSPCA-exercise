/**
 * Load Module Dependencies
 */

import * as http from "http";

import Debug from "debug";
import { createConnection } from 'typeorm';
import 'reflect-metadata';

import  { config } from "./config";
import  app from "./app";

const PORT  = config.PORT;

let debug = Debug("api:server");

//-- Create HTTP Server --//

let server = http.createServer(app.callback());

createConnection({
    type: 'sqlite',
    database: config.DB_URL,
    synchronize: true,
    logging: false,
    entities: [
       'entity/**/*.ts'
    ]
 })
  .then(()=> {
    // Listen on provided port, on all network interfaces
    server.listen(PORT);

    // Set Error Handler for the server
    server.on('error', (error:any ) => {
      debug('Server ConnectionError Triggered');

      if (error.syscall !== 'listen') {
        throw error;
      }

      let bind = (typeof PORT === 'string') ? `Pipe ${PORT}` : `Port ${PORT}`;

      // Handle Specific listen errors with friendly messages.
      switch(error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    })

    // Set handler for 'listening' event
    server.on('listening', () => {
      let addr = server.address();
      let bind = (typeof PORT === 'string') ? `Pipe ${PORT}` : `Port ${PORT}`;

      debug(`Listening on ${bind}`);

  });

});
