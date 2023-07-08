import { WebSocketServer } from 'ws';

const createWsServer = (port = 3000) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });

    ws.send('something');
  });
};

const wsServer = {
  listen: (port: number) => {
    createWsServer(port);
  },
};

export default wsServer;
