import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
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

const PlayerInformation = ({ player, handleInputChange, name, addingPlayerToLeaderboard, addPlayerToLeaderboard }) => (
  <div className="PlayerInformation pt-5">
    <h3>Player Information</h3>
    <ListGroup flush>
      <ListGroupItem>
        <InputPlayerName
          handleInputChange={ handleInputChange }
          value={ name }
          addingPlayerToLeaderboard={ addingPlayerToLeaderboard }
          addPlayerToLeaderboard={ addPlayerToLeaderboard }
        />
      </ListGroupItem>
      <ListGroupItem>Rank: {player.rank}</ListGroupItem>
      <ListGroupItem>Wins: {player.wins}</ListGroupItem>
      <ListGroupItem>Losses: {player.losses}</ListGroupItem>
      <ListGroupItem>Ties: {player.ties}</ListGroupItem>
    </ListGroup>
  </div>
);

PlayerInformation.propTypes = propTypes;
PlayerInformation.defaultProps = defaultProps;
export default PlayerInformation;
