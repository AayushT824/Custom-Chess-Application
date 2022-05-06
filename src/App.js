import './App.css';
import * as React from 'react';
import ChessBoard from './ChessBoard';
import background from "./img/Background.jpg";
import Board from './Board.js'

function App() {
  let startingBoard = new Board()

  return (
    <div className="Centered" style={{ backgroundImage: `url(${background})`, 
    backgroundSize: "cover", height: "100vh"}}>
      <ChessBoard board = {startingBoard}/>
    </div>
  );
}

export default App;
