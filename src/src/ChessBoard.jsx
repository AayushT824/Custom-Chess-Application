import React, { useState } from 'react';

const ChessBoard = (props) => {
    const board = props.board

    //Handles space selection and updates board visualization accordingly
    const [spaceSelected, setSelect] = useState(null);

    //Chooses a color for the space at the given location (loc)
    const spaceColor = (loc) => {
        if ((loc[0] + 1) % 2 == 1) { //column
            if ((loc[1] + 1) % 2 == 1) { //row
                return "rgb(215,189,201)"
            }
            else {
                return "rgb(153,1,73)"
            }
        }
        else {
            if ((loc[1] + 1) % 2 == 1) { //row
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

        if (spaceSelected != null || space.piece != null) {
            if (spaceSelected == null) {
                setSelect(space)
            }
            else {
                board.move(spaceSelected, space);
                setSelect(null)
            }
        }
    }

    //Creates HTML table to represent chess board; each row has row number as key and each space has a column
    //number as a key.
    //Board is centered and images are chosen depending on piece type
    return (
        <div>
            <table width={480} height={480} cellSpacing={0}>
                <tbody>
                    {board.spaces.map(row =>
                        <tr key={row[0].loc[0]}>
                            {row.map(space =>
                                <td style={{ backgroundColor: spaceColor(space.loc) }}
                                    onClick={() => handleClick(space)} height="60" width="60" key={space.loc[1]}>
                                    {space.piece != null &&
                                        chooseImage(space.piece)
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ChessBoard;