export class Board {
    spaces //2D array of all spaces on the board; TOP LEFT = (0,0), BOTTOM RIGHT = (15,15)
    turn //represents player turn; 1 if white, -1 if black
    whiteKingLoc //location of white king
    blackKingLoc //location of black king

    //default constructor for initial game state
    constructor() {
        this.whiteKingLoc = [0, 4]
        this.blackKingLoc = [7, 4]
        this.turn = 1

        for (let i = 0; i < 8; i++) {
            const row = []
            for (let j = 0; j < 8; j++) {
                if (i == 1) {
                    const space = new Space(new Pawn([i, j], -1), [i, j])
                }
                else if (i == 6) {
                    const space = new Space(new Pawn([i, j], 1), [i, j])
                }
                //black bank rank
                else if (i == 0) {
                    //inserts all special pieces at appropriate locations
                    if (j == 0 || j == 7) { const space = new Space(new Rook([i, j], -1), [i, j]) }
                    else if (j == 1 || j == 6) { const space = new Space(new Knight([i, j], -1), [i, j]) }
                    else if (j == 2 || j == 5) { const space = new Space(new Bishop([i, j], -1), [i, j]) }
                    else if (j == 3) { const space = new Space(new Queen([i, j], -1), [i, j]) }
                    else {
                        this.blackKingLoc = [i, j]
                        const space = new Space(new King([i, j], -1), [i, j])
                    }
                }
                //white back rank
                else if (i == 7) {
                    //inserts all special pieces at appropriate locations
                    if (j == 0 || j == 7) { const space = new Space(new Rook([i, j], 1), [i, j]) }
                    else if (j == 1 || j == 6) { const space = new Space(new Knight([i, j], 1), [i, j]) }
                    else if (j == 2 || j == 5) { const space = new Space(new Bishop([i, j], 1), [i, j]) }
                    else if (j == 3) { const space = new Space(new Queen([i, j], 1), [i, j]) }
                    else {
                        this.whiteKingLoc = [i, j]
                        const space = new Space(new King([i, j], 1), [i, j])
                    }
                }
                else { //empty space case
                    const space = new Space(null, [i, j])
                }
                row.push(space)
            }
            this.spaces.push(row)
        }
    }

    //Makes a board from existing board without referencing given list in structure at all
    constructor(board) {
        this.whiteKingLoc = board.whiteKingLoc
        this.blackKingLoc = board.blackKingLoc
        this.spaces = board.spaces

        for (let i = 0; i < 8; i++) {
            const row = []
            for (let j = 0; j < 8; j++) {
                const space = new Space(new Piece(spaces[i][j].piece), spaces[i][j].piece.loc)
                row.push(space)
            }
            this.spaces.push(row)
        }
    }

    //moves piece by modifying this board and returning the new board as well
    //checks if move is legal
    move(fromSpace, toSpace) {
        if (this.isValidMove(fromSpace, toSpace)) {
            //updates king location if necessary
            if (fromSpace.piece instanceof King) {
                if (fromSpace.piece.color == 1) { this.whiteKingLoc = toSpace.loc }
                else { this.blackKingLoc = toSpace.loc }
            }
            turn *= -1
            temp = fromSpace.piece
            fromSpace.piece = null
            temp.loc = toSpace.loc
            toSpace.piece = temp

            return this
        }
        else {
            return
        }
    }

    //returns 1 if white has won, -1 if black has won and 0 otherwise
    hasWinner() {
        blackKing = this.spaces[this.blackKingLoc[0]][this.blackKingLoc[1]]
        whiteKing = this.spaces[this.whiteKingLoc[0]][this.whiteKingLoc[1]]

        
        if (blackKing.moveSet()[0].length == 0 && this.hasCheck() == -1) {
            return -1
        }
        else if (whiteKing.moveSet()[0].length == 0 && this.hasCheck() == 1) {
            return 1
        }
        return 0
    }

    //moves a piece without checking if proper criteria are met
    //takes in two board coordinates
    forceMove(fromLoc, toLoc) {
        const fromSpace = this.spaces[fromLoc[0]][fromLoc[1]]
        const toSpace = this.spaces[toLoc[0]][toLoc[1]]

        temp = fromSpace.piece
        fromSpace.piece = null
        temp.loc = toSpace.loc
        toSpace.piece = temp
        return this
    }

    //Evaluates whether or not the fromSpace's piece can move to the toSpace
    isValidMove(fromSpace, toSpace) {
        const piece = fromSpace.piece

        return piece.moveSet(this).contains(toSpace) && !(piece == null) && !(toSpace.piece == null)
    }

    //Checks if a player's move puts themselves in check, thus making it illegal
    willCauseSelfCheck(piece, toSpace) {
        if (piece == null) { return false }

        //player who made this move
        const player = piece.color
        //creates copy of board with this move having been made
        const newBoard = new Board(this).forceMove(piece.loc, toSpace.loc)

        return newBoard.hasCheck() == player
    }

    //returns 1 if white is in check, -1 if black is in check, and 0 if no player is in check
    hasCheck() {
        spaces.forEach(row => {
            row.forEach(space => {
                if (space.piece != null) {
                    enemyKingLoc = space.piece.oppositeKing(this)
                    //checks if spaces threatened by this piece includes enemy king space
                    if (space.piece.moveset()[1].contains(enemyKingLoc)) {
                        return -1 * space.piece.color
                    }
                }
            })
        })
        return 0
    }
}

class Space {
    piece //represents piece occupying space, null if none
    loc //represents coordinate of space on the board (0,0) top left and (15, 15) bottom right

    constructor(piece, loc) {
        this.piece = piece
        if (loc[0] > 7 || loc[0] < 0 || loc[1] > 7 || loc[1] < 0) {
            throw ("Invalid coordinates given to Space constructor")
        }
        this.loc = loc
    }
}
