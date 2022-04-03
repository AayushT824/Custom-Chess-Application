import React from 'react';

//can also destructure within parameter parantheses on next line
const ChessBoard = (props) => {
    const board = props.board

    //If trying to insert binding within a string, put $ before it denote
    //that it is a variable (i.e ${props.firstName})
    return  (
        <div>
            <h6> 
                Employee Name: {firstName}, {age}, {id}
            </h6>
        </div>
    );
}

export default ChessBoard;