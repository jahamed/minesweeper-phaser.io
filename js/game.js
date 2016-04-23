var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
    
    tileWidth: 32,
    tileHeight: 32,
    
    boardWidth: 9,
    boardHeight: 9,
    
    totalMines: 10,
};

var states = {
    game: "game",
};

var graphicAssets = {
    tiles: {URL: 'assets/tiles.png', name: 'tiles', frames: 14},
};

var fontStyles = {
    counterFontStyle: {font: '20px Arial', fill: '#FFFFFF'}
};

var gameState = function(game){
    this.boardTop;
    this.boardLeft;
    this.board;
    this.timer;
    this.counter;
    this.tf_replay;
};

gameState.prototype = {
    
    init: function () {
        // center game board relative to game world
        this.boardTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.boardHeight)) * 0.5;
        this.boardLeft = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.boardWidth)) * 0.5; 
    },
    
    preload: function () {
        // load spritesheet (has 14 elements)
        game.load.spritesheet(graphicAssets.tiles.name, graphicAssets.tiles.URL, gameProperties.tileWidth, gameProperties.tileHeight, graphicAssets.tiles.frames);
    },
    
    create: function () {
        this.initBoard();
        this.initUI();
    },

    update: function () {
        
    },
    
    initBoard: function () {
        this.board = new Board(gameProperties.boardWidth, gameProperties.boardHeight, gameProperties.totalMines);
        // move board to center of screen
        this.board.moveTo(this.boardLeft, this.boardTop);
        
        // listeners for onTileClicked and onEndGame
        this.board.onTileClicked.addOnce(this.startGame, this);
        this.board.onEndGame.addOnce(this.endGame, this);
        this.board.onTileFlagged.add(this.updateMines, this);
    },
    
    initUI: function () {
        var top = this.boardTop - 20;
        var left = this.boardLeft;
        var right = left + (gameProperties.boardWidth * gameProperties.tileWidth);
        
        this.timer = new Timer(left, top);
        this.counter = new Counter(right, top, gameProperties.totalMines);
        this.tf_replay = game.add.text(game.stage.width * 0.5, top, "Replay?", fontStyles.counterFontStyle);
        this.tf_replay.anchor.set(0.5, 0.5);
        this.tf_replay.inputEnabled = true;
        this.tf_replay.input.useHandCursor = true;
        this.tf_replay.events.onInputDown.add(this.restartGame, this);
        this.tf_replay.visible = false;
    },
    
    startGame: function () {
        this.timer.start();
    },
    
    endGame: function () {
        this.timer.stop();
        this.tf_replay.visible = true;
    },
    
    restartGame: function () {
        game.state.start(states.game);
    },
    
    updateMines: function (value) {
        this.counter.update(value);
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);