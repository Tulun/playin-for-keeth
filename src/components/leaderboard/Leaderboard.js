import React from 'react';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';

// Proptypes
const propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    playersAddress: PropTypes.number,
    wins: PropTypes.number.isRequired,
    losses: PropTypes.number.isRequired,
    ties: PropTypes.number.isRequired,
  })).isRequired,
}

const Leaderboard = ({ players }) => {
  const sortedPlayers = players.sort( (a, b) => b.wins - a.wins || a.losses - b.losses );
  console.log('sp', sortedPlayers);
  return (
    <div className="Leaderboard">
      { sortedPlayers.length ? 
        <Table responsive>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Wins</th>
              <th scope="col">Losses</th>
              <th scope="col">Ties</th>
              <th scope="col">Rank</th>
            </tr>
          </thead>
          <tbody>
            { sortedPlayers.map( (player, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{player.id}</th>
                  <td>{player.name}</td>
                  <td>{player.playerAddress}</td>
                  <td>{player.wins}</td>
                  <td>{player.losses}</td>
                  <td>{player.ties}</td>
                  <td>{index + 1}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      : <p>No players on the leaderboard. Be the first!</p>}
    </div>
  )

};

Leaderboard.propTypes = propTypes;
export default Leaderboard;