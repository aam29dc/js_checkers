const CG = {    //checkers game object
    turn: 'blue',
    turns: 0,
    board: [],   //0 empty square, 1 blue piece, 2 blue king, 3 red piece, 4 red king
};

let squares = document.getElementsByClassName('square');                                //for highlighting

Object.defineProperties(CG, {'ROWS': {value: 8, writable: false, configurable: false}, 'COLS': {value: 8, writable: false, configurable: false}});

CG.initBoard = (function() {
    let row = undefined;
    for(let i = 0;i<CG.COLS*CG.ROWS;i++){   //setup pieces
        row = Math.floor(i / CG.COLS);
        if((row < 3 && row % 2 === 0 && (i+1) % 2 === 0) || (row === 1 && i % 2 == 0)){
            CG.board[i] = 1;          //blue
        }
        else if((row > 4 && (row+1) % 2 == 0 && i % 2 == 0) || (row === 6 && (i+1) % 2 == 0)){
             CG.board[i] = 3;   //red
        }
        else CG.board[i] = 0;    //empty
    }
})();

CG.removePieceEventListeners = function() {
    let clone = undefined;
    if(CG.turn === 'blue'){
        let reds = document.getElementsByClassName('redpiece');
        for(let red of reds){
            clone = red.cloneNode(true);
            if(red.isKing) clone.isKing = true;     //#123
            red.parentNode.replaceChild(clone, red);
        }
    } else {
        let blues = document.getElementsByClassName('bluepiece');
        for(let blue of blues){
            clone = blue.cloneNode(true);
            if(blue.isKing) clone.isKing = true;
            blue.parentNode.replaceChild(clone, blue);
        }
    }
}

CG.removeSpaceEventListeners = function(){
    let clone = undefined;
    for(let square of squares){
        if(square.style.backgroundColor === 'gold'){
            square.style.removeProperty('background-color');
            clone = square.cloneNode(true);
            square.parentNode.replaceChild(clone, square);
        }
    }
}

CG.nextTurn = function(){
    if(CG.turns > 0){
        CG.turn = (CG.turn === 'blue') ? 'red' : 'blue';
        CG.addPieceEventListeners();
        CG.removePieceEventListeners();
    }
}

CG.goToSquare = function(){
    let num = squares[this.place].firstChild.id.replace('blue', '').replace('red', '');

    let piece = document.createElement('div');
    switch(CG.board[this.place]){
        case 1: case 2:
            piece.id = `blue${num}`
            piece.className = 'bluepiece';
            break;
        case 3: case 4:
            piece.id = `red${num}`;
            piece.className = 'redpiece';
            break;
    }
    switch(CG.board[this.place]){
        case 2: case 4:
            piece.className += ' king';
    }

    CG.board[this.square] = CG.board[this.place];
    CG.board[this.place] = 0;

    squares[this.square].style.backgroundColor = 'black';
    squares[this.place].firstChild.remove();
    squares[this.square].appendChild(piece);
    CG.removeSpaceEventListeners();
    CG.turns++;
    CG.nextTurn();
}

CG.checkSquares = function(obj, place, leftOrRight) {
    let row = Math.floor((place) / CG.COLS);
    let side = undefined;
    let dir = (CG.turn === 'blue') ? 1 : -1;
    if(leftOrRight === 'left') side = (CG.turn === 'blue') ? 7 : -9;
    else side = (CG.turn === 'blue') ? 9 : -7;

    let prevIsEnemy = undefined;
    let prevIsEmpty = false;        //for king pieces

    obj.style.backgroundColor = 'green';

    if(CG.board[place+side] === 0 && row+(1*dir) === Math.floor(((place)+side)/CG.COLS)){    //sides are empty
        squares[place+side].style.backgroundColor = 'gold';
        squares[place+side].square = place+side;
        squares[place+side].place = place;
        squares[place+side].addEventListener('click', CG.goToSquare);
    } 
    else {
        for(let i = 1;place+(side*i) < 64 && place+(side*i) > 0 && row+(i*dir) === Math.floor(((place)+(side*i))/CG.COLS);i++){ //checks for jumps
            if(CG.board[place+(side*i)] !== 0){                                                     //non-empty square
                if(squares[place+(side*i)].firstChild.getAttribute('class').replace('piece', '').replace(' king', '') === CG.turn) break;
                else {
                    if(prevIsEnemy || prevIsEmpty) break;
                    prevIsEnemy = true;
                    continue;
                }
            } else {                //empty square
                if(obj.isKing) prevIsEmpty = true;
                if(prevIsEnemy){    //prev enemy, new is empty: highlight square
                    squares[place+(side*i)].style.backgroundColor = 'gold';
                    squares[place+(side*i)].square = place+(side*(i));
                    squares[place+(side*i)].place = place;
                    squares[place+(side*i)].addEventListener('click', CG.goToSquare);
                    prevIsEnemy = false;
                } else break;       //double empty
            }
        }
    }
}

CG.checkKingMoves = function(place, leftOrRight) {
    let row = Math.floor((place) / (CG.COLS));
    let prevIsEnemy = undefined;
    let side = undefined;
    let dir = (CG.turn === 'blue') ? -1 : 1;
    if(leftOrRight === 'left') side = (CG.turn === 'blue') ? 9 : -7;
    else side = (CG.turn === 'blue') ? 7 : -9;

    if(CG.turn === 'red'){
    console.log(" ");
    console.log("king");
    console.log("place: "+place);
    console.log("row: "+row);
    console.log("dir: "+dir);
    console.log("side: "+side);
    console.log("leftOrRight: "+leftOrRight);
    console.log("place+(side*-1): "+(place+(side*-1)));
    console.log("row+(dir): "+(row+(1*dir)));
    console.log("(((place)+(side*dir))/CG.COLS): " + Math.floor(((place)+(side*-1*dir))/CG.COLS));}

    for(let i = 1;place+(side*(-i)) < 64 && place+(side*(-i)) > 0;i++){
        //if(row+(i*dir) !== Math.floor(((place)+(side*i*dir))/CG.COLS)) break;
        console.log(" ");
        console.log("i: " + i);
        //console.log("place+(side*(-i)): "+(place+(side*-i)));
        //console.log("row+(i*dir): "+(row+(i*dir)));
        //console.log("(((place)+(side*i*dir))/CG.COLS): " + Math.floor(((place)+(side*i*dir))/CG.COLS));
        if(CG.board[place+(side*(-i))] !== 0){                                      //non-empty square
            if(squares[place+(side*(-i))].firstChild.getAttribute('class').replace('piece', '').replace(' king', '') === CG.turn) break;
            else {
                if(prevIsEnemy) break;
                prevIsEnemy = true;
                continue;
            }
        } else {                //empty square
            squares[place+(side*(-i))].style.backgroundColor = 'gold';
            squares[place+(side*(-i))].square = place+(side*(-i));
            squares[place+(side*(-i))].place = place;
            squares[place+(side*(-i))].addEventListener('click', CG.goToSquare);
            //if(prevIsEnemy) break;
            break;
        }
    }
}

CG.movePiece = function(){
    let place = parseInt(this.parentNode.getAttribute('id').replace('square', ''));
    CG.removeSpaceEventListeners();

    let pieces = (CG.turn === 'blue') ? document.getElementsByClassName('bluepiece') : document.getElementsByClassName('redpiece');

    for(let piece of pieces){
        if(piece.style.backgroundColor !== '') piece.style.removeProperty('background-color');
    }

    this.style.backgroundColor = 'green';

    CG.checkSquares(this, place, 'left');
    CG.checkSquares(this, place, 'right');
    if(this.isKing){    //backwards left and right moves for Kings
        CG.checkKingMoves(place, 'left')
        CG.checkKingMoves(place, 'right')
    }
}

CG.addPieceEventListeners = function() {
    if(CG.turn === 'blue'){
        let blues = document.getElementsByClassName('bluepiece');
        for(let blue of blues){
            blue.isKing = blue.getAttribute('class').replace('bluepiece ', '') === 'king' ? true : false;
            blue.addEventListener('click', CG.movePiece);
        }
    } else {
        let reds = document.getElementsByClassName('redpiece');
        for(let red of reds){
            red.isKing = red.getAttribute('class').replace('redpiece ', '') === 'king' ? true : false;
            red.addEventListener('click', CG.movePiece);
        }
    }
}

CG.createBoard = (function() {
    let board = document.getElementById('checkersgame');
    const boardStyle = getComputedStyle(board);
    const SQUARE_HEIGHT = parseInt((boardStyle.height).replace('px', ''))/CG.ROWS;
    const SQUARE_WIDTH = parseInt((boardStyle.height).replace('px', ''))/CG.COLS;
    let row = undefined;
    let bluesCount = 0;
    let redsCount = 11;

    for(let i = 0;i<CG.COLS*CG.ROWS;i++){
        let square = document.createElement('div');
        let piece = undefined;
        row = Math.floor(i / CG.COLS);
        square.id = `square${i}`;
        square.className = 'square'
        square.style.height = SQUARE_HEIGHT;
        square.style.width = SQUARE_WIDTH;

        if((row+1) % 2 === 1) square.className += (i % 2 === 0) ? ' white' : ' black';  //create checkered pattern board
        else square.className += (i % 2 === 0) ? ' black' : ' white';
        switch(CG.board[i]){
            case 1: case 2:
                piece = document.createElement('div');
                piece.id = `blue${bluesCount}`
                piece.className = 'bluepiece';
                bluesCount++;
                break;
            case 3: case 4:
                piece = document.createElement('div');
                piece.id = `red${redsCount}`;
                piece.className = 'redpiece';
                redsCount--;
                break;
        }
        switch(CG.board[i]){
            case 2: case 4:
                piece.className += ' king';
            case 1: case 2: case 3: case 4:
                square.appendChild(piece);
                break;
        }
        board.appendChild(square);
    }
    CG.addPieceEventListeners();
})();