class aiplayer{
    //默认电脑是黑色
constructor(game,color){
    this.game = game;
    this.color = color;
}

//获取棋子信息
getAIpieces() {
    const pieces = this.game.getPiecesByColor(this.color);
    return pieces.filter(piece => this.game.getPieceAllowedMoves(piece.name).length > 0);
}
//笨蛋算法
foolMove() {
    const foolPieces = this.getAIpieces();
    if (foolPieces.length === 0) return;
  
    const piece = foolPieces[Math.floor(Math.random() * foolPieces.length)];
    const allowedMoves = this.game.getPieceAllowedMoves(piece.name);
    const move = allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
    this.game.movePiece(piece.name, move);
  }

  evaluatePiece(piece) {    
    let weight = 0; // 初始化当前棋子的权重为0  
    
    // 检查棋子的name是否包含"pawn"等  
    if (piece.name.includes('Pawn')) {    
        weight = 10; // 如果包含，设置权重为10  
    } else if (piece.name.includes('Bishop')) {    
        weight = 40; // 如果包含，设置权重为40  
    } else if (piece.name.includes('King')) {    
        weight = 90; // 如果包含，设置权重为90  
    } else if (piece.name.includes('Knight')) {    
        weight = 60; // 如果包含，设置权重为60  
    } else if (piece.name.includes('Queen')) {    
        weight = 80; // 如果包含，设置权重为80  
    } else if (piece.name.includes('Rook')) {    
        weight = 70; // 如果包含，设置权重为70  
    }  
    
    // 返回单个棋子的权重  
    return weight;    
}  
  //天才算法
geniusMove() {  
    const geniusPieces = this.getAIpieces();  
    if (geniusPieces.length === 0) return;  
  
    // 创建一个数组来存储每个棋子和其评估值  
    const evaluatedPieces = geniusPieces.map(piece => ({  
        piece,  
        weight: this.evaluatePiece(piece) 
    }));  
  
    // 根据权重对棋子进行排序（降序）  
    evaluatedPieces.sort((a, b) => b.weight - a.weight);  
  
    // 选择权重最高的棋子进行移动  
    const bestPiece = evaluatedPieces[0].piece;  
    const allowedMoves = this.game.getPieceAllowedMoves(bestPiece.name);  
   
    const move = allowedMoves[Math.floor(Math.random() * allowedMoves.length)];  
  
    this.game.movePiece(bestPiece.name, move);  
}  


 
  // 实现博弈树算法的函数!!!
  //失败的尝试自此以下的代码以后再改。
  makeMoveWithGameTree(depth) {
    const rootNode = { move: null, children: [] };

    this.buildGameTree(depth, rootNode, true); // 构建博弈树

    // 根据博弈树的评估结果选择最优的移动
    let bestMove = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const child of rootNode.children) {
      if (child.score > bestScore) {
        bestMove = child.move;
        bestScore = child.score;
      }
    }

    if (bestMove) {
      // 移动棋子
      const { pieceName, targetPosition } = bestMove;
      this.game.movePiece(pieceName, targetPosition);
    }
  }

  buildGameTree(depth, node, maximizingPlayer) {
    if (depth === 0 || this.game.isGameOver()) {
      // 达到搜索深度或游戏结束时，评估当前局面并将得分保存在节点中
      node.score = this.evaluatePosition();
      return;
    }

    const pieces = this.getAIpieces();

    for (const piece of pieces) {
      const allowedMoves = this.game.getPieceAllowedMoves(piece.name);

      for (const move of allowedMoves) {
        // 在副本游戏中执行移动
        const gameCopy = this.game.clone();
        gameCopy.movePiece(piece.name, move);

        // 创建子节点
        const childNode = { move: { pieceName: piece.name, targetPosition: move }, children: [] };

        // 递归构建博弈树
        this.buildGameTree(depth - 1, childNode, !maximizingPlayer);

        // 将子节点添加到父节点中
        node.children.push(childNode);
      }
    }

    if (maximizingPlayer) {
      //选择子节点中的最高得分
      let maxScore = Number.NEGATIVE_INFINITY;
      for (const child of node.children) {
        if (child.score > maxScore) {
          maxScore = child.score;
        }
      }
      node.score = maxScore;
    } else {
      // 选择子节点中的最低得分
      let minScore = Number.POSITIVE_INFINITY;
      for (const child of node.children) {
        if (child.score < minScore) {
          minScore = child.score;
        }
      }
      node.score = minScore;
    }
  }

  evaluatePosition() {


    const aiPieces = this.getAIpieces();
    const playerPieces = this.game.getPiecesByColor(this.game.getOpponentColor(this.color));

    // 计算AI玩家的棋子数量得分
    const aiPieceCount = aiPieces.length;
    const playerPieceCount = playerPieces.length;
    const pieceCountScore = aiPieceCount - playerPieceCount;

    // 返回总得分
    return pieceCountScore;
  }
}