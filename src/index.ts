import httpServer from './httpServer/index';
import { env } from 'process';
import wsServer from './wsServer/index';

const HTTP_PORT = Number(env.HTTP_PORT) || 8181;
const WEBSOCKET_PORT = Number(env.WS_PORT) || 3000;

httpServer.listen(HTTP_PORT);
console.log(`Http server is listening on http://localhost:${HTTP_PORT}`);

wsServer.listen(WEBSOCKET_PORT);
console.log(`Websocket server is listening on ws://localhost:${WEBSOCKET_PORT}`);
