import './App.css';
import * as React from 'react';
import bg from './Background.jpg'
import ChessBoard from './ChessBoard';
import { Board } from './Board';

function App() {
  const startingBoard = new Board()

  return (
    <div
      class="bg_image"
      style={{
        backgroundImage: 'url(' + bg + ')',
        backgroundSize: "cover",
        height: "100vh",
        color: "#f5f5f5"
      }}>
      <ChessBoard board = {startingBoard}/>
    </div>
  );
}

export default App;
