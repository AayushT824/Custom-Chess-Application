import { King, Queen, Bishop, Knight, Rook, Pawn, Empty } from './Pieces.js';

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
        if (board === undefined) { //default constructor
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
                        space = new Space(new Empty([i, j]), [i, j])
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
        console.log(toSpace)
        if (this.isValidMove(fromSpace, toSpace)) {
            //updates king location if necessary, as well as pawn hasMoved field
            console.log(toSpace)
            fromSpace.piece.updateLoc(this, toSpace)

            this.turn *= -1
            const temp = fromSpace.piece
            fromSpace.piece = new Empty(fromSpace.loc)
            temp.loc = toSpace.loc
            toSpace.piece = temp

            return true
        }
        else {
            return false
        }
    }

    //promotes pawn to given piece
    promote(piece) {
        this.spaces[0].forEach(space => {
            space.piece.promote(this, piece)
        })
        this.spaces[7].forEach(space => {
            space.piece.promote(this, piece)
        })
    }

    //returns 1 if white has won, -1 if black has won, 2 if stalemate and 0 otherwise
    hasWinner() {

        if (this.hasCheck() === -1 && !this.possibleMove(-1)) {
            return 1
        }
        else if (this.hasCheck() === 1 && !this.possibleMove(1)) {
            return -1
        }
        else if((!this.possibleMove(1) && this.turn === 1) || (!this.possibleMove(-1) && this.turn === -1)) {
            return 2
        }
        else {
            return 0
        }
    }

    possibleMove(color) {
        var possible = false

        this.spaces.forEach(row => {
            row.forEach(space => {
                if (space.piece.color === color) {
                    space.piece.moveSet(this).forEach(move => {
                        if (!this.willCauseSelfCheck(space.piece, this.spaces[move[0]][move[1]])) {
                            possible = true
                        }
                    })
                }
            })
        })

        return possible
    }

    //moves a piece without checking if proper criteria are met
    //takes in two board coordinates
    forceMove(fromLoc, toLoc) {
        const fromSpace = this.spaces[fromLoc[0]][fromLoc[1]]
        const toSpace = this.spaces[toLoc[0]][toLoc[1]]

        //updates king location if necessary
        fromSpace.piece.updateLoc(this, toSpace)

        fromSpace.piece.modify(fromSpace, toSpace)

        return this
    }

    //Evaluates whether or not the fromSpace's piece can move to the toSpace
    isValidMove(fromSpace, toSpace) {
        const piece = fromSpace.piece
        const possibleMoves = piece.moveSet(this)   

        return piece.canMove(this) && piece.color === this.turn && possibleMoves.some(space => space[0] === toSpace.loc[0] && space[1] === toSpace.loc[1]) && !this.willCauseSelfCheck(piece, toSpace)
    }

    //Checks if a player's move puts themselves in check, thus making it illegal
    willCauseSelfCheck(piece, toSpace) {
        //player who made this move
        const player = piece.color
        //creates copy of board with this move having been made
        const newBoard = new Board(this).forceMove(piece.loc, toSpace.loc)

        return newBoard.hasCheck() === player
    }

    //returns 1 if white is in check, -1 if black is in check, and 0 if no player is in check
    hasCheck() {
        let checked = 0
        this.spaces.forEach(row => {
            row.forEach(space => {
                if (space.piece.color !== 0) {
                    const enemyKingLoc = space.piece.oppositeKing(this)

                    //checks if spaces threatened by this piece includes enemy king space
                    const moves = space.piece.moveSet(this)
                    if (Board.containsLoc(moves, enemyKingLoc)) {
                        checked = -1 * space.piece.color
                    }
                }
            })
        })
        return checked
        
    }

    //Checks if given list of locations contains a specific location
    //Checks by contents, not reference
    static containsLoc(list, loc) {
        let found = false
        list.forEach(item => {
            if (item[0] === loc[0] && item[1] === loc[1]) {
                found = true
            }
        })
        return found
    }
}

class Space {
    piece //represents piece occupying space, null if none
    loc //represents coordinate of space on the board (0,0) top left and (15, 15) bottom right

    constructor(piece, loc) {
        this.piece = piece
        if (loc[0] > 7 || loc[0] < 0 || loc[1] > 7 || loc[1] < 0 || loc[0] == null || loc[1] == null) {
            // eslint-disable-next-line no-throw-literal
            throw("Invalid coordinates given to Space constructor")
        }
        this.loc = loc
    }
}