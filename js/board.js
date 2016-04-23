var Board = function (columns, rows, mines) {

    var board = [];
    var flaggedTiles = [];
    var group = game.add.group();
    
    this.onTileClicked = new Phaser.Signal();
    this.onEndGame = new Phaser.Signal();
    this.onTileFlagged = new Phaser.Signal();
    
    var self = this;
    
    var init = function () {
        for (var y = 0; y < rows; y++) {
            var row = [];
            
            for (var x = 0; x < columns; x++) {
                var tile = new Tile(x, y, group);
                tile.onRevealed.add(onReveal, this);
                tile.onFlag.add(onFlag, this);
                row.push(tile);
            }
            
            board.push(row);
        }  
        
        setMines();
    };
    
    this.moveTo = function (x, y) {
        group.x = x;
        group.y = y;
    };
    
    var getRandomTile = function () {
        var randomRow = Math.floor(Math.random() * rows);
        var randomColumn = Math.floor(Math.random() * columns);
        
        var tile = board[randomRow][randomColumn];
        return tile;
    };
    
    var setMines = function () {
        var tile = getRandomTile();
        
        for (var i = 0; i < mines; i++) {
            while (tile.getValue() == tile.states.MINE) {
                tile = getRandomTile();
            }
            
            tile.setValue(tile.states.MINE);
            updateSurroundingTiles(tile);
            tile = getRandomTile();
        }
    };
    
    var updateSurroundingTiles = function (tile) {
        var targetTile;
        var surroundingTiles = getSurroundingTiles(tile);
            
        for (var i=0; i<surroundingTiles.length; i++) {
            targetTile = surroundingTiles[i];
            
            if (targetTile.getValue() == tile.states.MINE) {
                continue;
            }

            targetTile.setValue(targetTile.getValue() + 1);
        }
    }
    
    var getSurroundingTiles = function (tile) {
        var tileList = [];
        var targetTile;
        var column;
        var row;
        
        for (var y = -1; y <= 1; y++) {
            for (var x = -1; x <= 1; x++) {
                if (!x && !y) {
                    continue;
                }

                column = tile.column + x;
                row = tile.row + y;

                if (row < 0 || row >= rows || column < 0 || column >= columns) {
                    continue;
                }
                
                targetTile = board[row][column];
                
                tileList.push(targetTile);
            }
        }
        
        return tileList;
    };
    
    var revealEmptyTiles = function (tile) {
        var tileList = [tile];
        var surroundingTiles;
        var currentTile;
        
        while (tileList.length) {
            currentTile = tileList[0];
            surroundingTiles = getSurroundingTiles(currentTile);
            
            while (surroundingTiles.length) {
                currentTile = surroundingTiles.shift();
                
                if (currentTile.isRevealed()) {
                    continue;
                }
                
                currentTile.onRevealed.remove(onReveal, this);
                currentTile.reveal();
                
                if (currentTile.getValue() == currentTile.states.ZERO) {
                    tileList.push(currentTile);
                }
            }
            
            tileList.shift();
        }
    };
    
    var onReveal = function (tile) {
        self.onTileClicked.dispatch();
        var value = tile.getValue();
        
        if (value == tile.states.MINE) {
            revealAll();
        } else if (value == tile.states.ZERO) {
            revealEmptyTiles(tile);
        }
    };
    
    var onFlag = function (tile) {
        self.onTileClicked.dispatch();
        
        if (tile.getState() == tile.states.FLAG) {
            flaggedTiles.push(tile);
        } else {
            for (var i = 0; i < flaggedTiles.length; i++) {
                if (flaggedTiles[i] == tile) {
                    flaggedTiles.splice(i, 1);
                }
            }
        }
        
        self.onTileFlagged.dispatch(flaggedTiles.length);
    }
    
    var revealAll = function () {
        self.onEndGame.dispatch();
        
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                var tile = board[y][x];
                
                if (tile.isRevealed()) {
                    continue;
                }
                
                tile.onRevealed.remove(onReveal, this); // remove listener
                tile.reveal();
            }
        }
    };
    
    init();
};