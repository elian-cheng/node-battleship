import ActionController from '../controllers/actionController';
import PlayerController from '../controllers/playerController';
import App from '../app';

const createWsServer = () => {
  const actionController = new ActionController({
    playerController: new PlayerController(),
  });
  const app = new App({ actionController });
  return app;
};

const wsServer = {
  listen: (port: number) => {
    createWsServer().listen(port);
  },
};

export default wsServer;
