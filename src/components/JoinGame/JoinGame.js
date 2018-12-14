import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
	
};

const JoinGame = ({ addSecondPlayerToGame, addingSecondPlayerToGame, bet, playerOne }) => (
	<div className="JoinGame">
		<h2>Join the Game</h2>
		<p>Join the current game created by {playerOne} by confirming the bet amount of {bet}</p>
		<h2 className="display-1">{bet} <span className="h6">ETH</span></h2>
		{ addingSecondPlayerToGame && <p>Transaction pending...</p>}
		{ !addingSecondPlayerToGame && <Button color="primary" onClick={ addSecondPlayerToGame }>Confirm and Join Game</Button> }
	</div>
);

JoinGame.propTypes = propTypes;
export default JoinGame;
