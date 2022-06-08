import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RequestHandler } from "express";
import { Server, ServerOptions } from 'socket.io';

export class SessionAdapter extends IoAdapter {
  private session: RequestHandler;

  constructor(session: RequestHandler, app: INestApplicationContext) {
    super(app);
    this.session = session;
  }

  create(port: number, options?: ServerOptions): Server {
    let server: Server = super.create(port, options);

    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

    server.use(wrap(this.session));
    if (server.engine) {
      server.engine.on("headers", (headers, req) => {
        try {
          headers["Access-Control-Allow-Credentials"] = "true";
        } catch (err) {

        }
      });
    }
    return server;
  }
}