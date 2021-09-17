import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [player, setPlayer] = useState({});
  const [userID, setUserID] = useState(localStorage.getItem("userID"));
  const [changed, setChanged] = useState(false);
  //localStorage.clear();

  useEffect(async () => {
    if (userID === undefined || userID === null) {
      const response = await fetch(`http://localhost:3001/player/`, {
        method: "POST",
      });
      const data = await response.json();
      setUserID(data._id);
      localStorage.setItem("userID", data._id);
    } else {
      setChanged(true);
    }
  }, []);

  useEffect(async () => {
    const response = await fetch(`http://localhost:3001/player/${userID}`);
    setPlayer(await response.json());
    setChanged(false);
  }, [changed]);

  const playRound = () => {
    fetch(`http://localhost:3001/player/${userID}`, {
      method: "POST",
    });
    setChanged(true);
  };

  const restartGame = () => {
    fetch(`http://localhost:3001/player/${userID}/rounds`, {
      method: "DELETE",
    });
    setChanged(true);
  };

  function toggleTable() {
    if (player.rounds === undefined || player.rounds.length == 0) {
      return;
    }
    return (
      <tbody>
        {player.rounds.map((round) => {
          return (
            <tr key={round._id}>
              <td key={`first${round._id}`}>{round.firstPlayer}</td>
              <td key={`second${round._id}`}>{round.secondPlayer}</td>
              <td key={`result${round._id}`}>{round.result}</td>
            </tr>
          );
        })}
      </tbody>
    );
  }
  return (
    <React.Fragment>
      <div className="row">
        <button className="btn-1" onClick={playRound}>
          play round
        </button>
        <div className="out">{player.rounds ? player.rounds.length : 0}</div>
        <button className="btn-1" onClick={restartGame}>
          restart game
        </button>
      </div>
      <div className="center">
        <table className="center-table">
          <thead>
            <tr>
              <th className="table-title" colSpan="3">
                Results Table
              </th>
            </tr>
            <tr>
              <th>first player</th>
              <th>second player</th>
              <th>result</th>
            </tr>
          </thead>
          {toggleTable()}
        </table>
      </div>
    </React.Fragment>
  );
}

export default App;
