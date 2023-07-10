# Node-battleship

Battleship game backend using websocket with user interface in the folder './front'.
[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md)

## How to install

To run this application you have to do the following steps:

1.  Clone this repository

```bash
 git clone https://github.com/elian-cheng/node-battleship.git
```

2.  Move to the cloned repo

```bash
 cd node-battleship
```

3.  Switch the branch to `develop`

```bash
git checkout develop
```

4.  Install dependencies

```bash
npm install
```

## Commands

To start the application in the development mode

```bash
npm run start:dev
```

To start the application in the production mode

```bash
npm run start:prod
```

## How to play

1. When the server is started, go to the address http://localhost:8181/ in your browser
2. Open the same address http://localhost:8181/ in another browser tab too
3. Register with username and password in both tabs
4. In one tab click "Create a room", in other tab you'll see the available room with a player1 already in it, click "Add to room"
5. Then in both tabs you need to arrange your ships on the board, after you're done the game will start automatically
6. When the game ends, you'll see the results in a table, winner and loser players.
