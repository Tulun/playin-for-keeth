import React from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import PropTypes from 'prop-types';

import InputPlayerName from '../inputPlayerName/InputPlayerName';

const propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    wins: PropTypes.number.isRequired,
    losses: PropTypes.number.isRequired,
    ties: PropTypes.number.isRequired,
  }).isRequired,
}

const defaultProps = {
  player: {
    name: 'Player Name',
    rank: 0,
    wins: 0,
    losses: 0,
    ties: 0
  }
}

const PlayerInformation = ({ player, handleInputChange, handleViewPage, name, addingPlayerToLeaderboard, addPlayerToLeaderboard, players }) => {
  let rank = 0;
  if (players.length) {
    const sortedPlayers = players.sort( (a, b) => b.wins - a.wins || a.losses - b.losses );

    sortedPlayers.map( (p, index) => {
      if (p.id === player.id) {
        return rank = index + 1;
      };
      return null;
    })
  }
  return (
    <div className="PlayerInformation pt-5">
      <h3>Player Information</h3>
      <ListGroup flush>
        {player.name === "" &&
          <ListGroupItem>
            <InputPlayerName
              handleInputChange={ handleInputChange }
              value={ name }
              addingPlayerToLeaderboard={ addingPlayerToLeaderboard }
              addPlayerToLeaderboard={ addPlayerToLeaderboard } /> 
          </ListGroupItem>
        }
        {player.name !== "" && 
          <ListGroupItem>Name: {player.name}</ListGroupItem>
        }
        <ListGroupItem>Rank: {rank}</ListGroupItem>
        <ListGroupItem>Wins: {player.wins}</ListGroupItem>
        <ListGroupItem>Losses: {player.losses}</ListGroupItem>
        <ListGroupItem>Ties: {player.ties}</ListGroupItem>
      </ListGroup>
    </div>
  )

}


PlayerInformation.propTypes = propTypes;
PlayerInformation.defaultProps = defaultProps;
export default PlayerInformation;
