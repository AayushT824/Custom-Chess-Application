import blackKing from "./img/king.png";
import blackQueen from "./img/queen.png";
import blackBishop from "./img/bishop.png";
import blackKnight from "./img/knight.png";
import blackRook from "./img/rook.png";
import blackPawn from "./img/pawn.png";

import whiteKing from "./img/whiteKing.png";
import whiteQueen from "./img/whiteQueen.png";
import whiteBishop from "./img/whiteBishop.png";
import whiteKnight from "./img/whiteKnight.png";
import whiteRook from "./img/whiteRook.png";
import whitePawn from "./img/whitePawn.png";

//Superclass of all pieces
export default class Piece {

    constructor(location, color) {
        this.SIZE = 60 //size of image dimensions
        this.loc = location //location of piece
        this.color = color //color of piece, 1 if white and -1 if black
    }

    //returns list of possible spaces that can be moved to by a long range piece in given direction(s)
    //each non-board parameter is a boolean representing whether or not to continue adding spaces in that direction
    //abstracts moveset function for all long-range pieces (rook, queen, bishop)
    spacesInDirection(board, straight, diagonal, wantThreatened) {
        let counter = 1
        let moves = []

        let top = false
        let bottom = false
        let topLeft = false
        let topRight = false
        let left = false
        let right = false
        let bottomLeft = false
        let bottomRight = false

        //moves horizontal/vertical?
        if (straight) { top = true; left = true; right = true; bottom = true; }

        //moves diagonally?
        if (diagonal) { topLeft = true; bottomLeft = true; topRight = true; bottomRight = true; }

        //runs loop until all directions have reached a termination space
        while (topLeft || top || topRight || right || bottomRight || bottom || bottomLeft || left) {
            const x = this.loc[0] //x location of this piece
            const y = this.loc[1] //y location of this piece

            //check if next space would be out of bounds
            if (x - counter < 0) { topLeft = false; top = false; topRight = false }
            if (x + counter > 7) { bottomLeft = false; bottom = false; bottomRight = false }
            if (y - counter < 0) { topLeft = false; left = false; bottomLeft = false }
            if (y + counter > 7) { bottomRight = false; right = false; topRight = false }

            //Only adds spaces in each direction so long as the boolean representing that direction stays true
            if (topLeft) {
                topLeft = this.incrementSpace(board, board.spaces[x - counter][y - counter], moves, wantThreatened)
            }
            if (top) {
                top = this.incrementSpace(board, board.spaces[x - counter][y], moves, wantThreatened)
            }
            if (topRight) {
                topRight = this.incrementSpace(board, board.spaces[x - counter][y + counter], moves, wantThreatened)
            }
            if (right) {
                right = this.incrementSpace(board, board.spaces[x][y + counter], moves, wantThreatened)
            }
            if (bottomRight) {
                bottomRight = this.incrementSpace(board, board.spaces[x + counter][y + counter], moves, wantThreatened)
            }
            if (bottom) {
                bottom = this.incrementSpace(board, board.spaces[x + counter][y], moves, wantThreatened)
            }
            if (bottomLeft) {
                bottomLeft = this.incrementSpace(board, board.spaces[x + counter][y - counter], moves, wantThreatened)
            }
            if (left) {
                left = this.incrementSpace(board, board.spaces[x][y - counter], moves, wantThreatened)
            }

            counter += 1
        }

        return moves;
    }

    //further abstracts behavior from spacesInDirection method
    incrementSpace(board, nextSpace, moves, isThreatened) {
        if (isThreatened) {
            if (nextSpace.piece == null) {
                moves.push([nextSpace.loc[0], nextSpace.loc[1]])
                return true
            }
            else if (nextSpace.piece.color == this.color) { return false }
            else { //if nextSpace's piece is an enemy piece
                moves.push([nextSpace.loc[0], nextSpace.loc[1]])
                return false
            }
        }
        if (nextSpace.piece == null && !board.willCauseSelfCheck(this, nextSpace)) {
            moves.push([nextSpace.loc[0], nextSpace.loc[1]])
        }
        else if (nextSpace.piece.color == this.color) { return false }
        else if (!board.willCauseSelfCheck(this, nextSpace)) { //if nextSpace's piece is an enemy piece
            moves.push([nextSpace.loc[0], nextSpace.loc[1]])
            return false
        }
        return true
    }

    //returns location of enemy king to this piece
    oppositeKing(board) {
        if (this.color == 1) { //white
            return board.blackKingLoc
        }
        else { //black
            return board.whiteKingLoc
        }
    }
}

export class King extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteKing} height={this.SIZE} width={this.SIZE} />
            )
        }
        else {
            return (
                <img src={blackKing} height={this.SIZE} width={this.SIZE} />
            )
        }
    }

    //King moveset
    moveSet(board) {
        let possibleSpaces = []
        //iterate through rows
        for (let i = this.loc[0] - 1; i < this.loc[0] + 2; i++) {
            //iterate through columns
            for (let j = this.loc[1] - 1; j < this.loc[1] + 2; j++) {
                //valid space to move to
                if (i >= 0 && i <= 7 && j >= 0 && j <= 7 && [i, j] != this.loc &&
                    (board.spaces[i][j].piece == null || board.spaces[i][j].piece.color != this.color)) {
                    //only include space in moveset if moving there will not result in your king being threatened
                    if (!board.willCauseSelfCheck(this, board.spaces[i][j])) {
                        possibleSpaces.push([i, j])
                    }
                }
            }
        }

        return possibleSpaces;
    }

    threatened(board) {
        let threatenedSpaces = []

        for (let i = this.loc[0] - 1; i < this.loc[0] + 2; i++) {
            //iterate through columns
            for (let j = this.loc[1] - 1; j < this.loc[1] + 2; j++) {
                //valid space to move to
                if (i >= 0 && i <= 7 && j >= 0 && j <= 7 && [i, j] != this.loc) {
                    threatenedSpaces.push([i, j])
                }
            }
        }

        return threatenedSpaces
    }


}

export class Queen extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteQueen} height={this.SIZE} width={this.SIZE} />
            )
        }
        else {
            return (
                <img src={blackQueen} height={this.SIZE} width={this.SIZE} />
            )
        }
    }

    moveSet(board) {
        //Queen moves in all directions
        return this.spacesInDirection(board, true, true, false);
    }

    threatened(board) {
        //Queen moves in all directions
        return this.spacesInDirection(board, true, true, true);
    }
}

export class Bishop extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteBishop} height={this.SIZE} width={this.SIZE} />
            )
        }
        else {
            return (
                <img src={blackBishop} height={this.SIZE} width={this.SIZE} />
            )
        }
    }

    moveSet(board) {
        //Bishop only moves diagonally 
        return this.spacesInDirection(board, false, true, false);
    }

    threatened(board) {
        //Bishop only moves diagonally 
        return this.spacesInDirection(board, false, true, true);
    }
}

export class Knight extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteKnight} height={this.SIZE} width={this.SIZE} />
            )
        }
        else {
            return (
                <img src={blackKnight} height={this.SIZE} width={this.SIZE} />
            )
        }
    }

    moveSet(board) {
        const possibleMoves = []

        //All moves a knight could make assuming on an empty board with spaces on all sides
        const moves = [[this.loc[0] - 2, this.loc[1] - 1], [this.loc[0] - 1, this.loc[1] - 2], [this.loc[0] + 2, this.loc[1] - 1],
        [this.loc[0] + 1, this.loc[1] - 2], [this.loc[0] - 2, this.loc[1] + 1], [this.loc[0] - 1, this.loc[1] + 2], [this.loc[0] + 1, this.loc[1] + 2],
        [this.loc[0] + 2, this.loc[1] + 1]]

        //loops through each move and decides whether or not it is possible and/or if it is a threatened space
        moves.forEach(item => {
            if (item[0] > 0 && item[0] <= 7 && item[1] > 0 && item[1] <= 7) {
                const nextSpace = board.spaces[item[0]][item[1]]
                if (nextSpace.piece == null && !board.willCauseSelfCheck(this, nextSpace)) {
                    possibleMoves.push([item[0], item[1]])
                }
                else if (nextSpace.piece.color == this.color) { }
                else if (!board.willCauseSelfCheck(this, nextSpace)) { //if nextSpace's piece is an enemy piece
                    possibleMoves.push([nextSpace.loc[0], nextSpace.loc[1]])
                }
            }
        })

        return possibleMoves;
    }

    threatened(board) {
        const threatenedSpaces = []

        //All moves a knight could make assuming on an empty board with spaces on all sides
        const moves = [[this.loc[0] - 2, this.loc[1] - 1], [this.loc[0] - 1, this.loc[1] - 2], [this.loc[0] + 2, this.loc[1] - 1],
        [this.loc[0] + 1, this.loc[1] - 2], [this.loc[0] - 2, this.loc[1] + 1], [this.loc[0] - 1, this.loc[1] + 2], [this.loc[0] + 1, this.loc[1] + 2],
        [this.loc[0] + 2, this.loc[1] + 1]]

        //loops through each move and decides whether or not it is possible and/or if it is a threatened space
        moves.forEach(item => {
            if (item[0] > 0 && item[0] <= 7 && item[1] > 0 && item[1] <= 7) {
                threatenedSpaces.push([item[0], item[1]])
            }
        })

        return threatenedSpaces;
    }
}

export class Rook extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteRook} height={this.SIZE} width={this.SIZE} />
            )
        }
        else {
            return (
                <img src={blackRook} height={this.SIZE} width={this.SIZE} />
            )
        }
    }

    moveSet(board) {
        //Rook only moves horizontally and vertically
        return this.spacesInDirection(board, true, false, false);
    }

    threatened(board) {
        //Rook only moves horizontally and vertically
        return this.spacesInDirection(board, true, false, true);
    }
}

export class Pawn extends Piece {
    constructor(loc, color, piece) {
        if (piece == undefined) {
            super(loc, color, piece);
            this.hasMoved = false
        }
        else {
            super(loc, color, piece);
            this.hasMoved = piece.hasMoved
        }
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whitePawn} height={this.SIZE} width={this.SIZE} />
            )
        }
        else {
            return (
                <img src={blackPawn} height={this.SIZE} width={this.SIZE} />
            )
        }
    }

    moveSet(board) {
        const x = this.loc[0]
        const y = this.loc[1]
        let possibleMoves = []

        //if color is white (starts on bottom)
        if (this.color == 1) {
            //scenarios where only one space forward is a legal move
            if (board.spaces[x - 1][y].piece == null && (this.hasMoved || (!this.hasMoved && board.spaces[x - 2][y].piece != null)) && !board.willCauseSelfCheck(this, board.spaces[x - 1][y])) {
                possibleMoves = [[x - 1, y]]
            }
            //scenarios where one and two spaces forward are legal moves
            else if (!this.hasMoved && board.spaces[x - 1][y].piece == null && board.spaces[x - 2][y].piece == null && !board.willCauseSelfCheck(this, board.spaces[x - 1][y])) {
                possibleMoves = [[x - 1, y], [x - 2, y]]
            }

            //can take pieces diagonally?
            if (x - 1 > 0 && x - 1 <= 7 && y - 1 > 0 && y - 1 <= 7 && board.spaces[x - 1][y - 1].piece != null && board.spaces[x - 1][y - 1].piece.color != 1 && !board.willCauseSelfCheck(this, board.spaces[x - 1][y - 1])) {
                possibleMoves.push([x - 1, y - 1])
            }
            if (x - 1 > 0 && x - 1 <= 7 && y + 1 > 0 && y + 1 <= 7 && board.spaces[x - 1][y + 1].piece != null && board.spaces[x - 1][y + 1].piece.color != 1 && !board.willCauseSelfCheck(this, board.spaces[x - 1][y + 1])) {
                possibleMoves.push([x - 1, y + 1])
            }
        }
        else {
            //scenarios where only one space forward is a legal move
            if (board.spaces[x + 1][y].piece === null && (this.hasMoved || (!this.hasMoved && board.spaces[x + 2][y].piece != null)) && !board.willCauseSelfCheck(this, board.spaces[x + 1][y])) {
                possibleMoves = [[x + 1, y]]
            }
            //scenarios where one and two spaces forward are legal moves
            else if (!this.hasMoved && board.spaces[x + 1][y].piece == null && board.spaces[x + 2][y].piece == null && !board.willCauseSelfCheck(this, board.spaces[x + 1][y])) {
                possibleMoves = [[x + 1, y], [x + 2, y]]
            }

            //can take pieces diagonally?
            if (x + 1 > 0 && x + 1 <= 7 && y + 1 > 0 && y + 1 <= 7 && board.spaces[x + 1][y + 1].piece != null && board.spaces[x + 1][y + 1].piece.color != 1 && !board.willCauseSelfCheck(this, board.spaces[x + 1][y + 1])) {
                possibleMoves.push([x + 1, y + 1])
            }
            if (x + 1 > 0 && x + 1 <= 7 && y - 1 > 0 && y - 1 <= 7 && board.spaces[x + 1][y - 1].piece != null && board.spaces[x + 1][y - 1].piece.color != 1 && !board.willCauseSelfCheck(this, board.spaces[x + 1][y - 1])) {
                possibleMoves.push([x + 1, y - 1])
            }
        }

        return possibleMoves
    }

    threatened(board) {
        const x = this.loc[0]
        const y = this.loc[1]
        let threatenedSpaces = []

        //if color is white (starts on bottom)
        if (this.color == 1) {
            threatenedSpaces.push([x - 1, y + 1])
            threatenedSpaces.push([x - 1, y - 1])
        }
        else {
            threatenedSpaces.push([x + 1, y - 1])
            threatenedSpaces.push([x + 1, y + 1])
        }

        return threatenedSpaces
    }
}