const startBoard = game => {
    const board   = document.getElementById('board');
    const squares = board.querySelectorAll('.square');
    const whiteSematary = document.getElementById('whiteSematary');
    const blackSematary = document.getElementById('blackSematary');
    const turnSign = document.getElementById('turn');
    
    let clickedPieceName;

  
   /*
//重置棋盘，遍历所有的棋盘方格，将内容清空，并根据当前游戏状态中的棋子位置信息将棋子重新放置到相应的方格上
    const resetBoard = () => {
        for (const square of squares) {
            square.innerHTML = '';
        }

        for (const piece of game.pieces) {
            const square = document.getElementById(piece.position);
            square.innerHTML = `<img class="piece ${piece.rank}" id="${piece.name}" src="img/${piece.color}-${piece.rank}.png">`
        }
    }

    resetBoard();
*/

const resetBoard = () => {
    for (const square of squares) {
        square.innerHTML = '';
    }

    for (const piece of game.pieces) {
        const square = document.getElementById(piece.position);
        square.innerHTML = `<img class="piece ${piece.rank}" id="${piece.name}" src="./img/${piece.color}-${piece.rank}.png">`;
    }
}

resetBoard();

      
 // 设置允许移动的方格函数，并为其周围附上阴影
    const setAllowedSquares = (pieceImg) => {
        clickedPieceName = pieceImg.id;
        const allowedMoves = game.getPieceAllowedMoves(clickedPieceName);
        if (allowedMoves) {
            const clickedSquare = pieceImg.parentNode;
            clickedSquare.classList.add('clicked-square');

            allowedMoves.forEach( allowedMove => {
                if (document.contains(document.getElementById(allowedMove))) {
                    document.getElementById(allowedMove).classList.add('allowed');
                }
            });
        }
        else{
            clearSquares();
        }
    }
//清除方格的样式函数。移除之前设置的允许移动的方格的CSS类，并将之前点击过的方格的CSS类也移除
    const clearSquares = () => {
        const allowedSquares = board.querySelectorAll('.allowed');
        allowedSquares.forEach( allowedSquare => allowedSquare.classList.remove('allowed') );
        const cllickedSquare = document.getElementsByClassName('clicked-square')[0];
        if (cllickedSquare) {
            cllickedSquare.classList.remove('clicked-square');
        }
    }
//移动棋子函数点击一个方格时，该函数会获取该方格的位置，
//并根据位置信息判断是否存在棋子。如果存在棋子且棋子颜色与当前轮到的玩家颜色相同

function movePiece(square) {
    const position = square.getAttribute('id');
    const existedPiece = game.getPieceByPos(position);

    if (existedPiece && existedPiece.color === game.turn) {
        const pieceImg = document.getElementById(existedPiece.name);
        clearSquares();
        return setAllowedSquares(pieceImg);
    }

 //  game.movePiece(clickedPieceName, position);
    
     AIturn =game.movePiece(clickedPieceName, position);
    //if(startzeroClicked && game.turn === 'black' &&AIturn){
        if( game.turn === 'black'&&startzeroClicked){
            ai.foolMove();
            /*
        const pieceImg = document.getElementById(existedPiece.name);
        clearSquares();
        return setAllowedSquares(pieceImg);
*/
       
    }
    //if(startzeroClicked && game.turn === 'black' &&AIturn){
         if ( game.turn === 'black'&&startonetClicked){
            ai.geniusMove();
            /*
        const pieceImg = document.getElementById(existedPiece.name);
        clearSquares();
        return setAllowedSquares(pieceImg);
*/
       
    }

        
        
}
//遍历所有的棋盘方格，并为每个方格添加点击、拖拽等事件监听器。当玩家点击一个方格或在一个方格上拖放时，会调用movePiece函数
    squares.forEach( square => {
        square.addEventListener('click', function () {
            if (game.turn === 'white') {
              movePiece(this);
            }});
        square.addEventListener("dragover", function(event){
            event.preventDefault();
        });
        square.addEventListener("drop", function () {
            movePiece(this);
        });
    });
//为棋子图片添加点击事件
    pieces.forEach( piece => {
        const pieceImg = document.getElementById(piece.name);
        pieceImg.addEventListener("drop", function () {
            const square = document.getElementById(piece.position);
            movePiece(square);
        });
    });

    document.querySelectorAll('img.piece').forEach( pieceImg => {
        pieceImg.addEventListener("dragstart", function(event) {
            event.stopPropagation();
            event.dataTransfer.setData("text", event.target.id);
            clearSquares();
            setAllowedSquares(event.target)
        });
        pieceImg.addEventListener("drop", function(event) {
            event.stopPropagation();
            clearSquares();
            setAllowedSquares(event.target)
        });
    });

    game.on('pieceMove', piece => {
        const square = document.getElementById(piece.position)
        square.append( document.getElementById(piece.name) );
        clearSquares();
    });

    game.on('turnChange', turn => {
        turnSign.innerHTML = turn === 'white' ? "White's 回合" : "Black's 回合";
    });

    game.on('promotion', queen => {
        const square = document.getElementById(queen.position);
        square.innerHTML = `<img class="piece queen" id="${queen.name}" src="img/${queen.color}Queen.png">`;
    })

    game.on('kill', piece => {
        const pieceImg = document.getElementById(piece.name);
        pieceImg.parentNode.removeChild(pieceImg);
        pieceImg.className = '';

        const sematary = piece.color === 'white' ? whiteSematary : blackSematary;
        sematary.querySelector('.'+piece.rank).append(pieceImg);
    });

    game.on('checkMate', color => {
        const endScene = document.getElementById('endscene');
        endScene.getElementsByClassName('winning-sign')[0].innerHTML = color + ' Wins';
        endScene.classList.add('show');
    })
}

const pieces = [
    new Rook(11, 'whiteRook1'),
    new Knight(12, 'whiteKnight1'),
    new Bishop(13, 'whiteBishop1'),
    new Queen(14, 'whiteQueen'),
    new King(15, 'whiteKing'),
    new Bishop(16, 'whiteBishop2'),
    new Knight(17, 'whiteKnight2'),
    new Rook(18, 'whiteRook2'),
    new Pawn(21, 'whitePawn1'),
    new Pawn(22, 'whitePawn2'),
    new Pawn(23, 'whitePawn3'),
    new Pawn(24, 'whitePawn4'),
    new Pawn(25, 'whitePawn5'),
    new Pawn(26, 'whitePawn6'),
    new Pawn(27, 'whitePawn7'),
    new Pawn(28, 'whitePawn8'),

    new Pawn(71, 'blackPawn1'),
    new Pawn(72, 'blackPawn2'),
    new Pawn(73, 'blackPawn3'),
    new Pawn(74, 'blackPawn4'),
    new Pawn(75, 'blackPawn5'),
    new Pawn(76, 'blackPawn6'),
    new Pawn(77, 'blackPawn7'),
    new Pawn(78, 'blackPawn8'),
    new Rook(81, 'blackRook1'),
    new Knight(82, 'blackKnight1'),
    new Bishop(83, 'blackBishop1'),
    new Queen(84, 'blackQueen'),
    new King(85, 'blackKing'),
    new Bishop(86, 'blackBishop2'),
    new Knight(87, 'blackKnight2'),
    new Rook(88, 'blackRook2')
];


const game = new Game(pieces);

startBoard(game);


let startzero = document.getElementById('the-zero');
let startzeroClicked = false;

startzero.addEventListener('click', function() {
  startzeroClicked = true;
});

let startone = document.getElementById('the-one');
let startonetClicked = false;

startone.addEventListener('click', function() {
  startonetClicked = true;
});

const ai = new aiplayer(game, 'black');

/*
function movePiece(square) {
  const position = square.getAttribute('id');
  const existedPiece = game.getPieceByPos(position);

  if (existedPiece && existedPiece.color === game.turn) {
    const pieceImg = document.getElementById(existedPiece.name);
    clearSquares();
    return setAllowedSquares(pieceImg);
  }

  game.movePiece(clickedPieceName, position);
  
  const AIturn = game.movePiece(clickedPieceName, position);
  if (startzeroClicked && game.turn === 'black' && AIturn) {
    setTimeout(() => {
      ai.foolMove();
    }, 1000);
  }
}
  */