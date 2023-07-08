import ActionController from '../actionController';
import App from '../app';

const createWsServer = () => {
  const actionController = new ActionController();
  const app = new App({ actionController });
  return app;
};

const wsServer = {
  listen: (port: number) => {
    createWsServer().listen(port);
  },
};

export default wsServer;
