import React, { useState } from 'react';
import blackQueen from "./img/queen.png";
import blackBishop from "./img/bishop.png";
import blackKnight from "./img/knight.png";
import blackRook from "./img/rook.png";

import whiteQueen from "./img/whiteQueen.png";
import whiteBishop from "./img/whiteBishop.png";
import whiteKnight from "./img/whiteKnight.png";
import whiteRook from "./img/whiteRook.png";

const ChessBoard = (props) => {
    var board = props.board

    //Handles space selection and updates board visualization accordingly
    const [spaceSelected, setSelect] = useState(null);
    let frozen = false
    const [pawnPromotion, setPromotion] = useState(0);

    //Chooses a color for the space at the given location (loc)
    const spaceColor = (loc) => {
        if ((loc[0] + 1) % 2 === 1) { //column
            if ((loc[1] + 1) % 2 === 1) { //row
                return "rgb(215,189,201)"
            }
            else {
                return "rgb(153,1,73)"
            }
        }
        else {
            if ((loc[1] + 1) % 2 === 1) { //row
                return "rgb(153,1,73)"
            }
            else {
                return "rgb(215,189,201)"
            }
        }
    }

    //returns an image for the given piece
    const chooseImage = (piece) => {
        return piece.getImage()
    }

    //Handles a click on a particular space
    const handleClick = (space) => {
        if (!frozen) {
            if (spaceSelected != null || space.piece != null) {
                if (spaceSelected == null) {
                    setSelect(space)
                }
                else {
                    board.move(spaceSelected, space)
                    if (space.piece != null) {
                        setPromotion(space.piece.needPromotion())
                    }
                    setSelect(null)
                }
            }
        }

        if (board.hasWinner() !== 0 || pawnPromotion !== 0) {
            frozen = true
        }
    }

    const promoteBoard = (piece) => {
        board.promote(piece)
        frozen = false
        setPromotion(0)
    }

    //Creates HTML table to represent chess board; each row has row number as key and each space has a column
    //number as a key.
    //Board is centered and images are chosen depending on piece type
    let renderedBoard = () =>
        <div>
            <table width={640} height={640} cellSpacing={0}>
                <tbody>
                    {board.spaces.map(row =>
                        <tr key={row[0].loc[0]}>
                            {row.map(space =>
                                <td align="center" style={{ backgroundColor: spaceColor(space.loc) }}
                                    onClick={() => handleClick(space)} height="80" width="80" key={space.loc[1]}>
                                        {chooseImage(space.piece)}
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    let promotionBoard = (color) =>
        <div id="PromotionMenu">
            <table cellSpacing={0} className="Centered">
                <tbody>
                    <tr>
                        <td key={'Queen'} onClick={() => promoteBoard('Queen')} height="160" width="160">
                            <div className='Centered'>
                                <img src={color === 1 ? whiteQueen : blackQueen} height={140} width={140}/>
                            </div>
                        </td>
                        <td key={'Bishop'} onClick={() => promoteBoard('Bishop')} height="160" width="160">
                            <div className='Centered'>
                                <img src={color === 1 ? whiteBishop : blackBishop} height={140} width={140} />
                            </div>
                        </td>
                        <td key={'Knight'} onClick={() => promoteBoard('Knight')} height="160" width="160">
                            <div className='Centered'>
                                <img src={color === 1 ? whiteKnight : blackKnight} height={140} width={140} />
                            </div>
                        </td>
                        <td key={'Rook'} onClick={() => promoteBoard('Rook')} height="160" width="160">
                            <div className='Centered'>
                                <img src={color === 1 ? whiteRook : blackRook} height={140} width={140} />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    if (pawnPromotion === 1) {
        return (
            <div>
                {renderedBoard()}
                {promotionBoard(1)}
            </div>
        );
    }
    else if (pawnPromotion === -1) {
        return (
            <div>
                {renderedBoard()}
                {promotionBoard(-1)}
            </div>
        );
    }
    else {
        return (
            <div>
                {renderedBoard()}
            </div>
        )
    }
}

export default ChessBoard;