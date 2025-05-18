import express from 'express';
import rateLimit from 'express-rate-limit';
import { IncomingMessage, Server, ServerResponse } from 'http';

const responseString = 'Hello from backend Server';

export interface IBackendServer {
  PORT: number;
  server: Server<typeof IncomingMessage, typeof ServerResponse>;

  getServer(): Server<typeof IncomingMessage, typeof ServerResponse>;
  close(): Server<typeof IncomingMessage, typeof ServerResponse>;
}

export class BackendServer implements IBackendServer {
  PORT: number;
  server: Server<typeof IncomingMessage, typeof ServerResponse>;

  constructor(port: number) {
    this.PORT = port;

    const app = this.createExpressApp();
    const server = app.listen(port, () => {
      console.log('Backend Server listening on port ' + this.PORT);
    });

    this.server = server;
  }

  public getServer(): Server<typeof IncomingMessage, typeof ServerResponse> {
    return this.server;
  }

  public close(): Server<typeof IncomingMessage, typeof ServerResponse> {
    const server = this.server.close();
    console.log(`Closed Backend Server with port ${this.PORT}`);
    return server;
  }

  private createExpressApp() {
    const app = express();
    app.set('trust proxy', false);

    // Rate limiter config: max 50 requests per 1 minute per IP
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 50,             // limit each IP to 50 requests per windowMs
      message: 'Too many requests, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });

    // Apply rate limiter to all requests
    app.use(limiter);

    app.use(express.text());
    app.use(express.json());

    app.get('/ping', (req, res) => {
      res.sendStatus(200);
    });

    app.get('/', (req, res) => {
      res.status(200).send(`[${req.hostname}:${this.PORT}]` + responseString);
    });
    
    return app;
  }
}
