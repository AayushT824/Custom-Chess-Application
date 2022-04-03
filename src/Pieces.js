//Superclass of all pieces
class Piece {
    loc //location of piece
    color //color of piece, 1 if white and -1 if black

    constructor(location, color) {
        this.loc = location;
        this.color = color;
    }

    //creates copy of given piece
    constructor(piece) {
        this.loc = piece.loc;
        this.color = piece.color;
    }

    //returns list of possible moves from this spot by this piece and list of threatened spaces in that order
    moveSet(board)

    //returns list of possible spaces that can be moved to by a long range piece in given direction(s)
    //each non-board parameter is a boolean representing whether or not to continue adding spaces in that direction
    //abstracts moveset function for all long-range pieces (rook, queen, bishop)
    spacesInDirection(board, straight, diagonal) {
        counter = 0
        possibleMoves = []
        threatenedSpaces = []

        //moves horizontal/vertical?
        if (straight) { top = true; left = true; right = true; bottom = true; }
        else { top = false; left = false; right = false; bottom = false; }

        //moves diagonally?
        if (diagonal) { topLeft = true; bottomLeft = true; topRight = true; bottomRight = true; }
        else { topLeft = false; bottomLeft = false; topRight = false; bottomRight = false; }

        //runs loop until all directions have reached a termination space
        while (topLeft && top && topRight && right && bottomRight && bottom && bottomLeft && left) {
            x = this.loc[0] //x location of this piece
            y = this.loc[1] //y location of this piece

            //check if next space would be out of bounds
            if (x - counter < 0) { topLeft = false; left = false; bottomLeft = false }
            if (x + counter > 7) { bottomRight = false; right = false; topRight = false }
            if (y - counter < 0) { topLeft = false; top = false; topRight = false }
            if (y + counter > 7) { bottomLeft = false; bottom = false; bottomRight = false }

            //Only adds spaces in each direction so long as the boolean representing that direction stays true
            if (topLeft) {
                topLeft = this.incrementSpace(board, board.spaces[x - counter][y - counter], possibleMoves, threatenedSpaces)
            }
            if (top) {
                top = this.incrementSpace(board, board.spaces[x][y - counter], possibleMoves, threatenedSpaces)
            }
            if (topRight) {
                topRight = this.incrementSpace(board, board.spaces[x + counter][y - counter], possibleMoves, threatenedSpaces)
            }
            if (right) {
                right = this.incrementSpace(board, board.spaces[x + counter][y], possibleMoves, threatenedSpaces)
            }
            if (bottomRight) {
                bottomRight = this.incrementSpace(board, board.spaces[x + counter][y + counter], possibleMoves, threatenedSpaces)
            }
            if (bottom) {
                bottom = this.incrementSpace(board, board.spaces[x][y + counter], possibleMoves, threatenedSpaces)
            }
            if (bottomLeft) {
                bottomLeft = this.incrementSpace(board, board.spaces[x - counter][y + counter], possibleMoves, threatenedSpaces)
            }
            if (left) {
                left = this.incrementSpace(board, board.spaces[x - counter][y], possibleMoves, threatenedSpaces)
            }

            counter += 1
        }

        return [possibleSpaces, threatenedSpaces];
    }

    //further abstracts behavior from spacesInDirection method
    incrementSpace(board, nextSpace, possibleMoves, threatenedSpaces) {
        if (nextSpace.piece == null && !board.willCauseSelfCheck(this, nextSpace)) {
            possibleMoves.push([nextSpace.loc[0], nextSpace.loc[1]])
            threatenedSpaces.push([nextSpace.loc[0], nextSpace.loc[1]])
        }
        else if (nextSpace.piece.color == this.color) { return false }
        else if (!board.willCauseSelfCheck(this, nextSpace)) { //if nextSpace's piece is an enemy piece
            possibleMoves.push([nextSpace.loc[0], nextSpace.loc[1]])
            threatenedSpaces.push([nextSpace.loc[0], nextSpace.loc[1]])
            return false
        }
        else {
            threatenedSpaces.push([nextSpace.loc[0], nextSpace.loc[1]])
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

class King extends Piece {
    constructor(loc, color) {
        super(loc, color);
    }

    constructor(piece) {
        super(piece)
    }

    //King moveset
    moveSet(board) {
        possibleSpaces = []
        threatenedSpaces = []
        //iterate through rows
        for (let i = loc[0] - 1; i < loc[0] + 2; i++) {
            //iterate through columns
            for (let j = loc[1] - 1; j < loc[1] + 2; j++) {
                //valid space to move to
                if (i >= 0 && i <= 7 && j >= 0 && j <= 7 && [i, j] != this.loc &&
                    (board.spaces[i][j].piece == null || board.spaces[i][j].piece.color != this.color)) {
                    //only include space in moveset if moving there will not result in your king being threatened
                    if (!board.willCauseSelfCheck(this, board.spaces[i][j])) {
                        possibleSpaces.push([i, j])
                    }
                    threatenedSpaces.push([i, j])
                }
            }
        }

        return [possibleSpaces, threatenedSpaces];
    }
}

class Queen extends Piece {
    constructor(loc, color) {
        super(loc, color);
    }

    constructor(piece) {
        super(piece)
    }

    moveSet(board) {
        //Queen moves in all directions
        return this.spacesInDirection(board, true, true);
    }
}

class Bishop extends Piece {
    constructor(loc, color) {
        super(loc, color);
    }

    constructor(piece) {
        super(piece)
    }

    moveSet(board) {
        //Bishop only moves diagonally 
        return this.spacesInDirection(board, false, true);
    }
}

class Knight extends Piece {
    constructor(loc, color) {
        super(loc, color);
    }

    constructor(piece) {
        super(piece)
    }

    moveSet(board) {
        const possibleMoves = []
        const threatenedSpaces = []

        //All moves a knight could make assuming on an empty board with spaces on all sides
        moves = [[loc[0] - 2, loc[1] - 1], [loc[0] - 1, loc[1] - 2], [loc[0] + 2, loc[1] - 1],
        [loc[0] + 1, loc[1] - 2], [loc[0] - 2, loc[1] + 1], [loc[0] - 1, loc[1] + 2], [loc[0] + 1, loc[1] + 2],
        [loc[0] + 2, loc[1] + 1]]

        //loops through each move and decides whether or not it is possible and/or if it is a threatened space
        moves.forEach(item => {
            if (item[0] > 0 && item[0] <= 7 && item[1] > 0 && item[1] <= 7) {
                nextSpace = board.spaces[item[0]][item[1]]
                if (nextSpace.piece == null && !board.willCauseSelfCheck(this, nextSpace)) {
                    possibleMoves.push([item[0], item[1]])
                    threatenedSpaces.push([item[0], item[1]])
                }
                else if (nextSpace.piece.color == this.color) { }
                else if (!board.willCauseSelfCheck(this, nextSpace)) { //if nextSpace's piece is an enemy piece
                    possibleMoves.push([nextSpace.loc[0], nextSpace.loc[1]])
                    threatenedSpaces.push([nextSpace.loc[0], nextSpace.loc[1]])
                }
                else {
                    threatenedSpaces.push([nextSpace.loc[0], nextSpace.loc[1]])
                }
            }
        })

        return [possibleSpaces, threatenedSpaces];
    }
}

class Rook extends Piece {
    constructor(loc, color) {
        super(loc, color);
    }

    constructor(piece) {
        super(piece)
    }

    moveSet(board) {
        //Rook only moves horizontally and vertically
        return this.spacesInDirection(board, true, false);
    }
}

class Pawn extends Piece {
    hasMoved //represents whether or not this piece has made its first move

    constructor(loc, color) {
        super(loc, color);
        this.hasMoved = false
    }

    constructor(piece) {
        super(piece)
        this.hasMoved = piece.hasMoved
    }

    moveSet(board) {
        const x = loc[0]
        const y = loc[1]
        possibleMoves = []
        threatenedSpaces = []

        //if color is white (starts on bottom)
        if (this.color == 1) {
            //scenarios where only one space forward is a legal move
            if (board.spaces[x][y - 1].piece == null && (hasMoved || (!hasMoved && board.spaces[x][y - 2].piece != null))) {
                possibleMoves = [[x, y - 1]]
            }
            //scenarios where one and two spaces forward are legal moves
            else if (!hasMoved && board.spaces[x][y - 1].piece == null && board.spaces[x][y - 2].piece == null) {
                possibleMoves = [[x, y - 1], [x, y - 2]]
            }

            //can take pieces diagonally?
            if (x - 1 > 0 && x - 1 <= 7 && y - 1 > 0 && y - 1 <= 7 && board.spaces[x - 1][y - 1].piece != null &&
                board.spaces[x - 1][y - 1].piece.color != 1) {

                possibleMoves.push([x - 1, y - 1])
            }
            if (x + 1 > 0 && x + 1 <= 7 && y - 1 > 0 && y - 1 <= 7 && board.spaces[x + 1][y - 1].piece != null && 
                board.spaces[x + 1][y - 1].piece.color != 1) {

                possibleMoves.push([x + 1, y - 1])
            }
            threatenedSpaces.push([x + 1][y - 1])
            threatenedSpaces.push([x - 1][y - 1])
        }
        else {
            //scenarios where only one space forward is a legal move
            if (board.spaces[x][y + 1].piece == null && (hasMoved || (!hasMoved && board.spaces[x][y + 2].piece != null))) {
                possibleMoves = [[x, y + 1]]
            }
            //scenarios where one and two spaces forward are legal moves
            else if (!hasMoved && board.spaces[x][y - 1].piece == null && board.spaces[x][y - 2].piece == null) {
                possibleMoves = [[x, y + 1], [x, y + 2]]
            }

            //can take pieces diagonally?
            if (x + 1 > 0 && x + 1 <= 7 && y + 1 > 0 && y + 1 <= 7 && board.spaces[x + 1][y + 1].piece != null && board.spaces[x + 1][y + 1].piece.color != 1) {
                possibleMoves.push([x + 1, y + 1])
            }
            if (x - 1 > 0 && x - 1 <= 7 && y + 1 > 0 && y + 1 <= 7 && board.spaces[x - 1][y + 1].piece != null && board.spaces[x - 1][y + 1].piece.color != 1) {
                possibleMoves.push([x - 1, y + 1])
            }
            threatenedSpaces.push([x - 1, y + 1])
            threatenedSpaces.push([x + 1, y + 1])
        }

        return [possibleMoves, threatenedSpaces]
    }
}