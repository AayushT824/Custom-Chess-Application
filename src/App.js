import './App.css';
import * as React from 'react';
import ChessBoard from './ChessBoard';
import background from "./img/Background.jpg";
import Board from './Board.js'
import { useState } from 'react';


function App() {
  let [startingBoard, setBoard] = useState(new Board())

  let restartButton = 
        <button className='button' onClick={() => setBoard(new Board())}>
            New Game
        </button>

  return (
    <div className="Centered" style={{ backgroundImage: `url(${background})`, 
    backgroundSize: "cover", height: "100vh"}}>
      {restartButton}
      <ChessBoard board = {startingBoard}/>
    </div>
  );
}

export default App;
