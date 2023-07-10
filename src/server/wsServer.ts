import ActionController from '../controllers/actionController';
import PlayerController from '../controllers/playerController';
import GameController from '../controllers/gameController';
import App from '../app';

const createWsServer = () => {
  const actionController = new ActionController({
    playerController: new PlayerController(),
    gameController: new GameController(),
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
