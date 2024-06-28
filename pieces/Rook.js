class Rook extends Piece {
	constructor(position, name) {
		super(position, 'rook', name);
		this.ableToCastle = true;
	}

	changePosition(position) {
		this.position = parseInt(position);
		//王车换位
		this.ableToCastle = false;
	}

	getAllowedMoves() {
		return [ this.getMovesTop(), this.getMovesBottom(), this.getMovesRight(), this.getMovesLeft() ];
	}
}