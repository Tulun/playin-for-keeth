import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';

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

const PlayerInformation = ({ player }) => (
  <div className="PlayerInformation">
    <h3>Player Information</h3>
    <ListGroup flush>
      <ListGroupItem>Name: {player.name}</ListGroupItem>
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
