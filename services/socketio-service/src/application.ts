// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @sourceloop/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {InvokeMiddlewareOptions, RestBindings} from '@loopback/rest';
import {
  HttpServerResolvedOptions,
  ServerOptions,
  SocketIoApplication,
} from '@loopback/socketio';
import debugFactory from 'debug';
import {SocketIoController} from './controllers';
import * as dotenv from 'dotenv';

const debug = debugFactory('loopback:example:socketio:demo');

export {ApplicationConfig};

export class SocketIoExampleApplication extends BootMixin(SocketIoApplication) {
  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    // dotenvExt.load({
    //   schema: '.env.example',
    //   errorOnMissing: true,
    //   includeProcessEnv: true,
    // });

    const allowedOrigins = process.env.ALLOWED_ORIGINS ?? '*';
    options.httpServerOptions = Object.assign({}, options.httpServerOptions, {
      host: process.env.HOST,
      port: +(process.env.PORT ?? port),
      basePath: process.env.BASE_PATH ?? '',
      cors: {
        origin: allowedOrigins.split(','),
        methods: ['GET', 'POST'],
      },
    } as HttpServerResolvedOptions);

    options.socketIoOptions = Object.assign({}, options.socketIoOptions, {
      path: `${process.env.BASE_PATH ?? ''}/socket.io`,
      cors: {
        origin: allowedOrigins.split(','),
        methods: ['GET', 'POST'],
      },
    } as ServerOptions);
    super(options);

    this.projectRoot = __dirname;

    this.socketServer.use((socket, next) => {
      debug('Global middleware - socket:', socket.id);
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      debug(
        'Middleware for namespace %s - socket: %s',
        socket.nsp.name,
        socket.id,
      );
      next();
    });
  }
}
