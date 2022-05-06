import Piece, { King, Queen, Bishop, Knight, Rook, Pawn } from './Pieces.js';

//TO-DO: En Passant, Pawn Promotion & Stalemate
export default class Board {
    spaces//2D array of all spaces on the board; TOP LEFT = (0,0), BOTTOM RIGHT = (15,15)
    turn //represents player turn; 1 if white, -1 if black
    whiteKingLoc //location of white king
    blackKingLoc //location of black king

    //default constructor for initial game state
    constructor(board) {
        this.spaces = []
        const deepClone = require('lodash.clonedeep')
        if (board == undefined) { //default constructor
            this.whiteKingLoc = [0, 4]
            this.blackKingLoc = [7, 4]
            this.turn = 1

            for (let i = 0; i < 8; i++) {
                let row = []
                for (let j = 0; j < 8; j++) {
                    let space = null
                    if (i === 1) {
                        space = new Space(new Pawn([i, j], -1), [i, j])
                    }
                    else if (i === 6) {
                        space = new Space(new Pawn([i, j], 1), [i, j])
                    }
                    //black bank rank
                    else if (i === 0) {
                        //inserts all special pieces at appropriate locations
                        if (j === 0 || j === 7) { space = new Space(new Rook([i, j], -1), [i, j]) }
                        else if (j === 1 || j === 6) { space = new Space(new Knight([i, j], -1), [i, j]) }
                        else if (j === 2 || j === 5) { space = new Space(new Bishop([i, j], -1), [i, j]) }
                        else if (j === 3) { space = new Space(new Queen([i, j], -1), [i, j]) }
                        else {
                            this.blackKingLoc = [i, j]
                            space = new Space(new King([i, j], -1), [i, j])
                        }
                    }
                    //white back rank
                    else if (i === 7) {
                        //inserts all special pieces at appropriate locations
                        if (j === 0 || j === 7) { space = new Space(new Rook([i, j], 1), [i, j]) }
                        else if (j === 1 || j === 6) { space = new Space(new Knight([i, j], 1), [i, j]) }
                        else if (j === 2 || j === 5) { space = new Space(new Bishop([i, j], 1), [i, j]) }
                        else if (j === 3) { space = new Space(new Queen([i, j], 1), [i, j]) }
                        else {
                            this.whiteKingLoc = [i, j]
                            space = new Space(new King([i, j], 1), [i, j])
                        }
                    }
                    else { //empty space case
                        space = new Space(null, [i, j])
                    }
                    row.push(space)
                }
                this.spaces.push(row)
            }
        }
        else { //Makes a board from existing board without referencing given list in structure at all
            this.whiteKingLoc = board.whiteKingLoc
            this.blackKingLoc = board.blackKingLoc
            this.turn = board.turn
            this.spaces = deepClone(board.spaces)
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
            this.turn *= -1
            const temp = fromSpace.piece
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
        const blackKing = this.spaces[this.blackKingLoc[0]][this.blackKingLoc[1]]
        const whiteKing = this.spaces[this.whiteKingLoc[0]][this.whiteKingLoc[1]]

        if (blackKing.moveSet(this).length == 0 && this.hasCheck() == -1) {
            return -1
        }
        else if (whiteKing.moveSet(this).length == 0 && this.hasCheck() == 1) {
            return 1
        }
        return 0
    }

    //moves a piece without checking if proper criteria are met
    //takes in two board coordinates
    forceMove(fromLoc, toLoc) {
        const fromSpace = this.spaces[fromLoc[0]][fromLoc[1]]
        const toSpace = this.spaces[toLoc[0]][toLoc[1]]

        if (fromSpace.piece == null) {
            return this
        }

        //updates king location if necessary
        if (fromSpace.piece instanceof King) {
            if (fromSpace.piece.color == 1) { this.whiteKingLoc = toSpace.loc }
            else { this.blackKingLoc = toSpace.loc }
        }

        const temp = fromSpace.piece
        fromSpace.piece = null
        temp.loc = toSpace.loc
        toSpace.piece = temp
        return this
    }

    //Evaluates whether or not the fromSpace's piece can move to the toSpace
    isValidMove(fromSpace, toSpace) {
        const piece = fromSpace.piece
        const possibleMoves = piece.moveSet(this)

        return piece != null && piece.color == this.turn && (toSpace.piece == null) && possibleMoves.some(space => space[0] === toSpace.loc[0] && space[1] === toSpace.loc[1])
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
        this.spaces.forEach(row => {
            row.forEach(space => {
                if (space.piece != null) {
                    const enemyKingLoc = space.piece.oppositeKing(this)
                    //checks if spaces threatened by this piece includes enemy king space
                    const moves = space.piece.threatened(this)
                    if (Board.containsLoc(moves, enemyKingLoc)) {
                        return -1 * space.piece.color
                    }
                }
            })
        })
        return 0
    }

    //Checks if given list of locations contains a specific location
    //Checks by contents, not reference
    static containsLoc(list, loc) {
        list.forEach(item => {
            if (item[0] == loc[0] && item[1] == loc[1]) {
                return true
            }
        })
        return false
    }
}

class Space {
    piece //represents piece occupying space, null if none
    loc //represents coordinate of space on the board (0,0) top left and (15, 15) bottom right

    constructor(piece, loc) {
        this.piece = piece
        if (loc[0] > 7 || loc[0] < 0 || loc[1] > 7 || loc[1] < 0 || loc[0] == null || loc[1] == null) {
            throw ("Invalid coordinates given to Space constructor")
        }
        this.loc = loc
    }
}
