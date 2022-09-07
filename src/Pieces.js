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
    spacesInDirection(board, straight, diagonal) {
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
                topLeft = this.incrementSpace(board.spaces[x - counter][y - counter], moves)
            }
            if (top) {
                top = this.incrementSpace(board.spaces[x - counter][y], moves)
            }
            if (topRight) {
                topRight = this.incrementSpace(board.spaces[x - counter][y + counter], moves)
            }
            if (right) {
                right = this.incrementSpace(board.spaces[x][y + counter], moves)
            }
            if (bottomRight) {
                bottomRight = this.incrementSpace(board.spaces[x + counter][y + counter], moves)
            }
            if (bottom) {
                bottom = this.incrementSpace(board.spaces[x + counter][y], moves)
            }
            if (bottomLeft) {
                bottomLeft = this.incrementSpace(board.spaces[x + counter][y - counter], moves)
            }
            if (left) {
                left = this.incrementSpace(board.spaces[x][y - counter], moves)
            }

            counter += 1
        }

        return moves
    }

    //further abstracts behavior from spacesInDirection method
    incrementSpace(nextSpace, moves) {
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

    //returns location of enemy king to this piece
    oppositeKing(board) {
        if (this.color == 1) { //white
            return board.blackKingLoc
        }
        else { //black
            return board.whiteKingLoc
        }
    }

    updateLoc(toSpace) {}

    needPromotion() {
        return 0
    }

    promote() {}
}

export class King extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    updateLoc(toSpace) {
        if (this.color == 1) { this.whiteKingLoc = toSpace.loc }
        else { this.blackKingLoc = toSpace.loc }
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteKing} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
        else {
            return (
                <img src={blackKing} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
    }

    moveSet(board) {
        let threatenedSpaces = []

        for (let i = this.loc[0] - 1; i < this.loc[0] + 2; i++) {
            //iterate through columns
            for (let j = this.loc[1] - 1; j < this.loc[1] + 2; j++) {
                //valid space to move to
                if (i >= 0 && i <= 7 && j >= 0 && j <= 7 && [i, j] != this.loc && (board.spaces[i][j].piece == null || board.spaces[i][j].piece.color != this.color)) {
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
                <img src={whiteQueen} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
        else {
            return (
                <img src={blackQueen} height={this.SIZE} width={this.SIZE} className = "Centered" />
            )
        }
    }

    moveSet(board) {
        //Queen moves in all directions
        return this.spacesInDirection(board, true, true);
    }
}

export class Bishop extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteBishop} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
        else {
            return (
                <img src={blackBishop} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
    }

    moveSet(board) {
        //Bishop only moves diagonally 
        return this.spacesInDirection(board, false, true);
    }
}

export class Knight extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece);
    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whiteKnight} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
        else {
            return (
                <img src={blackKnight} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
    }

    moveSet(board) {
        const threatenedSpaces = []

        //All moves a knight could make assuming on an empty board with spaces on all sides
        const moves = [[this.loc[0] - 2, this.loc[1] - 1], [this.loc[0] - 1, this.loc[1] - 2], [this.loc[0] + 2, this.loc[1] - 1],
        [this.loc[0] + 1, this.loc[1] - 2], [this.loc[0] - 2, this.loc[1] + 1], [this.loc[0] - 1, this.loc[1] + 2], [this.loc[0] + 1, this.loc[1] + 2],
        [this.loc[0] + 2, this.loc[1] + 1]]

        //loops through each move and decides whether or not it is possible and/or if it is a threatened space
        moves.forEach(item => {
            if (item[0] >= 0 && item[0] <= 7 && item[1] >= 0 && item[1] <= 7) {
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
                <img src={whiteRook} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
        else {
            return (
                <img src={blackRook} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
    }

    moveSet(board) {
        //Rook only moves horizontally and vertically
        return this.spacesInDirection(board, true, false);
    }
}

export class Pawn extends Piece {
    constructor(loc, color, piece) {
        super(loc, color, piece)
        if (piece == undefined) {
            this.hasMoved = false
        }
        else {
            this.hasMoved = piece.hasMoved
        }
    }

    updateLoc(toSpace) {
        this.hasMoved = true
    }

    //determines if pawn promotion is now necessary
    needPromotion() {
        if (this.loc[0] == 0 || this.loc[0] == 7) {
            return this.color
        }
        else {
            return 0
        }
    }

    //Promotes pawn to given piece
    promote(board, piece) {
        if (!this.needPromotion()) {
            throw 'Cannot promote pawn without proper positioning'
        }

        const x = this.loc[0]
        const y = this.loc[1]

        if (piece == 'Queen') {
            board.spaces[x][y].piece = new Queen([x,y], this.color)
        }
        else if (piece == 'Bishop') {
            board.spaces[x][y].piece = new Bishop([x,y], this.color)
        }
        else if (piece == 'Knight') {
            board.spaces[x][y].piece = new Knight([x,y], this.color)
        }
        else if (piece == 'Rook') {
            board.spaces[x][y].piece = new Rook([x,y], this.color)
        }

    }

    getImage() {
        if (this.color == 1) {
            return (
                <img src={whitePawn} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
        else {
            return (
                <img src={blackPawn} height={this.SIZE} width={this.SIZE} className = "Centered"/>
            )
        }
    }

    moveSet(board) {
        const x = this.loc[0]
        const y = this.loc[1]
        let possibleMoves = []

        //if color is white (starts on bottom)
        if (this.color == 1) {
            if (x == 0) {
                return possibleMoves
            }

            //scenarios where only one space forward is a legal move
            if (board.spaces[x - 1][y].piece == null && (this.hasMoved || (!this.hasMoved && board.spaces[x - 2][y].piece != null))) {
                possibleMoves = [[x - 1, y]]
            }
            //scenarios where one and two spaces forward are legal moves
            else if (!this.hasMoved && board.spaces[x - 1][y].piece == null && board.spaces[x - 2][y].piece == null) {
                possibleMoves = [[x - 1, y], [x - 2, y]]
            }

            //can take pieces diagonally?
            if (x - 1 >= 0 && x - 1 <= 7 && y - 1 >= 0 && y - 1 <= 7 && board.spaces[x - 1][y - 1].piece != null && board.spaces[x - 1][y - 1].piece.color != 1) {
                possibleMoves.push([x - 1, y - 1])
            }
            if (x - 1 >= 0 && x - 1 <= 7 && y + 1 >= 0 && y + 1 <= 7 && board.spaces[x - 1][y + 1].piece != null && board.spaces[x - 1][y + 1].piece.color != 1) {
                possibleMoves.push([x - 1, y + 1])
            }
        }
        else {
            if (x == 7) {
                return possibleMoves
            }

            //scenarios where only one space forward is a legal move
            if (board.spaces[x + 1][y].piece === null && (this.hasMoved || (!this.hasMoved && board.spaces[x + 2][y].piece != null))) {
                possibleMoves = [[x + 1, y]]
            }
            //scenarios where one and two spaces forward are legal moves
            else if (!this.hasMoved && board.spaces[x + 1][y].piece == null && board.spaces[x + 2][y].piece == null) {
                possibleMoves = [[x + 1, y], [x + 2, y]]
            }

            //can take pieces diagonally?
            if (x + 1 >= 0 && x + 1 <= 7 && y + 1 >= 0 && y + 1 <= 7 && board.spaces[x + 1][y + 1].piece != null && board.spaces[x + 1][y + 1].piece.color != 0) {
                possibleMoves.push([x + 1, y + 1])
            }
            if (x + 1 >= 0 && x + 1 <= 7 && y - 1 >= 0 && y - 1 <= 7 && board.spaces[x + 1][y - 1].piece != null && board.spaces[x + 1][y - 1].piece.color != 0) {
                possibleMoves.push([x + 1, y - 1])
            }
        }

        return possibleMoves
    }
}